import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
    user: User;

    constructor(
        private auth: AuthenticationService,
    ) {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.user = this.auth.user;
        }, 1500);
    }
}
