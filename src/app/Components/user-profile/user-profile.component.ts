import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import { StorageService } from 'src/app/Services/storage/storage.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
    user: User;
    formUpdateProfile: FormGroup = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
    });

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

    @ViewChild('modalUpdateProfile') modalUpdateProfile;
    @ViewChild('modalUpdateEmail') modalUpdateEmail;
    @ViewChild('modalUpdatePassword') modalUpdatePassword;

    constructor(
        private auth: AuthenticationService,
        private storage: StorageService
    ) { }

    ngOnInit(): void {
        this.user = this.auth.user;

        // Set default value to formUpdateProfile
        this.formUpdateProfile.controls.firstName.setValue(
            this.user.firstName
        );
        this.formUpdateProfile.controls.lastName.setValue(
            this.user.lastName
        );

        // Set default value to formUpdateEmail
        this.formUpdateEmail.controls.email.setValue(this.user.email);
    }

    uploadProfilePicture = () => {
        document.getElementById('file_upload')?.click();
    };

    sendProfilePicture = (event) => {
        this.storage.sendProfilePicture(event);
    };

    updateProfile = () => {
        // Hide modal
        this.modalUpdateProfile.nativeElement.click();

        const firstName = this.formUpdateProfile.value.firstName;
        const lastName = this.formUpdateProfile.value.lastName;
        this.auth.updateProfile(firstName, lastName);
    };

    updateEmail = () => {
        // Hide modal
        this.modalUpdateEmail.nativeElement.click();

        const email = this.formUpdateEmail.value.email;
        this.auth.updateEmail(email);
    };

    updatePassword = () => {
        // Hide modal
        this.modalUpdatePassword.nativeElement.click();

        const password = this.formUpdatePassword.value.password;
        this.auth.updatePassword(password);
    };
    deleteAccount = () => {
        this.auth.deleteAccount();
    };
}
