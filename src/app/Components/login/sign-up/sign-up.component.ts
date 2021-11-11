import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
    firebaseError: string = '';
    _viewPassword: boolean = false;

    form = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('alexandre.vernet@g-mail.fr', [Validators.required, Validators.email]),
        password: new FormControl('alexandre', [
            Validators.required,
            Validators.minLength(6),
        ]),
        confirmPassword: new FormControl('alexandre', [
            Validators.required,
            Validators.minLength(6),
        ]),
    });

    constructor(private auth: AuthenticationService) { }

    ngOnInit() {
        this.firebaseError = this.auth.firebaseError;
    }

    signUp = () => {
        // Get informations
        const firstName = this.form.value.firstName;
        const lastName = this.form.value.lastName;
        const email = this.form.value.email;
        const password = this.form.value.password;

        // Sign-up
        this.auth.signUp(firstName, lastName, email, password);

        setTimeout(() => {
            this.ngOnInit();
        }, 300);
    };

    googleSignUp = () => {
        this.auth.googleSignUp();
    };

    viewPassword = () => {
        this._viewPassword = !this._viewPassword;
    };
}
