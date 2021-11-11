import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from "firebase/app";
import { CookieService } from 'ngx-cookie-service';
import * as config from '../config';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

    constructor(
        private router: Router,
        private cookieService: CookieService,
        // private auth: AuthenticationService
    ) {

        // Initialize Firebase
        const app = initializeApp(config.firebaseConfig);
    }

    ngOnInit() {

        // // Get cookie
        // let email = this.cookieService.get('email');
        // let password = this.cookieService.get('password');

        // // Get route from user
        // let url = window.location.pathname;

        // // Check connection
        // if (email && password) {
        //     this.auth.signIn(email, password);
        // } else {
        //     if (url == '/sign-up') this.router.navigate(['/sign-up']);
        //     else this.router.navigate(['sign-in']);
        // }
    }
}
