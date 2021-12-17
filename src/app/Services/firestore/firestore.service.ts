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

    /**
     * Send message
     * @param newMessage
     */
    sendMessage = async (newMessage: String) => {
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
    editMessage = async (newMessage: string, date: Date, messageId: string) => {
        console.log('messageId: ', messageId);

        const messageRef = doc(this.db, 'messages', messageId);

        await updateDoc(messageRef, {
            message: newMessage,
            date: date,
        })
            .then(() => {
                Toast.success('Message successfully updated');
            })
            .catch((error) => {
                console.error(error);
                Toast.error('Error updating message', error.message);
            });
    };

    /**
     * Delete message
     * @param date
     */
    deleteMessage = async (date: Date) => {
        // firebase
        //     .firestore()
        //     .collection('messages')
        //     .where('date', '==', date)
        //     .get()
        //     .then((querySnapshot) => {
        //         querySnapshot.forEach((doc) => {
        //             doc.ref.delete();
        //         });
        //     });

        const q = query(
            collection(this.db, 'messages'),
            where('date', '==', date)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docRef) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(docRef.id, ' => ', docRef.data());
            await deleteDoc(doc(this.db, 'messages', docRef.id));
        });
    };
}
