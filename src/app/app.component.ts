import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
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
  }
}
