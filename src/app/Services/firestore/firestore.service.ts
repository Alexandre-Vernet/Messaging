import { Injectable } from '@angular/core';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    limit, onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { Message } from 'src/app/class/message';
import { User } from 'src/app/class/user';
import { AuthenticationService } from '../authentication/authentication.service';
import { Toast } from '../../class/Toast';

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    user: User;
    db = getFirestore();
    messages: Message[] = [];

    constructor(private auth: AuthenticationService) {
        this.user = this.auth.user;
    }

    async getMessages(conversationId: string): Promise<Message[]> {
        const docRef = doc(this.db, 'conversations', conversationId);

        onSnapshot(docRef, (doc) => {

            console.log(doc.data());
            // querySnapshot.forEach((doc) => {
            //     const id = doc.id;
            //     const email = doc.get('email');
            //     const firstName = doc.get('firstName');
            //     const lastName = doc.get('lastName');
            //     const message = doc.get('message');
            //     const file = doc.get('file');
            //     const date = doc.get('date');
            //
            //     const newMessage = new Message(
            //         id,
            //         email,
            //         firstName,
            //         lastName,
            //         message,
            //         file,
            //         date
            //     );
            //     this.messages.push(newMessage);
            // });
        });

        return this.messages;
    }

    async sendMessage(conversationId: string, newMessage: string) {
        await addDoc(collection(this.db, 'conversations', conversationId), {
            email: this.auth.user.email,
            firstName: this.auth.user.firstName,
            lastName: this.auth.user.lastName,
            message: newMessage,
            date: new Date(),
        });
    };

    async getMessageId(date: Date) {
        const message = {};

        const q = query(
            collection(this.db, 'messages'),
            where('date', '==', date)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docRef) => {
            message['id'] = docRef.id;
            message['message'] = docRef.get('message');
        });

        return message;
    }

    // Get last message send by user
    async getLastMessage() {
        const messageRef = query(collection(this.db, 'messages'));

        const q = query(
            messageRef,
            where('email', '==', 'alexandre.vernet@g-mail.fr'),
            orderBy('date', 'desc'),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        let a = {};
        querySnapshot.forEach((docRef) => {
            a['message'] = docRef.get('message');
            a['id'] = docRef.id;
            return a;
        });

        return a;
    }

    // Edit message
    async editMessage(newMessage: string, date: Date, messageId: string) {
        const messageRef = doc(this.db, 'messages', messageId);

        await updateDoc(messageRef, {
            message: newMessage,
            date: date,
        })
            .catch((error) => {
                console.error(error);
                Toast.error('Error updating message', error.message);
            });
    };

    async deleteMessage(date: Date) {
        const q = query(
            collection(this.db, 'messages'),
            where('date', '==', date)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docRef) => {
            // doc.data() is never undefined for query doc snapshots
            await deleteDoc(doc(this.db, 'messages', docRef.id));
        });
    };

    async getUsers() {
        const q = query(collection(this.db, 'users'));
        const users: User[] = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docRef) => {
            const id = docRef.id;
            const email = docRef.get('email');
            const firstName = docRef.get('firstName');
            const lastName = docRef.get('lastName');
            const profilePicture = docRef.get('profilePicture');
            const dateCreation = docRef.get('dateCreation');

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
