import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, limit, orderBy, query, where } from 'firebase/firestore';
import { Message } from 'src/app/class/message';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {

    db = getFirestore();
    messages: Message[] = [];


    constructor(private auth: AuthenticationService) { }

    async getMessages(): Promise<Message[]> {
        // firebase
        //     .firestore()
        //     .collection('messages')
        //     .orderBy('date', 'asc')
        //     .limit(50)
        //     .onSnapshot((querySnapshot) => {
        //         this._messages = [];
        //         querySnapshot.forEach((doc) => {
        //             this._messages.push({
        //                 email: doc.get('email'),
        //                 firstName: doc.get('firstName'),
        //                 lastName: doc.get('lastName'),
        //                 message: doc.get('message'),
        //                 image: doc.get('image'),
        //                 date: doc.get('date'),
        //             });
        //         });
        //     });


        const q = query(collection(this.db, "messages"), orderBy('date', 'asc'), limit(50));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots

            const email = doc.get('email');
            const firstName = doc.get('firstName');
            const lastName = doc.get('lastName');
            const message = doc.get('message');
            const image = doc.get('image');
            const date = doc.get('date');

            const newMessage = new Message(email, firstName, lastName, message, image, date);
            this.messages.push(newMessage);
        });

        return this.messages;
    }

    /**
     * Send message
     * @param newMessage
     */
    sendMessage = async (newMessage: String) => {
        // // Store message
        // firebase
        //     .firestore()
        //     .collection('messages')
        //     .add({
        //         email: this.auth.user.email,
        //         firstName: this.auth.user.firstName,
        //         lastName: this.auth.user.lastName,
        //         message: newMessage,
        //         date: new Date(),
        //     })
        //     .catch((error: String) => {
        //         console.log(error);
        //     });

        const docRef = await addDoc(collection(this.db, "messages"), {
            email: this.auth.user.email,
            firstName: this.auth.user.firstName,
            lastName: this.auth.user.lastName,
            message: newMessage,
            date: new Date(),
        });

        console.log(docRef);
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



        const q = query(collection(this.db, "messages"), where('date', '==', date));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docRef) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(docRef.id, " => ", docRef.data());
            await deleteDoc(doc(this.db, "messages", docRef.id))
        });
    };
}
