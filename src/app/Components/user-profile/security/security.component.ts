import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../class/user';
import { AuthenticationService } from '../../../services/authentication/authentication.service';

@Component({
    selector: 'app-security',
    templateUrl: './security.component.html',
    styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {

    user: User;
    formUpdateEmail: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });

    formUpdatePassword: FormGroup = new FormGroup({
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),

        confirmPassword: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
        ]),
    });

    @ViewChild('modalUpdateEmail') modalUpdateEmail;
    @ViewChild('modalUpdatePassword') modalUpdatePassword;


    constructor(
        private auth: AuthenticationService,
    ) {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.user = this.auth.user;

            // Set default value to formUpdateEmail
            this.formUpdateEmail.controls.email.setValue(this.user.email);
        }, 1500);
    }

    updateEmail() {
        // Hide modal
        this.modalUpdateEmail.nativeElement.click();

        const email = this.formUpdateEmail.value.email;
        this.auth.updateEmail(email);
    };

    updatePassword() {
        // Hide modal
        this.modalUpdatePassword.nativeElement.click();

        const password = this.formUpdatePassword.value.password;
        this.auth.updatePassword(password);
    }

    async deleteAccount() {
        await this.auth.deleteAccount();
    }
}
