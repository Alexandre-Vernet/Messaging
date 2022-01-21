import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication/authentication.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnChanges {

    @Input() emailAddress;

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

    ngOnChanges(changes: SimpleChanges) {
        // Fill the form with the email address
        if (changes.emailAddress) {
            this.formReset.controls['emailReset'].setValue(changes.emailAddress.currentValue);
        }
    }

    resetPassword() {
        // Get email
        const emailAddress = this.formReset.value.emailReset;

        // Send email reset password
        this.auth.resetPassword(emailAddress);
    }
}
