import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
    firebaseError: string = '';
    _viewPassword: boolean = false;

    email!: string;
    form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    });

    formReset = new FormGroup({
        emailReset: new FormControl('', [
            Validators.required,
            Validators.email,
        ]),
    });

    constructor(
        private auth: AuthenticationService,
        private cookieService: CookieService
    ) {}

    ngOnInit() {
        this.email = this.cookieService.get('email');
        this.firebaseError = this.auth.firebaseError;
    }

    signIn = () => {
        // Get email & pswd
        const email = this.form.value['email'];
        const password = this.form.value['password'];

        // Sign-in
        this.auth.signIn(email, password);

        setTimeout(() => {
            this.ngOnInit();
        }, 300);
    };

    googleSignUp = () => {
        this.auth.googleSignUp();
    };

    resetPassword = () => {
        const emailAddress = this.formReset.value['emailReset'];

        // Send email reset password
        this.auth.resetPassword(emailAddress);
    };

    viewPassword = () => {
        this._viewPassword = !this._viewPassword;
    };
}
