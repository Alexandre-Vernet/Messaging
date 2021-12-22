import { Injectable } from '@angular/core';
import { User } from 'src/app/class/user';
import { File } from 'src/app/class/file';
import { AuthenticationService } from '../authentication/authentication.service';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { Toast } from '../../class/Toast';

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    user: User;
    files: File[] = [];

    db = getFirestore();
    storage = getStorage();

    constructor(private auth: AuthenticationService) {
        setTimeout(() => {
            this.user = this.auth.user;
        }, 1500);
    }

    sendFile(event) {
        // Get file
        const file = event.target.files[0];

        // Set file source
        const fileSource = `files/${ file.name }`;
        const storageRef = ref(this.storage, fileSource);

        // Upload file to firebase storage
        uploadBytes(storageRef, file).then(() => {
            getDownloadURL(ref(this.storage, fileSource))
                .then(async (url) => {
                    // Upload file to firestore
                    await addDoc(collection(this.db, 'messages'), {
                        email: this.auth.user.email,
                        firstName: this.auth.user.firstName,
                        lastName: this.auth.user.lastName,
                        file: {
                            name: file.name,
                            url: url,
                            type: file.type,
                        },
                        date: new Date(),
                    });
                });
        });
    };

    updateProfilePicture(event) {
        // Get file
        const file = event.target.files[0];

        // Set file source
        const fileSource = `profilePictures/${ file.name }`;
        const storageRef = ref(this.storage, fileSource);

        const userRef = doc(this.db, 'users', this.user.id);

        // Upload file to firebase storage
        uploadBytes(storageRef, file).then(() => {
            getDownloadURL(ref(this.storage, fileSource))
                .then(async (url) => {
                    // Upload file to firestore
                    await updateDoc(userRef, {
                        profilePicture: url,
                    });

                    // Update user profile picture
                    this.user.profilePicture = url;

                    // Show toast
                    Toast.success('Profile picture has been successfully updated');
                });
        });
    }
}
