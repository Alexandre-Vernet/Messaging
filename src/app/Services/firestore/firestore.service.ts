import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    constructor(private auth: AuthenticationService) {}

    /**
     * Send message
     * @param newMessage
     */
    sendMessage = (newMessage: String) => {
        // Store message
        firebase
            .firestore()
            .collection('messages')
            .add({
                email: this.auth.user.email,
                firstName: this.auth.user.firstName,
                lastName: this.auth.user.lastName,
                message: newMessage,
                date: new Date(),
            })
            .catch((error: String) => {
                console.log(error);
            });
    };

    /**
     * Delete message
     * @param date
     */
    deleteMessage = (date: Date) => {
        firebase
            .firestore()
            .collection('messages')
            .where('date', '==', date)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete();
                });
            });
    };
}
