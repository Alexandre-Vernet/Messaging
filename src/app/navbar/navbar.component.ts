import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    user: any;

    constructor(private cookieService: CookieService) {}

    ngOnInit(): void {
        // Get cookie
        let email = this.cookieService.get('email');
        let password = this.cookieService.get('password');

        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log(userCredential.user?.displayName);

                let user = firebase.auth().currentUser;
                if (user != null) console.log(user.displayName);

                // if (user != null) this.user['displayName'] = user.displayName;
            });
    }
}
