import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AuthenticationService } from '../authentication/authentication.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/class/user';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    user: User;
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
    sendFile = (event) => {
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
                .then((image) => {
                    // Upload file to firestore
                    firebase
                        .firestore()
                        .collection('messages')
                        .add({
                            email: this.auth.user.email,
                            firstName: this.auth.user.firstName,
                            lastName: this.auth.user.lastName,
                            image: image,
                            date: new Date(),
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
        });
    };

    sendProfilePicture = (event) => {
        // Get current user
        const userId: string = firebase.auth().currentUser.uid;
        const user = firebase.firestore().collection('users').doc(userId);

        // Get file
        const file: File = event.target.files[0];

        // Get reference to file
        let imageRef = firebase
            .storage()
            .ref()
            .child(`profilePictures/${file.name}`);

        // Upload file
        imageRef.put(file).then(() => {
            firebase
                .storage()
                .ref()
                .child(`profilePictures/${file.name}`)
                .getDownloadURL()
                .then((profilePicture) => {
                    // Upload file to firestore
                    user.update({
                        profilePicture: profilePicture,
                    })
                        .then(() => {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: 'Your profile picture has been successfully updated',
                                showConfirmButton: false,
                                timer: 1500,
                            });

                            // Update values
                            this.user.profilePicture = profilePicture;
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
        });
    };
}
