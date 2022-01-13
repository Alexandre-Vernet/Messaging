import { Injectable } from '@angular/core';
import {
    collection,
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

            querySnapshot.docChanges().forEach(async (change) => {
                // Listen only for the current conversation
                if (change.doc.id === conversationId) {

                    // Message added or modified
                    if (change.type === 'added' || change.type === 'modified') {
                        const dataObject = change.doc.data();

                        for (let userId in dataObject) {
                            // Get user id
                            await this.auth.getById(userId).then((user) => {

                                // Get id message
                                const idMessage = Object.keys(dataObject[userId]);
                                idMessage.forEach((msgId) => {
                                    // Users info
                                    const { message, file, date } = dataObject[userId][msgId];

                                    // Create message
                                    const messageObject = new Message(msgId, user.email, user.firstName, user.lastName, message, file, date);

                                    // If message doesn't exist, add it to array
                                    // Else, update it
                                    this.messages.findIndex(x => x.id === msgId) === -1 ? this.messages.push(messageObject) : this.messages.find(x => x.id === msgId).message = message;
                                });
                            });
                        }
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
                [this.user.id]: {
                    [messageId]: {
                        message: newMessage,
                        date: new Date(),
                    }
                }
            };
            await setDoc(messageRef, message, { merge: true });
        }
        if (isAFile) {
            await setDoc(messageRef, isAFile, { merge: true });
        }
    }

    async getMessageById(conversationId: string, messageId: string) {
        const messageRef = doc(this.db, 'conversations', conversationId);

        const docSnap = await getDoc(messageRef);

        let messageToEdit: Message;

        if (docSnap.exists()) {
            const dataObject = docSnap.data();

            for (let userId in dataObject) {
                // Get message of user
                if (userId === this.user.id) {
                    const idMessage = Object.keys(dataObject[userId]);
                    idMessage.forEach((msgId) => {
                        if (msgId === messageId) {
                            const { message, file, date } = dataObject[userId][msgId];
                            messageToEdit = new Message(msgId, this.user.email, this.user.firstName, this.user.lastName, message, file, date);
                        }
                    });
                }
            }
        } else {
            Toast.error('This conversation does not exist');
        }
        return messageToEdit;
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
    async editMessage(conversationId: string, messageId: string, newMessage: string) {
        const messageRef = doc(this.db, 'conversations', conversationId);

        // Update message in firestore
        await updateDoc(messageRef, {
            [`${ this.user.id }.${ messageId }`]: {
                messageId: messageId,
                message: newMessage,
                date: new Date(),
            }
        })
            .catch((error) => {
                console.error(error);
                Toast.error('Error updating message', error.message);
            });
    }

    async deleteMessage(conversationId: string, messageId: string) {
        const conversationRef = doc(this.db, 'conversations', conversationId);
        // Update firestore
        await setDoc(conversationRef, {
            [this.user.email]: {
                messages: this.messages
            }
        });
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
        let contactName: User;

        // Get conversation
        const docRef = doc(this.db, 'conversations', conversationId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const dataObject = docSnap.data();
            for (let userId in dataObject) {

                if (userId !== this.user.id) {
                    await this.auth.getById(userId).then((user) => {
                        contactName = user;
                    });
                }
            }
        } else {
            Toast.error('Error getting contact name');
        }

        return contactName;
    }
}
