import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

declare var $: any;
@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    _user: any = {};
    _firebaseError: string = '';

    constructor(private router: Router, private cookieService: CookieService) {}

    get user(): any {
        return this._user;
    }

    set user(value: any) {
        this._user = value;
    }

    get firebaseError(): string {
        return this._firebaseError;
    }

    set firebaseError(value: string) {
        this._firebaseError = value;
    }

    isAuthenticated = () => {
        return firebase.auth().currentUser;
    };

    /**
     * @param email in database
     * @param password in database
     */
    signIn = (email: string, password: string) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                // User is logged in

                let userId = firebase.auth().currentUser?.uid;
                let user = firebase.firestore().collection('users').doc(userId);

                user.get()
                    .then((doc) => {
                        if (doc.exists) {
                            // Set cookie
                            this.cookieService.set('email', email, 365);
                            this.cookieService.set('password', password, 365);

                            // Set data
                            this.user.firstName = doc.data()?.firstName;
                            this.user.lastName = doc.data()?.lastName;
                            this.user.email = doc.data()?.email;
                            this.user.dateCreation = doc.data()?.dateCreation;

                            // Clear error
                            this.firebaseError = '';

                            // Redirect to next page
                            let url = window.location.pathname;
                            if (url != '/sign-in') this.router.navigate([url]);
                            else this.router.navigate(['/home']);
                        } else console.log('Cant get user infos');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error.message);
                this.firebaseError = error.message;
            });
    };

    /**
     * @param firstName first name
     * @param lastName last name
     * @param email link to Auth firebase email
     * @param password crypted
     */
    signUp = (
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) => {
        // Create user with email & pswd
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                // User has been created
                let userId: any = firebase.auth().currentUser?.uid;

                // Store informations of user
                firebase
                    .firestore()
                    .collection('users')
                    .doc(userId)
                    .set({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        dateCreation: new Date(),
                    })
                    .then(() => {
                        // User data has been created
                        console.log('User data has been saved !');

                        // Clear error
                        this.firebaseError = '';

                        this.signIn(email, password);
                    })
                    .catch((error) => {
                        console.log(
                            `Error in creation of the data of the user ${error.message}`
                        );

                        this.firebaseError = error.message;
                    });
            })
            .catch((error) => {
                console.error(
                    `Error in creation of the user : ${error.message}`
                );
                this.firebaseError = error.message;
            });
    };

    /**
     * Google connexion
     */
    googleSignUp = () => {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
                let userId: any = firebase.auth().currentUser?.uid;

                // Get data from google account
                const firstName = result.user?.displayName?.split(' ')[0];
                const lastName = result.user?.displayName?.split(' ')[1];
                const email = result.user?.email;
                const photoUrl = result.user?.photoURL;

                // Set data
                this.user.firstName = firstName;
                this.user.lastName = lastName;
                this.user.email = email;
                this.user.photo = photoUrl;

                // Store informations of user
                firebase
                    .firestore()
                    .collection('users')
                    .doc(userId)
                    .set({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        dateCreation: new Date(),
                    })
                    .then(() => {
                        // User data has been created
                        console.log('User data has been saved !');

                        this.router.navigate(['home']);
                    })
                    .catch((error) => {
                        console.log(
                            `Error in creation of the data of the user ${error.message}`
                        );
                        this.firebaseError = error.message;
                    });

                this.router.navigate(['home']);
            })
            .catch((error) => {
                console.log(error.message);
                this.firebaseError = error.message;
            });
    };

    /**
     * @param emailAddress is the email address who receive link to reset password
     */
    resetPassword = (emailAddress: string) => {
        firebase
            .auth()
            .sendPasswordResetEmail(emailAddress)
            .then(() => {
                // Email sent
                console.log('Email sent !');

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `E-mail has been sent to ${emailAddress}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            })
            .catch((error) => {
                // An error occurred
                console.log('error: ', error);
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `We are sorry, we were unable to process your reset password. Please try after
                    sometimes.\n${error}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            });
    };

    updateProfile = (firstName: string, lastName: string) => {
        let userId: any = firebase.auth().currentUser?.uid;
        let user = firebase.firestore().collection('users').doc(userId);

        user.update({
            firstName: firstName,
            lastName: lastName,
        })
            .then(() => {
                // User has been successfully updated
                console.log('User has been successfully updated');

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Your account has been successfully updated`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error('Error updating document: ', error);

                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `We are sorry, we were unable to process your updating profile. Please try after
                    sometimes.\n${error}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            });
    };

    updatePassword = (password: string) => {
        let user: any = firebase.auth().currentUser;

        user.updatePassword(password)
            .then(() => {
                console.log('Password has been successfully updated');
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Password has been successfully updated`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            })
            .catch((error: any) => {
                console.log('error: ', error);
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `We are sorry, we were unable to process your updating password. Please try after
                    sometimes.\n${error}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            });
    };

    /**
     * Sign out the user
     */
    signOut = () => {
        // Delete cookie
        this.cookieService.delete('password');

        // Disconnect
        firebase
            .auth()
            .signOut()
            .then(() => {
                // Disconnected
                this.router.navigate(['/sign-in']);
            });
    };

    deleteAccount = () => {
        let userId = firebase.auth().currentUser?.uid;
        let user = firebase.firestore().collection('users').doc(userId);

        user.delete()
            .then(() => {
                console.log('All data of the user has been deleted');

                firebase
                    .auth()
                    .currentUser?.delete()
                    .then(() => {
                        // User deleted.
                        console.log('User has been deleted');

                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: `User has been deleted`,
                            showConfirmButton: false,
                            timer: 1500,
                        });

                        // Go to sign up
                        this.router.navigate(['/sign-up']);
                    })
                    .catch((error) => {
                        console.log(`Error while deleting the user : ${error}`);

                        Swal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: `We are sorry, we were unable to process your deleting profile. Please try after
                            sometimes.\n${error}`,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    });
            })
            .catch((error) => {
                console.error(`Error deleting data of user : ${error}`);

                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: `We are sorry, we were unable to process your deleting profile. Please try after
                    sometimes.\n${error}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            });
    };
}
