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
    newMessage: any;

    form = new FormGroup({
        editedMessage: new FormControl('', [Validators.required]),
    });

    messages: { user: String; message: String; date: Date }[] = [];

    firestore: any;

    constructor(public auth: AuthenticationService) {}

    ngOnInit() {
        this.firestore = firebase.firestore();

        this.getMessages();
    }

    getMessages = () => {
        // Clear messages
        this.messages = [];

        // Get messages from firestore
        this.firestore
            .collection('messages')
            .orderBy('date', 'asc')
            .get()
            .then((querySnapshot: any) => {
                querySnapshot.forEach((doc: any) => {
                    this.messages.push({
                        user: doc.get('user'),
                        message: doc.get('message'),
                        date: doc.get('date'),
                    });
                });
            });
    };

    // Send message to firestore
    sendMessage = () => {
        if (this.newMessage.length > 0) {
            // Store message
            this.firestore
                .collection('messages')
                .add({
                    user: this.auth.user['firstName'],
                    message: this.newMessage,
                    date: new Date(),
                })
                .then((docRef: { id: string }) => {
                    console.log(
                        'Message successfull posted with id' + docRef.id
                    );

                    this.getMessages();
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
        console.log('editedMessage: ', this.form.value['editedMessage']);
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
                this.form.value['editedMessage'] = '';

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
        firebase
            .firestore()
            .collection('messages')
            .where('date', '==', date)
            .get()
            .then((querySnapshot: any) => {
                querySnapshot.forEach((doc: any) => {
                    doc.ref.delete();
                    this.getMessages();
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
