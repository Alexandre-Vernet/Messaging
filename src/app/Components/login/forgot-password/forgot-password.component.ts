import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../Services/authentication/authentication.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

    formReset = new FormGroup({
        emailReset: new FormControl('', [
            Validators.required,
            Validators.email,
        ]),
    });

    firebaseError: string = '';

    constructor(
        private auth: AuthenticationService
    ) {
    }

    resetPassword() {
        // Get email
        const emailAddress = this.formReset.value.emailReset;

        // Send email reset password
        this.auth.resetPassword(emailAddress);
    }
}
