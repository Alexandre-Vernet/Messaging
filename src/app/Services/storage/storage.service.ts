import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor() {}

    _files: {}[] = [];

    get files() {
        let imageRef = firebase.storage().ref().child('images');

        // Find all items
        imageRef
            .listAll()
            .then((res) => {
                res.items.forEach((itemRef) => {
                    itemRef.getDownloadURL().then((url) => {
                        this._files.push(url);
                    });
                });
            })
            .catch((error) => {
                console.log('error: ', error);
            });

        return this._files;
    }

    sendFile = (event: any) => {
        // Get file
        const file: File = event.target.files[0];

        // Get reference to file
        let imageRef = firebase.storage().ref().child(`images/${file.name}`);

        // Upload file
        imageRef.put(file).then((snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
        });
    };
}
