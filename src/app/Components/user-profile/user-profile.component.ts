import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/Services/firebase/authentication/authentication.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
    user: any = {};
    constructor(private auth: AuthenticationService) {}

    ngOnInit(): void {
        this.user = this.auth.user;
    }
}
