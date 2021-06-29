import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
    user: any = {};
    formUpdateProfile: FormGroup = new FormGroup({
        firstName: new FormControl(this.user.firstName, [Validators.required]),
        lastName: new FormControl(this.user.lastName, [Validators.required]),
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
    constructor(private auth: AuthenticationService) {}

    ngOnInit(): void {
        this.user = this.auth.user;
    }

    updateProfile = () => {
        const firstName = this.formUpdateProfile.value['firstName'];
        const lastName = this.formUpdateProfile.value['lastName'];
        this.auth.updateProfile(firstName, lastName);
    };

    updatePassword = () => {
        const password = this.formUpdatePassword.value['password'];
        this.auth.updatePassword(password);
    };
    deleteAccount = () => {
        this.auth.deleteAccount();
    };
}
