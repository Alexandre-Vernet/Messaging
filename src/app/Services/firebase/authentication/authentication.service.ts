import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';
import { SignInComponent } from 'src/app/Components/login/sign-in/sign-in.component';

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

    setUser = (user: any) => {
        this.user['user'] = user;
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
    signIn = (email: string, password: string): string => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Set cookie
                this.cookieService.set('email', email, 365);
                this.cookieService.set('password', password, 365);

                // Save email
                this.setUser(userCredential.user?.email);

                // Redirect to home
                this.router.navigate(['/home']);
            })
            .catch((error) => {
                console.log(error.message);
                this.setError(error.message);
            });

        return 'ok';
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
        // Store informations of user
        firebase
            .firestore()
            .collection('users')
            .add({
                firstName: firstName,
                lastName: lastName,
                email: email,
            })
            .then((docRef) => {
                console.log('Document written with ID: ', docRef.id);
            })
            .catch((error) => {
                console.error('Error adding document: ', error);
            });

        // Store login
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Set cookie
                this.cookieService.set('email', email, 365);
                this.cookieService.set('password', password, 365);

                // Redirect to home
                this.router.navigate(['/home']);
            })
            .catch((error) => {
                console.log(error.message);

                // this.firebaseError = error.message;
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
