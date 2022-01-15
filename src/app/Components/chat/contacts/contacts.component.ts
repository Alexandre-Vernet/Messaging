import { Component, OnInit } from '@angular/core';
import { User } from '../../../class/user';
import { FirestoreService } from '../../../services/firestore/firestore.service';

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
