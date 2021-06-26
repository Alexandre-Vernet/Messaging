import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import { FirestoreService } from 'src/app/Services/firestore/firestore.service';
import { StorageService } from 'src/app/Services/storage/storage.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    user: any = {};
    _messages: {
        email: String;
        firstName: String;
        lastName: String;
        message: String;
        date: Date;
        image: any;
    }[] = [];

    files: { path: String; date: any }[] = [];

    newMessage: any;

    form = new FormGroup({
        editedMessage: new FormControl('', [Validators.required]),
    });

    constructor(
        private auth: AuthenticationService,
        private firestore: FirestoreService,
        private storage: StorageService,
        private cdref: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.user = this.auth.user;
        this._messages = this.messages;
        this.files = this.storage.files;
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    setCursor = () => {
        document.getElementById('inputSendMessage')?.focus();
    };

    public get messages(): any {
        firebase
            .firestore()
            .collection('messages')
            .orderBy('date', 'asc')
            .limit(50)
            .onSnapshot((querySnapshot) => {
                this._messages = [];
                querySnapshot.forEach((doc) => {
                    this._messages.push({
                        email: doc.get('email'),
                        firstName: doc.get('firstName'),
                        lastName: doc.get('lastName'),
                        message: doc.get('message'),
                        image: doc.get('image'),
                        date: doc.get('date'),
                    });
                });
            });

        return this._messages;
    }

    sendMessage = () => {
        if (this.newMessage.length > 0) {
            this.firestore.sendMessage(this.newMessage);

            // Clear input
            this.newMessage = '';
        }
    };

    uploadFile = () => {
        document.getElementById('file_upload')?.click();
    };

    sendFile = (event: any) => {
        this.storage.sendFile(event);
    };

    /**
     * Edit message
     */
    editMessage = () => {
        let editedMessage = this.form.value['editedMessage'];
        console.log('editedMessage: ', editedMessage);

        firebase
            .firestore()
            .collection('messages')
            .doc('0FICKGZiB0YJhb3aOX9q')
            .update({
                message: this.form.value['editedMessage'],
            })
            .then(() => {
                console.log('Document successfully updated!');

                // Reset edited message
                editedMessage = '';
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error('Error updating document: ', error);
            });
    };

    deleteMessage = (date: Date) => {
        this.firestore.deleteMessage(date);
    };

    /**
     *  Format date to locale zone
     * @param date
     */
    formatDate = (date: any) => {
        return date.toDate().toLocaleTimeString('fr-FR');
    };
}
