import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    message: any;
    messages: { user: String; message: String }[] = [];

    firestore: any;

    constructor() {}

    ngOnInit() {
        this.firestore = firebase.firestore();

        this.getMessages();
    }

    getMessages = () => {
        this.firestore
            .collection('messages')
            .get()
            .then((querySnapshot: any) => {
                querySnapshot.forEach((doc: any) => {
                    let message: String = doc.data();

                    this.messages.push({
                        user: doc.get('user'),
                        message: doc.get('message'),
                        // date: doc.get('date'),
                    });
                });
            });
    };

    sendMessage = () => {
        if (this.message.length > 0) {
            // Store message
            this.firestore
                .collection('messages')
                .add({
                    user: 'Toto',
                    message: this.message,
                    date: new Date(),
                })
                .then((docRef: { id: string }) => {
                    console.log(
                        'Message successfull posted with id' + docRef.id
                    );
                })
                .catch((err: any) => {
                    console.log(err);
                });

            // Clear input
            this.message = '';
        }
    };

    formatDate = (message: Date): string => {
        let day = message.getDate();
        let month = message.getMonth();
        let hours = message.getHours();
        let minutes = message.getMinutes();

        return day + ' / ' + month + ' at ' + hours + ' : ' + minutes;
    };
}
