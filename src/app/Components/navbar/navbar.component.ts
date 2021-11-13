import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/class/user';
import { AuthenticationService } from '../../Services/authentication/authentication.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    user: User | null;
    constructor(private auth: AuthenticationService) { }

    ngOnInit(): void {
        this.user = this.auth.user;
    }

    signOut = () => {
        this.auth.signOut();
    };
}
