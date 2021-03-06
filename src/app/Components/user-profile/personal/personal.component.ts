import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../class/user';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../services/storage/storage.service';

@Component({
    selector: 'app-personal',
    templateUrl: './personal.component.html',
    styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
    user: User;
    formUpdateProfile: FormGroup = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
    });

    @ViewChild('modalUpdateProfile') modalUpdateProfile;

    constructor(
        private storage: StorageService,
        private auth: AuthenticationService,
    ) {
    }

    ngOnInit(): void {
        this.auth.getAuth().then((user) => {
            this.user = user;

            // Set default value to formUpdateProfile
            this.formUpdateProfile.controls.firstName.setValue(
                this.user.firstName
            );
            this.formUpdateProfile.controls.lastName.setValue(
                this.user.lastName
            );
        });
    }

    async updateProfile() {
        // Hide modal
        this.modalUpdateProfile.nativeElement.click();

        const firstName = this.formUpdateProfile.value.firstName;
        const lastName = this.formUpdateProfile.value.lastName;
        await this.auth.updateProfile(firstName, lastName);
    };

    uploadProfilePicture() {
        document.getElementById('file_upload')?.click();
    }

    updateProfilePicture(event) {
        this.storage.updateProfilePicture(event);
    }
}
