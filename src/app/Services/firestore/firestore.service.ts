import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    _messages: {
        email: String;
        firstName: String;
        lastName: String;
        message: String;
        date: Date;
    }[] = [];

    constructor(private auth: AuthenticationService) {}

    /**
     * Get messages from database
     */

    public set messages(value: any) {
        this._messages = value;
    }

    /**
     * Send message to firestore
     */
    sendMessage = (newMessage: String) => {
        // Store message
        firebase
            .firestore()
            .collection('messages')
            .add({
                email: this.auth.user['email'],
                firstName: this.auth.user['firstName'],
                lastName: this.auth.user['lastName'],
                message: newMessage,
                date: new Date(),
            })
            .catch((err: any) => {
                console.log(err);
            });
    };

    /**
     * Delete message
     */
    deleteMessage = (date: Date) => {
        firebase
            .firestore()
            .collection('messages')
            .where('date', '==', date)
            .get()
            .then((querySnapshot: any) => {
                querySnapshot.forEach((doc: any) => {
                    doc.ref.delete();
                });
            });
    };
}
