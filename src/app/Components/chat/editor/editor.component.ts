import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../Services/storage/storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../Services/firestore/firestore.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent {


    newMessage: string;

    formNewMessage = new FormGroup({
        newMessage: new FormControl('', [Validators.required]),
    });

    constructor(
        private storage: StorageService,
        private firestore: FirestoreService,
    ) {
    }

    sendMessage() {
        if (this.newMessage.length > 0) {
            this.firestore.sendMessage(this.newMessage);

            // Clear input
            this.newMessage = '';
        }

        // const newMessage = this.formNewMessage.value;
        //
        // if (newMessage.length > 0) {
        //     this.firestore.sendMessage(newMessage);
        // }
    };

    uploadFile() {
        document.getElementById('file_upload')?.click();
    };

    sendFile(file: Event) {
        this.storage.sendFile(file);
    };
}
