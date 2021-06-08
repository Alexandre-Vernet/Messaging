import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    firebase: any;

    constructor(private router: Router, private cookieService: CookieService) {
        // Firebase
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
        this.firebase = firebase.firestore();

        // Get cookie
        let email = this.cookieService.get('email');
        let password = this.cookieService.get('password');

        if (email && password) {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    // Set cookie
                    this.cookieService.set('email', email, 365);
                    this.cookieService.set('password', password, 365);

                    // Redirect to home
                    this.router.navigate(['/home']);
                });
        } else this.router.navigate(['sign-in']);
    }
}
