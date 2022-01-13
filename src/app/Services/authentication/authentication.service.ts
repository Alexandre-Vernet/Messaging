import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/class/user';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
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
import { Toast } from '../../class/toast';
import { getStorage } from 'firebase/storage';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    user: User;
    db = getFirestore();
    auth = getAuth();
    storage = getStorage();
    provider = new GoogleAuthProvider();
    firebaseError: string = '';

    constructor(
        private router: Router,
        private cryptoService: CryptoService,
    ) {
    }

    async getAuth(): Promise<User> {
        return this.user;
    }

    async getById(userId: string) {
        const docRef = doc(this.db, 'users', userId);
        const docSnap = await getDoc(docRef);
        let user: User;

        if (docSnap.exists()) {
            const id = docSnap.id;
            const {
                firstName,
                lastName,
                email,
                profilePicture,
                dateCreation,
            } = docSnap.data();

            user = new User(
                id,
                firstName,
                lastName,
                email,
                profilePicture,
                dateCreation,
            );
        } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
        }

        return user;
    }

    signIn(email: string, password: string) {
        signInWithEmailAndPassword(this.auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;

                // Get user data
                const docRef = doc(this.db, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    //  Set data
                    const id = docSnap.id;
                    const firstName = docSnap.data()?.firstName;
                    const lastName = docSnap.data()?.lastName;
                    const email = docSnap.data()?.email;
                    const profilePicture = docSnap.data()?.profilePicture;
                    const dateCreation = docSnap.data()?.dateCreation;

                    this.user = new User(
                        id,
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
                    if (url != '/sign-in') {
                        await this.router.navigate([url]);
                    } else {
                        await this.router.navigate(['/home']);
                    }
                }
            })
            .catch((error) => {
                console.error(error);
                this.firebaseError = error.message;
            });
        return this.firebaseError;
    };

    signUp(
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) {
        createUserWithEmailAndPassword(this.auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;

                await setDoc(doc(this.db, 'users', user.uid), {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    dateCreation: new Date(),
                })
                    .then(() => {
                        // Clear error
                        this.firebaseError = '';

                        this.router.navigate(['/sign-in']);
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
    }

    googleSignUp() {
        signInWithPopup(this.auth, this.provider)
            .then(async (result) => {
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;

                // Get data from Google account
                const firstName = result.user?.displayName?.split(' ')[0];
                const lastName = result.user?.displayName?.split(' ')[1];
                const email = result.user?.email;
                const profilePicture = result.user?.photoURL;

                // Set users data
                this.user = new User(
                    user.uid,
                    firstName,
                    lastName,
                    email,
                    profilePicture,
                    new Date(),
                );

                await setDoc(doc(this.db, 'users', user.uid), {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    dateCreation: new Date(),
                    profilePicture: profilePicture
                })
                    .then(() => {
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
    }

    facebookSignUp() {
        
    }

    githubSignUp() {
        // signInWithPopup(this.auth, this.providerGithub)
        //     .then(async (result) => {
        //         const credential =
        //             GithubAuthProvider.credentialFromResult(result);
        //         const token = credential.accessToken;
        //         const user = result.user
        //     });
    }


    resetPassword(emailAddress: string) {
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
    }


    async updateProfile(firstName: string, lastName: string) {
        const userId = this.user.id;
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
    }

    updateEmail = (email: string) => {
        const userId = this.user.id;
        const userRef = doc(this.db, 'users', userId);

        updateEmail(this.auth.currentUser, email)
            .then(async () => {
                await updateDoc(userRef, {
                    email: email,
                }).then(() => {
                    // Disconnect
                    this.signOut();

                    // Display message
                    Toast.success('Your email has been successfully updated');
                });
            })
            .catch((error) => {
                console.error(error);
                Toast.error(error.message);
            });
    };


    updatePassword(newPassword: string) {
        const user = this.auth.currentUser;

        updatePassword(user, newPassword)
            .then(() => {
                Toast.success('Password has been successfully updated');
            })
            .catch((error) => {
                console.error(error);
                Toast.error('Error in updating password', error.message);
            });
    }

    signOut() {
        signOut(this.auth)
            .then(() => {
                this.user = null;

                // Delete local storage
                localStorage.removeItem('password');

                // Navigate to home
                this.router.navigate(['/sign-in']);
            })
            .catch((error) => {
                console.error(error);
                Toast.error('Error while disconnecting ', error.message);
            });
    }

    async deleteAccount() {
        const user = this.auth.currentUser;
        const userId = this.auth.currentUser.uid;

        // Delete data user
        await deleteDoc(doc(this.db, 'users', userId))
            .then(() => {
                // Delete user
                deleteUser(user)
                    .then(async () => {
                        Toast.success('Your account has been successfully deleted');

                        this.router.navigate(['/sign-up']);
                    })
                    .catch((error) => {
                        console.error(error);
                        Toast.error('Error while deleting your account', error.message);
                    });
            })
            .catch((error) => {
                console.error(error);
                Toast.error('Error deleting your data', error.message);
            });
    }
}
