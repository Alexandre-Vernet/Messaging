import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    newMessage: any;
    messages: {
        email: String;
        firstName: String;
        lastName: String;
        message: String;
        date: Date;
    }[] = [];

    firestore: any;

    constructor(public auth: AuthenticationService) {}

    ngOnInit() {
        this.firestore = firebase.firestore();

        this.getMessages();
    }

    /**
     * Get message from firestore
     */
    getMessages = () => {
        firebase
            .firestore()
            .collection('messages')
            .orderBy('date', 'asc')
            .onSnapshot((querySnapshot) => {
                this.messages = [];
                querySnapshot.forEach((doc) => {
                    this.messages.push({
                        email: doc.get('email'),
                        firstName: doc.get('firstName'),
                        lastName: doc.get('lastName'),
                        message: doc.get('message'),
                        date: doc.get('date'),
                    });
                });
            });
    };

    /**
     * Send message to firestore
     */
    sendMessage = () => {
        if (this.newMessage.length > 0) {
            // Store message
            this.firestore
                .collection('messages')
                .add({
                    email: this.auth.user['email'],
                    firstName: this.auth.user['firstName'],
                    lastName: this.auth.user['lastName'],
                    message: this.newMessage,
                    date: new Date(),
                })
                .catch((err: any) => {
                    console.log(err);
                });

            // Clear input
            this.newMessage = '';
        }
    };

    /**
     * Edit message
     * @returns
     */
    editMessage = () => {
        let message = firebase.firestore().collection('messages').doc('DC');

        // Set the "capital" field of the city 'DC'
        return message
            .update({
                message: 'this is a edited message',
            })
            .then(() => {
                console.log('Document successfully updated!');
                this.getMessages();
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error('Error updating document: ', error);
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

    /**
     *  Format date to locale zone
     * @param date
     * @returns
     */
    formatDate = (date: any) => {
        return date.toDate().toLocaleTimeString('fr-FR');
    };
}
