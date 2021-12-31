import { Component } from '@angular/core';
import { StorageService } from '../../../Services/storage/storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../Services/firestore/firestore.service';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class EditorComponent {

    formNewMessage = new FormGroup({
        newMessage: new FormControl('', [Validators.required]),
    });

    constructor(
        private storage: StorageService,
        private firestore: FirestoreService,
    ) {
    }

    sendMessage() {
        const newMessage = this.formNewMessage.value.newMessage;
        this.firestore.sendMessage(newMessage).then(() => {
            this.formNewMessage.reset();
        });
    };

    uploadFile() {
        document.getElementById('file_upload')?.click();
    }

    sendFile(file: Event) {
        this.storage.sendFile(file);
    }
}
