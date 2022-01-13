import { Injectable } from '@angular/core';
import { User } from 'src/app/class/user';
import { File } from 'src/app/class/file';
import { AuthenticationService } from '../authentication/authentication.service';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { Toast } from '../../class/toast';
import { FirestoreService } from '../firestore/firestore.service';

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    user: User;
    files: File[] = [];

    db = getFirestore();
    storage = getStorage();

    constructor(private auth: AuthenticationService,
                private firestore: FirestoreService) {
        setTimeout(() => {
            this.user = this.auth.user;
        }, 1500);
    }

    sendFile(conversationId: string, event) {
        // Get file
        const file = event.target.files[0];

        // Get more info like name, type, url
        const fileName = file.name;
        const url = null;
        const type = file.type.split('/')[0];   /* Parse type file : image/png => image */
        const newFile = new File(fileName, url, type);

        // Set file source
        const fileSource = `files/${ file.name }`;

        const storageRef = ref(this.storage, fileSource);

        // Upload file to firebase storage
        uploadBytes(storageRef, file).then(() => {
            getDownloadURL(ref(this.storage, fileSource))
                .then(async (url) => {
                    const messageId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

                    const message = {
                        [this.user.id]: {
                            [messageId]: {
                                file: {
                                    name: newFile.name,
                                    url: url,
                                    type: newFile.type,
                                },
                                date: new Date(),
                            }
                        }
                    };

                    // Upload file to firestore
                    await this.firestore.sendMessage(conversationId, 'message', message);
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
