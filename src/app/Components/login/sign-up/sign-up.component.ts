import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import firebase from 'firebase';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  signUp(form: NgForm) {
    const email = form.value['email'];
    const password = form.value['password'];

    console.log(email, password);

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
