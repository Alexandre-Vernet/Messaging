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

    signUp = (email: string, password: string) => {
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
