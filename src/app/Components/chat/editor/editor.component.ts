import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../class/user';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { StorageService } from '../../../services/storage/storage.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnChanges {

    newMessage: string;
    @Input() conversationId: string;
    user: User;

    formNewMessage = new FormGroup({
        newMessage: new FormControl('', [Validators.required]),
    });

    constructor(
        private storage: StorageService,
        private firestore: FirestoreService,
        private auth: AuthenticationService
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.conversationId = changes.conversationId.currentValue;

        this.auth.getAuth().then((user: User) => {
            this.user = user;
        });
    }

    sendMessage() {
        const message = this.formNewMessage.value.newMessage;

        this.firestore.sendMessage(this.conversationId, message).then(() => {
            this.formNewMessage.reset();
        });
    }

    sendFile(file: Event) {
        this.storage.sendFile(this.conversationId, file);
    }

    uploadFile() {
        document.getElementById('file_upload')?.click();
    }
}
