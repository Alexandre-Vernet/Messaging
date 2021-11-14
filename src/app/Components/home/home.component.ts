import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, where } from 'firebase/firestore';
import { File } from 'src/app/class/file';
import { Message } from 'src/app/class/message';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import { FirestoreService } from 'src/app/Services/firestore/firestore.service';
import { StorageService } from 'src/app/Services/storage/storage.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    db = getFirestore();


    // _messages: {
    //     email: String;
    //     firstName: String;
    //     lastName: String;
    //     message: String;
    //     date: Date;
    //     image: String;
    // }[] = [];

    user: User;
    messages: Message[] = [];
    files: File[] = [];

    newMessage: String;

    formEditMessage = new FormGroup({
        editedMessage: new FormControl('', [Validators.required]),
    });

    constructor(
        private auth: AuthenticationService,
        private firestore: FirestoreService,
        private storage: StorageService,
        private cdref: ChangeDetectorRef
    ) { }

    ngOnInit() {
        setTimeout(() => {
            this.user = this.auth.user;

            this.firestore.getMessages().then((messages: Message[]) => {
                this.messages = messages;
            });

            this.storage.getFiles().then((files: File[]) => {
                this.files = files;
            });
        }, 2000);
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    setCursor = () => {
        document.getElementById('inputSendMessage')?.focus();
    };


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

    sendFile = (file: Event) => {
        this.storage.sendFile(file);
    };



    preUpdateMessage(date: Date) {
        this.firestore.getMessageId(date).then((messageId: string) => {
            this.test = messageId;
        });
    };

    test: string;

    /**
     * Edit message
     */
    editMessage = async () => {
        const editedMessage = this.formEditMessage.value.editedMessage;
        const date = new Date();
        const messageId = this.test;

        this.firestore.editMessage(editedMessage, date, messageId);
    };


    deleteMessage = (date: Date) => {
        this.firestore.deleteMessage(date);
    };

    /**
     *  Format date to locale zone 
     * @param date
     */
    formatDate = (date) => {
        const option = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        const time = date.toDate().toLocaleTimeString('fr-FR');

        return time;
    };
}
