import {Injectable} from '@angular/core';
import {User} from 'src/app/class/user';
import {File} from 'src/app/class/file';
import {AuthenticationService} from '../authentication/authentication.service';
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {addDoc, collection, getFirestore} from 'firebase/firestore';
import Swal from "sweetalert2";

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    user: User;
    files: File[] = [];

    db = getFirestore();
    storage = getStorage();

    constructor(private auth: AuthenticationService) {
        this.user = this.auth.user;
    }

    /**
     * Send file
     * @param event
     */
    sendFile = (event) => {
        // Get file
        const file = event.target.files[0];

        // Set file source
        const fileSource = `files/${file.name}`;
        const storageRef = ref(this.storage, fileSource);

        // Upload file to firebase storage
        uploadBytes(storageRef, file).then(() => {
            getDownloadURL(ref(this.storage, fileSource))
                .then(async (url) => {
                    // Upload file to firestore
                    await addDoc(collection(this.db, "messages"), {
                        email: this.auth.user.email,
                        firstName: this.auth.user.firstName,
                        lastName: this.auth.user.lastName,
                        file: url,
                        date: new Date(),
                    });

                    await Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'File has been successfully uploaded',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                });
        });
    };

    updateProfilePicture = (event) => {
        // // Get current user
        // const userId: string = firebase.auth().currentUser.uid;
        // const user = firebase.firestore().collection('users').doc(userId);

        // // Get file
        // const file: File = event.target.files[0];

        // // Get reference to file
        // let imageRef = firebase
        //     .storage()
        //     .ref()
        //     .child(`profilePictures/${file.name}`);

        // // Upload file
        // imageRef.put(file).then(() => {
        //     firebase
        //         .storage()
        //         .ref()
        //         .child(`profilePictures/${file.name}`)
        //         .getDownloadURL()
        //         .then((profilePicture) => {
        //             // Upload file to firestore
        //             user.update({
        //                 profilePicture: profilePicture,
        //             })
        //                 .then(() => {
        //                     Swal.fire({
        //                         position: 'top-end',
        //                         icon: 'success',
        //                         title: 'Your profile picture has been successfully updated',
        //                         showConfirmButton: false,
        //                         timer: 1500,
        //                     });

        //                     // Update values
        //                     this.user.profilePicture = profilePicture;
        //                 })
        //                 .catch((error) => {
        //                     console.log(error);
        //                 });
        //         });
        // });
    };
}
