import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../class/user';
import { Message } from '../../class/message';
import { File } from '../../class/file';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../Services/authentication/authentication.service';
import { FirestoreService } from '../../Services/firestore/firestore.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, AfterContentChecked {
    @ViewChild('modalEditMessage') modalEditMessage;
    messageId: string;

    user: User;
    messages: Message[] = [];
    files: File[] = [];


    formEditMessage = new FormGroup({
        editedMessage: new FormControl('', [Validators.required]),
    });

    constructor(
        private auth: AuthenticationService,
        private firestore: FirestoreService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.auth.getAuth().then((user: User) => {
                this.user = user;
            });
        }, 2000);

        this.firestore.getMessages().then((messages: Message[]) => {
            this.messages = messages;
        });
    }

    ngAfterViewInit() {
        // Shortcut keyboard
        window.addEventListener('keydown', (e) => {
            // Edit last message
            if (e.code === 'ArrowUp') {
                e.preventDefault();
                this.editLastMessage();
            }
        });
    }

    ngAfterContentChecked() {
        this.changeDetectorRef.detectChanges();
    }

    setCursor() {
        document.getElementById('inputSendMessage')?.focus();
    };

    getMessageId(date: Date) {
        this.firestore.getMessageId(date).then((message: string) => {
            this.messageId = message['id'];
            this.formEditMessage.get('editedMessage').setValue(message['message']);
        });
    }

    async editMessage() {
        const editedMessage = this.formEditMessage.value.editedMessage,
            date = new Date(),
            messageId = this.messageId;

        await this.firestore.editMessage(editedMessage, date, messageId);

        // Close modal
        this.modalEditMessage.nativeElement.click();
    }

    editLastMessage() {
        // Open modal
        document.getElementById('modalEditLastMessage').click();

        // Get last message
        this.firestore.getLastMessage().then((lastMessage) => {
            const message = lastMessage.message;
            this.messageId = lastMessage.id;

            // Set message in input
            this.formEditMessage.get('editedMessage').setValue(message);
        });
    }

    deleteMessage(date: Date) {
        this.firestore.deleteMessage(date);
    }

    formatDate(date) {
        return date.toDate().toLocaleTimeString('fr-FR');
    }
}