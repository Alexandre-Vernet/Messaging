import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from '../Services/firebase/authentication/authentication.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    constructor(public auth: AuthenticationService) {}

    ngOnInit(): void {}
}
