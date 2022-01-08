import { Injectable } from '@angular/core';
import {
    collection,
    deleteField,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { Message } from 'src/app/class/message';
import { User } from 'src/app/class/user';
import { AuthenticationService } from '../authentication/authentication.service';
import { Toast } from '../../class/toast';

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    user: User;
    db = getFirestore();
    messages: Message[] = [];

    constructor(private auth: AuthenticationService) {
        setTimeout(() => {
            this.auth.getAuth().then((user) => {
                this.user = user;
            });
        }, 2000);
    }

    async getMessages(conversationId: string = 'ZsPWwcDMASeNVjYMk4kc'): Promise<Message[]> {
        const q = query(collection(this.db, 'conversations'));
        // Listen for new messages
        onSnapshot(q, (querySnapshot) => {

            querySnapshot.docChanges().forEach((change) => {
                // Listen only for the current conversation
                if (change.doc.id === conversationId) {

                    // Message added or modified
                    if (change.type === 'added' || change.type === 'modified') {
                        const dataObject = change.doc.data();
                        const dataArray = Object.keys(dataObject).map((k) => {
                            return dataObject[k];
                        });

                        // Loop on all users in conversation
                        dataArray.forEach((data) => {
                            const { userInfo, messages } = data;

                            // User infos
                            const { userId, firstName, lastName, email, profilePicture, dateCreation } = userInfo;

                            // Push all messages in messagesArray
                            const messagesArray = [];
                            for (const messagesKey in messages) {
                                const { messageId, message, file, date } = messages[messagesKey];
                                messagesArray.push({
                                    messageId,
                                    message,
                                    file,
                                    date,
                                });
                            }

                            messagesArray.forEach((message) => {
                                const messageObject = new Message(message.messageId, email, firstName, lastName, message.message, message.file, message.date);
                                this.messages.findIndex(x => x.id === message.messageId) === -1 ? this.messages.push(messageObject) : console.log('This item already exists');
                            });
                        });
                    }
                    // Message deleted
                    if (change.type === 'removed') {
                        const id = change.doc.id;
                        const index = this.messages.findIndex((m) => m.id === id);
                        this.messages.splice(index, 1);
                    }
                }
            });
            // Sort messages by date
            this.messages.sort((a: any, b: any) => {
                return a.date - b.date;
            });
        });

        return this.messages;
    }

    async sendMessage(conversationId: string, newMessage: string, isAFile?) {
        const messageRef = doc(this.db, 'conversations', conversationId);
        const messageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        if (!isAFile) {
            const message = {
                [this.user.email]:
                    {
                        userInfo: {
                            userId: this.user.id,
                            email: this.user.email,
                            firstName: this.user.firstName,
                            lastName: this.user.lastName,
                            profilePicture: this.user.profilePicture ? this.user.profilePicture : null,
                            dateCreation: this.user.dateCreation
                        },
                        messages: {
                            [messageId]: {
                                message: newMessage,
                                date: new Date(),
                                messageId: messageId
                            }
                        }
                    }
            };
            await setDoc(messageRef, message, { merge: true });
        }
        if (isAFile) {
            await setDoc(messageRef, isAFile, { merge: true });
        }
    }

    async getMessageId(messageId: string) {
        const messageRef = doc(this.db, 'messages', messageId);

        const docSnap = await getDoc(messageRef);
        let a: Message;

        if (docSnap.exists()) {
            const id = docSnap.id;
            const { email, firstName, lastName, message, file, date } = docSnap.data();
            a = new Message(id, email, firstName, lastName, message, file, date);
        }
        return a;
    }

    // Get last message send by user
    async getLastMessage() {
        const messageRef = query(collection(this.db, 'messages'));

        // Get message with the highest date
        const q = query(
            messageRef,
            where('email', '==', this.user.email),
            orderBy('date', 'desc'),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        let lastMessage: Message;

        querySnapshot.forEach((docRef) => {
            const id = docRef.id;
            const { email, firstName, lastName, message, file, date } = docRef.data();
            lastMessage = new Message(id, email, firstName, lastName, message, file, date);
        });
        return lastMessage;
    }

    // Edit message
    async editMessage(newMessage: string, messageId: string) {
        const messageRef = doc(this.db, 'messages', messageId);

        await updateDoc(messageRef, {
            message: newMessage,
        })
            .catch((error) => {
                console.error(error);
                Toast.error('Error updating message', error.message);
            });
    }

    async deleteMessage(conversationId: string, messageId: string) {
        // Remove message from messages
        const index = this.messages.findIndex((m) => m.id === messageId);
        this.messages.splice(index, 1);

        // Update firestore
        // const docSnap = await getDoc(messageRef);
        //
        // if (docSnap.exists()) {
        //     console.log("Document data:", docSnap.data());
        // } else {
        //     // doc.data() will be undefined in this case
        //     console.log("No such document!");
        // }
    }

    async getUsers() {
        const q = query(collection(this.db, 'users'));
        const users: User[] = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docRef) => {
            const id = docRef.id;
            const { email, firstName, lastName, profilePicture, dateCreation } = docRef.data();

            const newUser = new User(
                id,
                firstName,
                lastName,
                email,
                profilePicture,
                dateCreation
            );
            users.push(newUser);
        });

        return users;
    }

    async getContactName(conversationId: string) {
        let contactName: string;

        // Get conversation
        const docRef = doc(this.db, 'conversations', conversationId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const dataObject = docSnap.data();
            // Store conversation data
            const dataArray = Object.keys(dataObject).map((k) => {
                return dataObject[k];
            });

            // Loop on all users in conversation
            dataArray.forEach((data) => {
                const { userInfo } = data;
                // Get email of person in conversation
                if (userInfo.email !== this.user.email) {
                    contactName = userInfo.firstName + ' ' + userInfo.lastName;
                }
            });
        } else {
            Toast.error('Error getting contact name');
        }

        return contactName;
    }
}
