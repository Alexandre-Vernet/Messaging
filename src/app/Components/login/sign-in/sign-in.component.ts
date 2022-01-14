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

    email!: string;
    form = new FormGroup({
        email: new FormControl('alexandre.vernet@g-mail.fr', [Validators.required, Validators.email]),
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
                this.router.navigate(['/']);
            }
        }).catch((error) => {
            this.firebaseError = error.message;
        });

        // switch (error) {
        //     case 'Firebase: Error (auth/user-not-found).':
        //         this.firebaseError = 'Email or password is incorrect.';
        //         break;
        //     case 'FirebaseError: Firebase: Error (auth/user-disabled).':
        //         this.firebaseError = 'Your account has been disabled.';
        //         break;
        // }
    };

    googleSignUp() {
        this.auth.signInWithPopup('google');
    }

    facebookSignUp() {
        this.auth.signInWithPopup('facebook');
    }

    githubSignUp() {
        this.auth.signInWithPopup('github');
    }

    viewPassword() {
        this._viewPassword = !this._viewPassword;
    }
}
