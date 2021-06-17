import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    _user: any = {};
    error!: string;

    constructor(private router: Router, private cookieService: CookieService) {}

    get user(): any {
        return this._user;
    }

    set user(value: any) {
        this._user = value;
    }

    getError = () => {
        return this.error;
    };

    setError = (error: any) => {
        this.error = error;
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
                // User in logged in

                // Set cookie
                this.cookieService.set('email', email, 365);
                this.cookieService.set('password', password, 365);

                let userId = firebase.auth().currentUser?.uid;

                firebase
                    .firestore()
                    .collection('users')
                    .doc(userId)
                    .get()
                    .then((doc) => {
                        if (doc.exists) {
                            this.user['firstName'] = doc.data()?.firstName;
                            this.user['lastName'] = doc.data()?.lastName;
                            this.user['email'] = doc.data()?.email;
                        } else console.log('Cant get user infos');
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                // Redirect to next page
                let url = window.location.pathname;
                this.router.navigate(['/home']);
            })
            .catch((error) => {
                console.log(error.message);
                this.setError(error.message);
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

                        this.signIn(email, password);
                    })
                    .catch((error) => {
                        console.log(
                            `Error in creation of the data of the user ${error.message}`
                        );

                        // this.firebaseError = error.message;
                    });
            })
            .catch((error) => {
                console.error(
                    `Error in creation of the user : ${error.message}`
                );
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
                // $('#modalSuccessResetPassword').modal('show');
                // $('#modalResetPassword').modal('hide');
            })
            .catch((error) => {
                // this.firebaseError = error;
                // $('#modalFailResetPassword').modal('show');
            });
    };

    updateProfile = () => {};

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

        firebase
            .firestore()
            .collection('users')
            .doc(userId)
            .delete()
            .then(() => {
                console.log('All data of the user has been deleted');

                firebase
                    .auth()
                    .currentUser?.delete()
                    .then(() => {
                        // User deleted.
                        console.log('User has been deleted');

                        // Go to sign up
                        this.router.navigate(['/sign-up']);
                    })
                    .catch((error) => {
                        console.log(`Error while deleting the user : ${error}`);
                    });
            })
            .catch((error) => {
                console.error(`Error deleting data of user : ${error}`);
            });
    };
}
