import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../../../class/user';
import { StorageService } from '../../../Services/storage/storage.service';
import { FirestoreService } from '../../../Services/firestore/firestore.service';
import { AuthenticationService } from '../../../Services/authentication/authentication.service';

@Component({
    selector: 'app-head',
    templateUrl: './head.component.html',
    styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnChanges {
    @Input() conversationId;
    user: User;
    _rightPanel: boolean = false;
    contactName: string;

    constructor(
        private storage: StorageService,
        private firestore: FirestoreService,
        private auth: AuthenticationService
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.conversationId = changes.conversationId.currentValue;

        setTimeout(() => {
            this.auth.getAuth().then((user: User) => {
                this.user = user;
                this.getContactName();
            });
        }, 2000);
    }

    getContactName() {
        this.firestore.getContactName(this.conversationId).then((contactName) => {
            this.contactName = contactName;
        });
    }

    rightPanel() {
        this._rightPanel = !this._rightPanel;
    }
}
