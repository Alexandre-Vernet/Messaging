import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../Services/firestore/firestore.service';
import { User } from '../../../class/user';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

    users: User[] = [];

    constructor(private firestore: FirestoreService) {
    }

    ngOnInit(): void {
        this.firestore.getUsers().then((users) => {
            this.users = users;
        });
    }
}
