import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/class/user';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,
    deleteUser,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    getFirestore,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import { CryptoService } from '../crypto/crypto.service';
import { Toast } from '../../class/Toast';

declare var $: any;

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    user: User;
    db = getFirestore();
    auth = getAuth();
    provider = new GoogleAuthProvider();
    firebaseError: string = '';

    constructor(
        private router: Router,
        private cookieService: CookieService,
        private cryptoService: CryptoService
    ) {
    }

    async getAuth(): Promise<User> {
        return this.user;
    }

    /**
     * Sign in
     * @param email
     * @param password
     */
    signIn = (email: string, password: string) => {
        signInWithEmailAndPassword(this.auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;

                // Get user data
                const docRef = doc(this.db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    //  Set data
                    const firstName = docSnap.data()?.firstName;
                    const lastName = docSnap.data()?.lastName;
                    const email = docSnap.data()?.email;
                    const profilePicture = docSnap.data()?.profilePicture;
                    const dateCreation = docSnap.data()?.dateCreation;

                    this.user = new User(
                        firstName,
                        lastName,
                        email,
                        profilePicture,
                        dateCreation.toDate()
                    );

                    // Store user in local storage
                    const hashPassword = this.cryptoService.encrypt(password);
                    localStorage.setItem('email', email);
                    localStorage.setItem('password', hashPassword);

                    // Clear error
                    // this.firebaseError = '';

                    let url = window.location.pathname;
                    if (url != '/sign-in') this.router.navigate([url]);
                    else this.router.navigate(['/home']);
                } else {
                    // doc.data() will be undefined in this case
                    console.log('No such document!');
                }
            })
            .catch((error) => {
                console.error(error);
                this.firebaseError = error.message;
            });
        console.log(this.firebaseError);
        return this.firebaseError;
    };

    /**
     * Sign up
     * @param firstName
     * @param lastName
     * @param email
     * @param password
     */
    signUp = (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => {
        createUserWithEmailAndPassword(this.auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('user: ', user.uid);

                await setDoc(doc(this.db, 'users', user.uid), {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    dateCreation: new Date(),
                })
                    .then(() => {
                        // Clear error
                        this.firebaseError = '';

                        this.signIn(email, password);
                    })
                    .catch((error) => {
                        console.error(error);

                        this.firebaseError = error.message;
                    });
            })
            .catch((error) => {
                console.error(error);
                this.firebaseError = error.message;
            });

        return this.firebaseError;
    };

    // /**
    //  * Google connexion
    //  */
    googleSignUp = () => {
        // let provider = new firebase.auth.GoogleAuthProvider();

        // firebase
        //     .auth()
        //     .signInWithPopup(provider)
        //     .then((result) => {
        //         let userId: string = firebase.auth().currentUser.uid;

        //         // Get data from google account
        //         const firstName = result.user?.displayName?.split(' ')[0];
        //         const lastName = result.user?.displayName?.split(' ')[1];
        //         const email = result.user?.email;
        //         const profilePicture = result.user?.photoURL;

        //         // Set data
        //         this.user.firstName = firstName;
        //         this.user.lastName = lastName;
        //         this.user.email = email;
        //         this.user.profilePicture = profilePicture;

        //         // Store informations of user
        //         firebase
        //             .firestore()
        //             .collection('users')
        //             .doc(userId)
        //             .set({
        //                 firstName: firstName,
        //                 lastName: lastName,
        //                 email: email,
        //                 profilePicture: profilePicture,
        //                 dateCreation: new Date(),
        //             })
        //             .then(() => {
        //                 // User data has been created
        //                 console.log('User data has been saved !');

        //                 this.router.navigate(['home']);
        //             })
        //             .catch((error) => {
        //                 console.log(
        //                     `Error in creation of the data of the user ${error.message}`
        //                 );
        //                 this.firebaseError = error.message;
        //             });

        //         this.router.navigate(['home']);
        //     })
        //     .catch((error) => {
        //         console.log(error.message);
        //         this.firebaseError = error.message;
        //     });

        signInWithPopup(this.auth, this.provider)
            .then(async (result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                console.log('token: ', token);
                // The signed-in user info.
                const user = result.user;
                console.log('user: ', user);

                // Get data from google account
                const firstName = result.user?.displayName?.split(' ')[0];
                const lastName = result.user?.displayName?.split(' ')[1];
                const email = result.user?.email;
                const profilePicture = result.user?.photoURL;

                // Set users data
                this.user = new User(
                    firstName,
                    lastName,
                    email,
                    profilePicture,
                    new Date()
                );

                await setDoc(doc(this.db, 'users', user.uid), {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    dateCreation: new Date(),
                })
                    .then(() => {
                        //  User data has been created
                        console.log('User is logged with google account');

                        // Clear error
                        this.firebaseError = '';

                        // Navigate to home
                        this.router.navigate(['home']);
                    })
                    .catch((error) => {
                        console.error(error);
                        this.firebaseError = error.message;
                    });
            })
            .catch((error) => {
                console.error(error);
                const errorMessage = error.message;
                this.firebaseError = errorMessage;
            });
    };

    /**
     * Reset password
     * @param emailAddress
     */
    resetPassword = (emailAddress: string) => {
        // firebase
        //     .auth()
        //     .sendPasswordResetEmail(emailAddress)
        //     .then(() => {
        //         // Email sent
        //         console.log('Email sent !');

        //         Swal.fire({
        //             position: 'top-end',
        //             icon: 'success',
        //             title: `E-mail has been sent to ${emailAddress}`,
        //             showConfirmButton: false,
        //             timer: 1500,
        //         });
        //     })
        //     .catch((error) => {
        //         // An error occurred
        //         console.log('error: ', error);
        //         Swal.fire({
        //             icon: 'error',
        //             title: error,
        //             showConfirmButton: true,
        //         });
        //     });

        sendPasswordResetEmail(this.auth, emailAddress)
            .then(() => {
                // Email sent
                Toast.success('E-mail has been sent to', emailAddress);
            })
            .catch((error) => {
                // An error occurred
                console.error(error);
                Toast.error('Error in sending email', error.message);
            });
    };

    /**
     * Update profile
     * @param firstName
     * @param lastName
     */
    updateProfile = async (firstName: string, lastName: string) => {
        // const userId: string = firebase.auth().currentUser.uid;
        // const user = firebase.firestore().collection('users').doc(userId);

        // user.update({
        //     firstName: firstName,
        //     lastName: lastName,
        // })
        //     .then(() => {
        //         // User has been successfully updated
        //         console.log('User has been successfully updated');

        //         Swal.fire({
        //             position: 'top-end',
        //             icon: 'success',
        //             title: 'Your account has been successfully updated',
        //             showConfirmButton: false,
        //             timer: 1500,
        //         });

        //         // Update values
        //         this.user.firstName = firstName;
        //         this.user.lastName = lastName;
        //     })
        //     .catch((error) => {
        //         // The document probably doesn't exist.
        //         console.error('Error updating document: ', error);

        //         Swal.fire({
        //             icon: 'error',
        //             title: error,
        //             showConfirmButton: true,
        //         });
        //     });

        const userId = this.auth.currentUser.uid;
        const userRef = doc(this.db, 'users', userId);

        await updateDoc(userRef, {
            firstName: firstName,
            lastName: lastName,
        })
            .then(() => {
                Toast.success('Your account has been successfully updated');

                // Update values
                this.user.firstName = firstName;
                this.user.lastName = lastName;
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error(error);
                Toast.error(error.message);
            });
    };

    /**
     * Update email
     * @param email
     */
    updateEmail = (email: string) => {
        // const userId = firebase.auth().currentUser.uid;
        // const user = firebase.auth().currentUser;

        // user.updateEmail(email)
        //     .then(() => {
        //         // Update successful

        //         firebase
        //             .firestore()
        //             .collection('users')
        //             .doc(userId)
        //             .update({
        //                 email: email,
        //             })
        //             .then(() => {
        //                 // Disconnect
        //                 this.signOut();
        //                 Swal.fire({
        //                     position: 'top-end',
        //                     icon: 'success',
        //                     title: 'Your email has been successfully updated',
        //                     showConfirmButton: false,
        //                     timer: 1500,
        //                 });
        //             })
        //             .catch((error) => {
        //                 Swal.fire({
        //                     icon: 'error',
        //                     title: error,
        //                     showConfirmButton: true,
        //                 });
        //             });
        //     })
        //     .catch((error) => {
        //         // An error occurred
        //         Swal.fire({
        //             icon: 'error',
        //             title: error,
        //             showConfirmButton: true,
        //         });
        //     });

        const userId = this.auth.currentUser.uid;
        const userRef = doc(this.db, 'users', userId);

        updateEmail(this.auth.currentUser, email)
            .then(async () => {
                // // Update successful
                // firebase
                //     .firestore()
                //     .collection('users')
                //     .doc(userId)
                //     .update({
                //         email: email,
                //     })
                //     .then(() => {
                //         // Disconnect
                //         this.signOut();
                //         Swal.fire({
                //             position: 'top-end',
                //             icon: 'success',
                //             title: 'Your email has been successfully updated',
                //             showConfirmButton: false,
                //             timer: 1500,
                //         });
                //     })
                //     .catch((error) => {
                //         Swal.fire({
                //             icon: 'error',
                //             title: error,
                //             showConfirmButton: true,
                //         });
                //     });

                await updateDoc(userRef, {
                    email: email,
                }).then(() => {
                    // Disconnect
                    this.signOut();

                    Toast.success('Your email has been successfully updated');

                });
            })
            .catch((error) => {
                console.error(error);
                Toast.error(error.message);
            });
    };

    /**
     * Update password
     * @param password
     */
    updatePassword = (newPassword: string) => {
        // let user: any = firebase.auth().currentUser;

        // user.updatePassword(password)
        //     .then(() => {
        //         console.log('Password has been successfully updated');
        //         Swal.fire({
        //             position: 'top-end',
        //             icon: 'success',
        //             title: `Password has been successfully updated`,
        //             showConfirmButton: false,
        //             timer: 1500,
        //         });
        //     })
        //     .catch((error: string) => {
        //         console.log('error: ', error);
        //         Swal.fire({
        //             icon: 'error',
        //             title: error,
        //             showConfirmButton: true,
        //         });
        //     });

        const user = this.auth.currentUser;

        updatePassword(user, newPassword)
            .then(() => {
                Toast.success('Password has been successfully updated');
            })
            .catch((error) => {
                console.error(error);
                Toast.error('Error in updating password', error.message);
            });
    };

    /**
     * Sign out the user
     */
    signOut = () => {
        // Disconnect
        // firebase
        //     .auth()
        //     .signOut()
        //     .then(() => {
        //         // Disconnected
        //         this.router.navigate(['/sign-in']);
        //     });

        signOut(this.auth)
            .then(() => {
                // Delete cookie
                this.cookieService.delete('password');

                this.router.navigate(['/sign-in']);
            })
            .catch((error) => {
                console.error(error);
                Toast.error('Error while disconnecting ', error.message);
            });
    };

    /**
     * Delete account
     */
    deleteAccount = () => {
        // let userId = firebase.auth().currentUser?.uid;
        // let user = firebase.firestore().collection('users').doc(userId);

        // user.delete()
        //     .then(() => {
        //         console.log('All data of the user has been deleted');

        //         firebase
        //             .auth()
        //             .currentUser?.delete()
        //             .then(() => {
        //                 // User deleted.
        //                 console.log('User has been deleted');

        //                 Swal.fire({
        //                     position: 'top-end',
        //                     icon: 'success',
        //                     title: `User has been deleted`,
        //                     showConfirmButton: false,
        //                     timer: 1500,
        //                 });

        //                 // Go to sign up
        //                 this.router.navigate(['/sign-up']);
        //             })
        //             .catch((error) => {
        //                 console.log(`Error while deleting the user : ${error}`);

        //                 Swal.fire({
        //                     icon: 'error',
        //                     title: error,
        //                     showConfirmButton: true,
        //                 });
        //             });
        //     })
        //     .catch((error) => {
        //         console.error(`Error deleting data of user : ${error}`);

        //         Swal.fire({
        //             icon: 'error',
        //             title: error,
        //             showConfirmButton: true,
        //         });
        //     });

        const user = this.auth.currentUser;
        const userId = this.auth.currentUser.uid;

        deleteUser(user)
            .then(async () => {
                console.log('All data of the user has been deleted');

                await deleteDoc(doc(this.db, 'users', userId))
                    .then(() => {
                        Toast.success('User has been deleted');

                        // Go to sign up
                        this.router.navigate(['/sign-up']);
                    })
                    .catch((error) => {
                        console.error(error);
                        Toast.error('Error while deleting the user', error.message);
                    });
            })
            .catch((error) => {
                console.error(error);
                Toast.error('Error deleting data of user : ', error.message);
            });
    };
}
