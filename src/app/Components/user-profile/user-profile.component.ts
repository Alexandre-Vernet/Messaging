import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
    user: any = {};
    form: FormGroup = new FormGroup({
        firstName: new FormControl(this.user.firstName, [Validators.required]),
        lastName: new FormControl(this.user.lastName, [Validators.required]),
    });

    formUpdatePassword: FormGroup = new FormGroup({
        password: new FormControl('', [Validators.required]),
        // confirmPassword: new FormControl('', [Validators.required]),
    });
    constructor(private auth: AuthenticationService) {}

    ngOnInit(): void {
        this.user = this.auth.user;
    }

    updateProfile = () => {
        const firstName = this.form.value['firstName'];
        const lastName = this.form.value['lastName'];
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
