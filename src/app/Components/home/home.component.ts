import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    user: any = {};
    newMessage: any;
    messages: {
        email: String;
        firstName: String;
        lastName: String;
        message: String;
        date: Date;
    }[] = [];

    form = new FormGroup({
        editedMessage: new FormControl('', [Validators.required]),
    });

    firestore: any;

    constructor(private auth: AuthenticationService) {}

    ngOnInit() {
        this.firestore = firebase.firestore();
        this.user = this.auth.user;

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
     */
    editMessage = () => {
        let editedMessage = this.form.value['editedMessage'];
        console.log('editedMessage: ', editedMessage);

        firebase
            .firestore()
            .collection('messages')
            .doc('0FICKGZiB0YJhb3aOX9q')
            .update({
                message: this.form.value['editedMessage'],
            })
            .then(() => {
                console.log('Document successfully updated!');

                // Reset edited message
                editedMessage = '';

                // Reload message
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
        this.firestore
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
