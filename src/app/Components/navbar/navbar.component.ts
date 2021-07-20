import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    user: any = {};
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
