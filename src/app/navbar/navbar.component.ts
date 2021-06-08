import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    user: any = {};

    constructor(private cookieService: CookieService) {}

    ngOnInit(): void {
        // Get cookie
        let email = this.cookieService.get('email');
        let password = this.cookieService.get('password');

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Set cookie
                this.cookieService.set('email', email, 365);
                this.cookieService.set('password', password, 365);

                this.user['email'] = userCredential.user?.email;
            });

        var user = firebase.auth().currentUser?.email;
        console.log(user);
    }
}
