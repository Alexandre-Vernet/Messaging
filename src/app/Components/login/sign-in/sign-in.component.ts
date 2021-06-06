import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase';

declare var $: any;

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  firebaseError: string = '';

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  formReset = new FormGroup({
    emailReset: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private router: Router) {}

  ngOnInit() {}

  signIn = () => {
    console.log(this.form.value);

    // Get email & pswd
    const email = this.form.value['email'];
    const password = this.form.value['password'];

    // Sign-in
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;

        // Redirect to home
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log(error.message);

        this.firebaseError = error.message;
      });
  };

  resetPassword = () => {
    const emailAddress = this.formReset.value['emailReset'];

    // Send email reset password
    firebase
      .auth()
      .sendPasswordResetEmail(emailAddress)
      .then(() => {
        // Email sent
        $('#modalSuccessResetPassword').modal('show');

        $('#modalResetPassword').modal('hide');
      })
      .catch((error) => {
        this.firebaseError = error;

        $('#modalFailResetPassword').modal('show');
      });
  };
}
