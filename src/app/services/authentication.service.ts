import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { first } from 'rxjs/operators';

import { User, Coords } from '../models';

@Injectable()
export class AuthService {

    user: User;
    loader: any;

    constructor(private afAuth: AngularFireAuth,
        private db: AngularFirestore,
        public loadingCtrl: LoadingController) { }

    async getLoggedInUser(): Promise<User> {
        await this.showLoader();
        const user = await this.afAuth.authState.pipe(first()).toPromise();
        this.loader.dismiss();
        return user;
    }

    emailSignUp(email: string, password: string, displayName: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then((credentials) => {
                const data: User = {
                    email: credentials.user.email,
                    displayName: displayName,
                    uid: credentials.user.uid
                }
                return this.createUserData(data).then(() => {
                    this.afAuth.auth.currentUser.updateProfile({ displayName: displayName, photoURL: "" });
                });
            })
    }

    emailSignIn(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then((credentials) => {
                this.updateUserData(credentials.user)
            })
    }

    signOut() {
        return this.afAuth.auth.signOut().then(() => {

        });
    }

    private createUserData(data: User) {
        return this.db.collection<Event>('users').doc(data.uid).set(data);
    }

    private async updateUserData(user: User) {
        const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`);
        const userCoords = await this.getUserLastCoords(user.uid);
        const data: User = {
            email: user.email,
            displayName: user.displayName,
            uid: user.uid,
            photoURL: user.photoURL,
            coords: userCoords
        }

        return userRef.set(data);
    }

    private async getUserLastCoords(userId: String): Promise<Coords> {
        const user = await this.db.doc<User>(`users/${userId}`).valueChanges().toPromise();
        return user ? user.coords : null;
    }

    private async showLoader() {
        this.loader = await this.loadingCtrl.create({
            message: "Loading...",
        });
        this.loader.present();
    }

}