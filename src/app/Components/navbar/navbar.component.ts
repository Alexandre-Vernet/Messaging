import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    user: User;

    constructor(private auth: AuthenticationService) {
    }

    async ngOnInit() {
        await this.auth.getAuth().then((user) => {
            this.user = user;
        });
    }

    signOut() {
        this.auth.signOut();
    }
}
