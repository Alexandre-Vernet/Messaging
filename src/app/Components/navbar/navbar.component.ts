import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../Services/authentication/authentication.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    user: any = {};
    constructor(private auth: AuthenticationService) {}

    ngOnInit(): void {
        this.user = this.auth.user;
    }

    signOut = () => {
        this.auth.signOut();
    };
}
