import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StorageService } from '../../../Services/storage/storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../Services/firestore/firestore.service';
import { User } from '../../../class/user';
import { AuthenticationService } from '../../../Services/authentication/authentication.service';

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

        setTimeout(() => {
            this.auth.getAuth().then((user: User) => {
                this.user = user;
            });
        }, 2000);
    }

    sendMessage() {
        const newMessage = this.formNewMessage.value.newMessage;
        const messageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const message = {
            [this.user.email]:
                {
                    userInfo: {
                        id: this.user.id,
                        firstName: this.user.firstName,
                        lastName: this.user.lastName,
                        profilePicture: this.user.profilePicture ? this.user.profilePicture : 'photo',
                        dateCreation: this.user.dateCreation
                    },
                    messages: {
                        [messageId]: {
                            message: newMessage,
                            date: new Date(),
                        }
                    }
                }
        };

        this.firestore.sendMessage(this.conversationId, message).then(() => {
            this.formNewMessage.reset();
        });
    }

    uploadFile() {
        document.getElementById('file_upload')?.click();
    }

    sendFile(file: Event) {
        this.storage.sendFile(this.conversationId, file);
    }
}
