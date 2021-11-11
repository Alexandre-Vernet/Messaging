import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/class/user';
import Swal from 'sweetalert2';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


declare var $: any;
@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private _user: User;
    private _firebaseError: string = '';

    constructor(private router: Router, private cookieService: CookieService) { }

    /**
     * Getter user
     * @return {User}
     */
    public get user(): User {
        return this._user;
    }

    /**
     * Setter user
     * @param {User} value
     */
    public set user(value: User) {
        this._user = value;
    }

    /**
     * Getter firebaseError
     * @return {string }
     */
    public get firebaseError(): string {
        return this._firebaseError;
    }

    /**
     * Setter firebaseError
     * @param {string } value
     */
    public set firebaseError(value: string) {
        this._firebaseError = value;
    }

    // isAuthenticated = () => {
    //     return firebase.auth().currentUser;
    // };

    /**
     * Sign in
     * @param email
     * @param password
     */
    signIn = (email: string, password: string) => {
        // firebase
        //     .auth()
        //     .signInWithEmailAndPassword(email, password)
        //     .then(() => {
        //         // User is logged in

        //         let userId = firebase.auth().currentUser?.uid;
        //         let user = firebase.firestore().collection('users').doc(userId);

        //         user.get()
        //             .then((doc) => {
        //                 if (doc.exists) {
        //                     // Set data
        //                     let firstName = doc.data()?.firstName;
        //                     let lastName = doc.data()?.lastName;
        //                     let email = doc.data()?.email;
        //                     let profilePicture = doc.data()?.profilePicture;
        //                     let dateCreation = doc.data()?.dateCreation;

        //                     this.user = new User(
        //                         firstName,
        //                         lastName,
        //                         email,
        //                         profilePicture,
        //                         dateCreation.toDate()
        //                     );

        //                     // Set cookie
        //                     this.cookieService.set('email', email, 365);
        //                     this.cookieService.set('password', password, 365);

        //                     // Clear error
        //                     this.firebaseError = '';

        //                     // Redirect to next page
        //                     let url = window.location.pathname;
        //                     if (url != '/sign-in') this.router.navigate([url]);
        //                     else this.router.navigate(['/home']);
        //                 } else console.log('Cant get user infos');
        //             })
        //             .catch((error) => {
        //                 console.log(error);
        //             });
        //     })
        //     .catch((error) => {
        //         console.log(error.message);
        //         this.firebaseError = error.message;
        //     });


        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
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
        // // Create user with email & pswd
        // firebase
        //     .auth()
        //     .createUserWithEmailAndPassword(email, password)
        //     .then(() => {
        //         // User has been created
        //         let userId: any = firebase.auth().currentUser?.uid;

        //         // Store informations of user
        //         firebase
        //             .firestore()
        //             .collection('users')
        //             .doc(userId)
        //             .set({
        //                 firstName: firstName,
        //                 lastName: lastName,
        //                 email: email,
        //                 dateCreation: new Date(),
        //             })
        //             .then(() => {
        //                 // User data has been created
        //                 console.log('User data has been saved !');

        //                 // Clear error
        //                 this.firebaseError = '';

        //                 this.signIn(email, password);
        //             })
        //             .catch((error) => {
        //                 console.log(
        //                     `Error in creation of the data of the user ${error.message}`
        //                 );

        //                 this.firebaseError = error.message;
        //             });
        //     })
        //     .catch((error) => {
        //         console.error(
        //             `Error in creation of the user : ${error.message}`
        //         );
        //         this.firebaseError = error.message;
        //     });


        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log('user: ', user)


            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            });
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
    };

    /**
     * Update profile
     * @param firstName
     * @param lastName
     */
    updateProfile = (firstName: string, lastName: string) => {
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
    };

    /**
     * Update password
     * @param password
     */
    updatePassword = (password: string) => {
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
    };

    /**
     * Sign out the user
     */
    signOut = () => {
        // // Delete cookie
        // this.cookieService.delete('password');

        // // Disconnect
        // firebase
        //     .auth()
        //     .signOut()
        //     .then(() => {
        //         // Disconnected
        //         this.router.navigate(['/sign-in']);
        //     });
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
    };
}
