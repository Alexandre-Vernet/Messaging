import { Injectable } from '@angular/core';
import {
    addDoc,
    collection,
    deleteDoc,
    doc, getDoc,
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
        setTimeout(() => {
            this.auth.getAuth().then((user) => {
                this.user = user;
            });
        }, 2000);
    }

    async getMessages(): Promise<Message[]> {
        const q = query(collection(this.db, 'messages'), orderBy('date', 'asc'));
        onSnapshot(q, (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {

                // Message added
                if (change.type === 'added') {
                    const id = change.doc.id;
                    const { email, firstName, lastName, message, file, date } = change.doc.data();
                    const newMessage = new Message(id, email, firstName, lastName, message, file, date);
                    this.messages.push(newMessage);
                }

                // Message modified
                if (change.type === 'modified') {
                    const id = change.doc.id;
                    const { email, firstName, lastName, message, file, date } = change.doc.data();
                    const newMessage = new Message(id, email, firstName, lastName, message, file, date);
                    const index = this.messages.findIndex((m) => m.id === id);
                    this.messages[index] = newMessage;
                }

                // Message deleted
                if (change.type === 'removed') {
                    const id = change.doc.id;
                    const index = this.messages.findIndex((m) => m.id === id);
                    this.messages.splice(index, 1);
                }
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
    }
}
