import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/class/user';
import {
    createUserWithEmailAndPassword,
    deleteUser,
    FacebookAuthProvider,
    getAuth,
    GithubAuthProvider,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateEmail,
    updatePassword
} from 'firebase/auth';
import { deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc, } from 'firebase/firestore';
import { CryptoService } from '../crypto/crypto.service';
import { Toast } from '../../class/toast';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    user: User;
    db = getFirestore();
    auth = getAuth();

    constructor(
        private router: Router,
        private cryptoService: CryptoService,
    ) {
    }

    getUser() {
        return this.user;
    }

    async getAuth(): Promise<User> {
        return this.user;
    }

    signIn(email: string, password: string) {
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(this.auth, email, password)
                .then(async (userCredential) => {
                    // Signed in
                    const user = userCredential.user;

                    // Get user data
                    const docRef = doc(this.db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);

                    //  Set data
                    const id = docSnap.id;
                    const {
                        firstName,
                        lastName,
                        email,
                        profilePicture,
                        dateCreation,
                    } = docSnap.data();

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

                    // Return user
                    resolve(this.user);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    signUp(
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) {
        return new Promise((resolve, reject) => {
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
                            resolve(user);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    signInWithPopup(type: string) {
        return new Promise((resolve, reject) => {
            // Get provider
            let provider;
            switch (type) {
                case'google':
                    provider = new GoogleAuthProvider();
                    break;
                case'facebook':
                    provider = new FacebookAuthProvider();
                    break;
                case 'github':
                    provider = new GithubAuthProvider();
                    break;
            }

            // Sign in
            signInWithPopup(this.auth, provider)
                .then(async (result) => {
                    const user = result.user;

                    // Get data from account
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

                    // Save user in firestore
                    await setDoc(doc(this.db, 'users', user.uid), {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        dateCreation: new Date(),
                        profilePicture: profilePicture
                    })
                        .then(() => {
                            resolve(user);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
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

    updateEmail(email: string) {
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
    }

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
            .then(async () => {
                this.user = null;

                // Delete local storage
                localStorage.removeItem('password');

                // Navigate to home
                await this.router.navigate(['/sign-in']);
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
            .then(async () => {
                // Delete user
                deleteUser(user)
                    .then(async () => {
                        Toast.success('Your account has been successfully deleted');

                        // Clear local storage
                        localStorage.clear();

                        // Sign-out
                        await this.signOut();
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
