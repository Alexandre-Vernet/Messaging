import {Injectable} from '@angular/core';
import {User} from 'src/app/class/user';
import {File} from 'src/app/class/file';
import {AuthenticationService} from '../authentication/authentication.service';
import {getDownloadURL, getStorage, listAll, ref, uploadBytes} from "firebase/storage";
import {addDoc, collection, getDocs, getFirestore, query, where} from 'firebase/firestore';
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

    async getFiles(): Promise<File[]> {
        // Get all files from firestore
        const q = query(collection(this.db, 'messages'), where('image', '!=', null));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const filesRef = ref(this.storage, 'images');

            listAll(filesRef)
                .then((res) => {
                    res.items.forEach((itemRef) => {
                        const name = itemRef.name;

                        // Get URL file
                        getDownloadURL(ref(this.storage, `images/${name}`))
                            .then(async (url) => {
                                const id = doc.get('id');
                                const name = doc.get('name');
                                // const extensionFile = name.split('.')[1];
                                // const size = doc.get('size');
                                // const date = doc.get('date');
                                //
                                // const email = doc.get('email');
                                // const firstName = doc.get('firstName');
                                // const lastName = doc.get('lastName');
                                // const user = new User(
                                //     firstName,
                                //     lastName,
                                //     email,
                                //     null,
                                //     null
                                // );

                                const file = new File(
                                    id,
                                    name,
                                    url,
                                    null, null, null, null
                                );

                                this.files.push(file);
                            })
                            .catch((error) => {
                                console.log('error: ', error);

                                Swal.fire({
                                    position: 'top-end',
                                    icon: 'error',
                                    title: `Error while getting URL files ${error}`,
                                    showConfirmButton: false,
                                    timer: 4000,
                                });
                            });
                    });
                })
                .catch((error) => {
                    console.log('error: ', error);

                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: `Error while getting files ${error}`,
                        showConfirmButton: false,
                        timer: 4000,
                    });
                });
        });

        return this.files;
    }

    async getFiles2(): Promise<File[]> {
        // let imageRef = firebase.storage().ref().child('images');

        // // Find all items
        // imageRef
        //     .listAll()
        //     .then((res) => {
        //         res.items.forEach((itemRef) => {
        //             itemRef.getDownloadURL().then((url) => {
        //                 this._files.push({
        //                     path: url,
        //                     date: itemRef.getMetadata().then((metadata) => {
        //                         metadata.timeCreated;
        //                     }),
        //                 });
        //             });
        //         });
        //     })
        //     .catch((error) => {
        //         console.log('error: ', error);
        //     });


        // Create a reference under which you want to list
        const listRef = ref(this.storage, 'images');

        // Find all the prefixes and items.
        listAll(listRef)
            .then((res) => {
                res.items.forEach((itemRef) => {

                    // Get path from file
                    const path = itemRef.fullPath;
                    const date = new Date();

                    // const file = new File(path, date);
                    // console.log('itemRef: ', file);

                    // this.files.push(file);


                    // All the items under listRef.
                    // itemRef.getDownloadURL().then((url) => {
                    //     this.files.push({
                    //         path: url,
                    //         date: itemRef.getMetadata().then((metadata) => {
                    //             metadata.timeCreated;
                    //         }),
                    //     });
                    // });


                });
            }).catch((error) => {
            // Uh-oh, an error occurred!
            console.log('error: ', error)
        });


        return this.files;
    }


    /**
     * Send file
     * @param event
     */
    sendFile = (event) => {
        // Get file
        const file = event.target.files[0];
        console.log('file: ', file)

        // // Get reference to file
        // let imageRef = firebase.storage().ref().child(`images/${file.name}`);

        // // Upload file
        // imageRef.put(file).then(() => {
        //     firebase
        //         .storage()
        //         .ref()
        //         .child(`images/${file.name}`)
        //         .getDownloadURL()
        //         .then((image) => {
        //             // Upload file to firestore
        //             firebase
        //                 .firestore()
        //                 .collection('messages')
        //                 .add({
        //                     email: this.auth.user.email,
        //                     firstName: this.auth.user.firstName,
        //                     lastName: this.auth.user.lastName,
        //                     image: image,
        //                     date: new Date(),
        //                 })
        //                 .catch((error) => {
        //                     console.log(error);
        //                 });
        //         });
        // });


        const storageRef = ref(this.storage, `images/${file.name}`);

        uploadBytes(storageRef, file).then(async (image) => {
            console.log('image: ', image);

            await addDoc(collection(this.db, "messages"), {
                email: this.auth.user.email,
                firstName: this.auth.user.firstName,
                lastName: this.auth.user.lastName,
                image: image.ref.fullPath,
                date: new Date(),
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
