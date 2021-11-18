import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from "firebase/app";
import { CookieService } from 'ngx-cookie-service';
import { firebaseConfig } from '../config';
import { AuthenticationService } from './Services/authentication/authentication.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    constructor(
        private auth: AuthenticationService,
        private router: Router,
        private cookieService: CookieService,
    ) {

        // Initialize Firebase
        initializeApp(firebaseConfig);
    }

    ngOnInit() {

        // Get cookie
        const email = this.cookieService.get('email');
        const password = this.cookieService.get('password');

        // Get route from user
        const url = window.location.pathname;

        // Check connection
        if (email && password) {
            this.auth.signIn(email, password);
        } else {
            if (url == '/sign-up') this.router.navigate(['/sign-up']);
            else this.router.navigate(['sign-in']);
        }
    }
}
