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

    formChangePassword: FormGroup = new FormGroup({
        olderPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required]),
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

    changePassword = () => {};
    deleteAccount = () => {
        this.auth.deleteAccount();
    };
}
