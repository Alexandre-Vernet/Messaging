import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    user: any = {};
    error!: string;

    constructor(private router: Router, private cookieService: CookieService) {}

    getUser = () => {
        return this.user;
    };

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
                // Set cookie
                this.cookieService.set('email', email, 365);
                this.cookieService.set('password', password, 365);

                let userId: any = firebase.auth().currentUser?.uid;

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

                // Redirect to home
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
                    })
                    .then(() => {
                        console.log('User data has been saved !');

                        this.signIn(email, password);
                    })
                    .catch((error) => {
                        console.log(error.message);

                        // this.firebaseError = error.message;
                    });
            })
            .catch((error) => {
                console.error('Error in creation of the user', error);
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
                this.router.navigate(['/sign-in']);
            });
    };
}
