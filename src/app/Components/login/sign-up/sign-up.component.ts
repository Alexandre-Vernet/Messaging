import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
    firebaseError: string = '';
    _viewPassword: boolean = false;

    form = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
        confirmPassword: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    });

    constructor(
        private auth: AuthenticationService,
        private router: Router
    ) {
    }

    async signUp() {
        // Get value from form
        const firstName = this.form.value.firstName;
        const lastName = this.form.value.lastName;
        const email = this.form.value.email;
        const password = this.form.value.password;

        // Sign-up
        this.auth.signUp(firstName, lastName, email, password).then((user) => {
            if (user) {
                // Sign in
                this.auth.signIn(email, password).then((user) => {
                    if (user) {
                        // Redirect to home
                        this.router.navigate(['/']);
                    }
                });
            }
        }).catch((error) => {
            this.firebaseError = error.message;
        });
    }

    async signInWithPopup(type: string) {
        this.auth.signInWithPopup(type).then((user) => {
            if (user) {
                this.router.navigate(['conversation/ZsPWwcDMASeNVjYMk4kc']);
            }
        }).catch((error) => {
            this.firebaseError = error.message;
        });
    }

    viewPassword() {
        this._viewPassword = !this._viewPassword;
    }
}
