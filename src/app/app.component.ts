import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from './Services/authentication/authentication.service';
import { CryptoService } from './Services/crypto/crypto.service';

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
        private cryptoService: CryptoService
    ) {
    }

    async ngOnInit() {
        // Get local storage
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');

        // Get route from user
        const url = window.location.pathname;

        // Check connection
        if (email && password) {
            const hashPassword = this.cryptoService.decrypt(password);
            this.auth.signIn(email, hashPassword);
        } else {
            if (url == '/sign-up') {
                await this.router.navigate(['/sign-up']);
            } else {
                await this.router.navigate(['sign-in']);
            }
        }
    }
}
