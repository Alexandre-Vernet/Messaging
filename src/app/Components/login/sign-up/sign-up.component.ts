import { Component, OnInit } from '@angular/core';
import {
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import firebase from 'firebase';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  signUp() {
    /**
     * The email address is already in use by another account.
     * Password should be at least 6 characters
     * The email address is badly formatted.
     */

    console.log(this.form.value);

    const email = this.form.value['email'];
    const password = this.form.value['password'];
    const confirmPassword = this.form.value['confirmPassword'];
    if (password !== confirmPassword) {
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // ...
      })
      .catch((error) => {
        alert(error.message);
      });
  }
}
