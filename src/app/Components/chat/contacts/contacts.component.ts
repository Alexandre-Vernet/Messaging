import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../class/user';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { Toast } from '../../../class/toast';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

    users: User[] = [];

    constructor(
        private firestore: FirestoreService,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.firestore.getUsers().then((users) => {
            this.users = users;
        });
    }

    createConversation(userId: string): void {
        this.firestore.createConversation(userId).then(async (conversationId) => {
            await this.router.navigate(['/conversation/' + conversationId]);
        }).catch((error) => {
            console.error(error);
            Toast.error('Error creating conversation', error.message);
        });
    }
}
