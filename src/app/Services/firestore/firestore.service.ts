import { Injectable } from '@angular/core';
import {
    collection,
    doc, getDoc,
    getDocs,
    getFirestore,
    limit,
    onSnapshot,
    orderBy,
    query, setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { Message } from 'src/app/class/message';
import { User } from 'src/app/class/user';
import { AuthenticationService } from '../authentication/authentication.service';
import { Toast } from '../../class/toast';
import { debuglog } from 'util';

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

                    // Message added
                    if (change.type === 'added') {
                        const dataObject = change.doc.data();
                        // console.log(dataObject);

                        // // Get email user
                        // const email = Object.keys(dataObject)[i];
                        // console.log(email);
                        //
                        // // Extract userInfo
                        // const userInfo = change.doc.data()[email].userInfo;
                        // const { firstName, lastName } = userInfo;
                        //
                        // // Extract messages
                        // const messages = change.doc.data()[email].messages;
                        // const id = Object.keys(messages)[i];
                        //
                        // // Create array of messages
                        // const messagesArray = Object.values(messages);
                        // messagesArray.forEach((message: Message) => {
                        //     const newMessage = new Message(id, email, firstName, lastName, message.message, message.file, message.date);
                        //     this.messages.push(newMessage);
                        // });
                        // console.log(this.messages);


                        const dataArray = Object.keys(dataObject).map((k) => {
                            return dataObject[k];
                        });

                        dataArray.forEach((data: any, i) => {
                            const { userInfo, messages } = data;
                            const { firstName, lastName, email } = userInfo;
                            const id = Object.keys(messages);
                            const messagesArray = Object.values(messages);
                            messagesArray.forEach((message: Message, index) => {
                                const newMessage = new Message(id[index], email, firstName, lastName, message.message, message.file, message.date);
                                this.messages.push(newMessage);
                            });
                        });

                        console.log(this.messages);
                    }

                    // // Get emails
                    // const emails = [];
                    // for (const documentDataKey in change.doc.data()) {
                    //     emails.push(documentDataKey);
                    // }
                    //
                    // emails.forEach((email) => {
                    //     console.log(Object.values(change.doc.data()[email]));
                    // });


                    // // Extract userInfo
                    // const userInfo = change.doc.data()[email].userInfo;
                    // const { id, firstName, lastName } = userInfo;
                    //
                    // // Extract messages
                    // const messages = change.doc.data()[email].messages;
                    //
                    // // Create array of messages
                    // const messagesArray = Object.values(messages);
                    // messagesArray.forEach((message: Message) => {
                    //     const newMessage = new Message(id, email, firstName, lastName, message.message, message.file, message.date);
                    //     this.messages.push(newMessage);
                    // });

                    // console.log(this.messages);
                    // Get email user
                    // const email = Object.keys(change.doc.data())[index];
                    // console.log(email);

                    // // Extract userInfo
                    // const userInfo = change.doc.data()[email].userInfo;
                    // const { id, firstName, lastName } = userInfo;
                    //
                    // // Extract messages
                    // const messages = change.doc.data()[email].messages;
                    //
                    // // Create array of messages
                    // const messagesArray = Object.values(messages);
                    // messagesArray.forEach((message: Message) => {
                    //     const newMessage = new Message(id, email, firstName, lastName, message.message, message.file, message.date);
                    //     this.messages.push(newMessage);
                    // });


                    // // Message added
                    // if (change.type === 'added') {
                    //     const id = change.doc.id;
                    //     const { email, firstName, lastName, message, file, date } = change.doc.data();
                    //     const newMessage = new Message(id, email, firstName, lastName, message, file, date);
                    //     this.messages.push(newMessage);
                    // }
                    //
                    // // Message modified
                    // if (change.type === 'modified') {
                    //     const id = change.doc.id;
                    //     const { email, firstName, lastName, message, file, date } = change.doc.data();
                    //     const newMessage = new Message(id, email, firstName, lastName, message, file, date);
                    //     const index = this.messages.findIndex((m) => m.id === id);
                    //     this.messages[index] = newMessage;
                    // }
                    //
                    // // Message deleted
                    // if (change.type === 'removed') {
                    //     const id = change.doc.id;
                    //     const index = this.messages.findIndex((m) => m.id === id);
                    //     this.messages.splice(index, 1);
                    // }
                }
            });
        });

        // const q = query(collection(this.db, 'conversations'), orderBy('date', 'asc'));
        // onSnapshot(q, (querySnapshot) => {
        //     querySnapshot.docChanges().forEach((change) => {
        //
        //         // Message added
        //         if (change.type === 'added') {
        //             const id = change.doc.id;
        //             const { email, firstName, lastName, message, file, date } = change.doc.data();
        //             const newMessage = new Message(id, email, firstName, lastName, message, file, date);
        //             this.messages.push(newMessage);
        //         }
        //
        //         // Message modified
        //         if (change.type === 'modified') {
        //             const id = change.doc.id;
        //             const { email, firstName, lastName, message, file, date } = change.doc.data();
        //             const newMessage = new Message(id, email, firstName, lastName, message, file, date);
        //             const index = this.messages.findIndex((m) => m.id === id);
        //             this.messages[index] = newMessage;
        //         }
        //
        //         // Message deleted
        //         if (change.type === 'removed') {
        //             const id = change.doc.id;
        //             const index = this.messages.findIndex((m) => m.id === id);
        //             this.messages.splice(index, 1);
        //         }
        //     });
        // });

        // const docRef = doc(this.db, 'conversations', conversationId);
        //
        // onSnapshot(docRef, (doc) => {
        //
        //     console.log(doc.data());
        //     querySnapshot.forEach((doc) => {
        //         const id = doc.id;
        //         const email = doc.get('email');
        //         const firstName = doc.get('firstName');
        //         const lastName = doc.get('lastName');
        //         const message = doc.get('message');
        //         const file = doc.get('file');
        //         const date = doc.get('date');
        //
        //         const newMessage = new Message(
        //             id,
        //             email,
        //             firstName,
        //             lastName,
        //             message,
        //             file,
        //             date
        //         );
        //         this.messages.push(newMessage);
        //     });
        // });
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
                            id: this.user.id,
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

        // Remove messageId from this.messages
        const found = this.messages.find((m) => m.id === messageId);
        console.log(found);
        console.log(this.messages);

        // // Update firestore
        // const messageRef = doc(this.db, 'conversations', conversationId);
        // await updateDoc(messageRef, this.messages);
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
}
