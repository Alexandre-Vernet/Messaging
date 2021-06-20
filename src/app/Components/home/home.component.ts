import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import { Timestamp } from 'rxjs';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    newMessage: any;
    messages: { user: String; message: String; date: Date }[] = [];

    firestore: any;

    constructor(public auth: AuthenticationService) {}

    ngOnInit() {
        this.firestore = firebase.firestore();

        this.getMessages();
    }

    getMessages = () => {
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

                    this.messages = [];

                    this.getMessages();
                })
                .catch((err: any) => {
                    console.log(err);
                });

            // Clear input
            this.newMessage = '';
        }
    };

    formatDate = (date: any) => {
        return date.toDate().toLocaleTimeString('fr-FR');

        // let day = message.getDate();
        // let month = message.getMonth();
        // let hours = message.getHours();
        // let minutes = message.getMinutes();

        // return day + ' / ' + month + ' at ' + hours + ' : ' + minutes;
    };
}
