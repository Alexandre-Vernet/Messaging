import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { File } from 'src/app/class/file';
import { User } from 'src/app/class/user';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import { FirestoreService } from 'src/app/Services/firestore/firestore.service';
import { StorageService } from 'src/app/Services/storage/storage.service';
import { Message } from '../../class/message';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, AfterContentChecked {
    @ViewChild('modalEditMessage') modalEditMessage;
    messageId: string;

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

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    setCursor = () => {
        document.getElementById('inputSendMessage')?.focus();
    };

    sendMessage() {
        if (this.newMessage.length > 0) {
            this.firestore.sendMessage(this.newMessage);

            // Clear input
            this.newMessage = '';
        }
    };

    uploadFile() {
        document.getElementById('file_upload')?.click();
    };

    sendFile(file: Event) {
        this.storage.sendFile(file);
    };

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
    };

    editLastMessage() {
        // Open modal
        document.getElementById('modalEditLastMessage').click();

        // Get last message
        this.firestore.getLastMessage().then((lastMessage) => {
            const message = lastMessage['message'];
            this.messageId = lastMessage['id'];

            // Set message in input
            this.formEditMessage.get('editedMessage').setValue(message['message']);
        });
    }

    deleteMessage(date: Date) {
        this.firestore.deleteMessage(date);
    };

    /**
     *  Format date to locale zone
     * @param date
     */
    formatDate(date) {
        const option = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        const time = date.toDate().toLocaleTimeString('fr-FR');

        return time;
    };
}
