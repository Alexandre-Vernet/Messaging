import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MessagesService } from './Services/messages/messages.service';
import firebase from 'firebase';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  message: String = '';
  messages: { user: String; message: String }[] = [];

  firestore: any;

  constructor() {
    // Firestore
    const firebaseConfig = {
      apiKey: 'AIzaSyAhod5EQ_wRW3eEz8Zsaw3Ya6WCQ9sldlg',
      authDomain: 'messaging-db163.firebaseapp.com',
      projectId: 'messaging-db163',
      storageBucket: 'messaging-db163.appspot.com',
      messagingSenderId: '901664692612',
      appId: '1:901664692612:web:d97bc043a1b2f99f5ee5d1',
      measurementId: 'G-LXVMRHP2J0',
    };

    firebase.initializeApp(firebaseConfig);
  }

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
          console.log('Message successfull posted with id' + docRef.id);
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
