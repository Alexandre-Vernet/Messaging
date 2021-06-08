import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
    firebaseError: string = '';

    form = new FormGroup({
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

    constructor(private cookieService: CookieService) {}

    ngOnInit() {}

    signUp = () => {
        console.log(this.form.value);

        // Get email & pswd
        const email = this.form.value['email'];
        const password = this.form.value['password'];

        // Sign-up
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Set cookie
                this.cookieService.set('email', email, 365);
            })
            .catch((error) => {
                console.log(error.message);

                this.firebaseError = error.message;
            });
    };
}
