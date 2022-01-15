import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
    firebaseError: string = '';
    _viewPassword: boolean = false;

    form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    });

    constructor(
        private auth: AuthenticationService,
        private router: Router
    ) {
    }

    async signIn() {
        // Get email & psd
        const email = this.form.value.email;
        const password = this.form.value.password;

        // Sign-in
        this.auth.signIn(email, password).then((user) => {
            if (user) {
                this.router.navigate(['/conversation/ZsPWwcDMASeNVjYMk4kc']);
            }
        }).catch((error) => {
            this.firebaseError = error.message;
        });
    }

    async googleSignUp() {
        this.auth.signInWithPopup('google').then((user) => {
            if (user) {

                this.router.navigate(['home']);
            }
        }).catch((error) => {
            this.firebaseError = error.message;
        });
    }

    async facebookSignUp() {
        this.auth.signInWithPopup('facebook').then((user) => {
            if (user) {

                this.router.navigate(['home']);
            }
        }).catch((error) => {
            this.firebaseError = error.message;
        });
    }

    async githubSignUp() {
        this.auth.signInWithPopup('github').then((user) => {
            if (user) {

                this.router.navigate(['home']);
            }
        }).catch((error) => {
            this.firebaseError = error.message;
        });
    }

    viewPassword() {
        this._viewPassword = !this._viewPassword;
    }
}
