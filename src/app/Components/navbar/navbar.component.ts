import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/class/user';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    user: User;
    constructor(private auth: AuthenticationService) {}

    ngOnInit(): void {
        setTimeout(() => {
            this.user = this.auth.user;
        }, 2000);
    }

    signOut = () => {
        this.auth.signOut();
    };
}
