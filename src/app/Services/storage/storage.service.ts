import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private _files: { path: String; date: any }[] = [];

    constructor(private auth: AuthenticationService) {}

    get files() {
        let imageRef = firebase.storage().ref().child('images');

        // Find all items
        imageRef
            .listAll()
            .then((res) => {
                res.items.forEach((itemRef) => {
                    itemRef.getDownloadURL().then((url) => {
                        this._files.push({
                            path: url,
                            date: itemRef.getMetadata().then((metadata) => {
                                metadata.timeCreated;
                            }),
                        });
                    });
                });
            })
            .catch((error) => {
                console.log('error: ', error);
            });

        return this._files;
    }

    /**
     * Send file
     * @param event
     */
    sendFile = (event: any) => {
        // Get file
        const file: File = event.target.files[0];

        // Get reference to file
        let imageRef = firebase.storage().ref().child(`images/${file.name}`);

        // Upload file
        imageRef.put(file).then(() => {
            firebase
                .storage()
                .ref()
                .child(`images/${file.name}`)
                .getDownloadURL()
                .then((url) => {
                    // Upload file to firestore
                    firebase
                        .firestore()
                        .collection('messages')
                        .add({
                            email: this.auth.user['email'],
                            firstName: this.auth.user['firstName'],
                            lastName: this.auth.user['lastName'],
                            image: url,
                            date: new Date(),
                        })
                        .catch((err: any) => {
                            console.log(err);
                        });
                });
        });
    };
}
