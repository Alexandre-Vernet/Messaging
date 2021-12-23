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
import { Toast } from '../../class/toast';

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

    async getMessages(): Promise<Message[]> {
        const q = query(collection(this.db, 'messages'), orderBy('date', 'asc'));
        onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const id = doc.id;
                const email = doc.get('email');
                const firstName = doc.get('firstName');
                const lastName = doc.get('lastName');
                const message = doc.get('message');
                const file = doc.get('file');
                const date = doc.get('date');

                const newMessage = new Message(
                    id,
                    email,
                    firstName,
                    lastName,
                    message,
                    file,
                    date
                );
                this.messages.push(newMessage);
            });
        });

        return this.messages;
    }

    async sendMessage(newMessage: string) {
        await addDoc(collection(this.db, 'messages'), {
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
}
