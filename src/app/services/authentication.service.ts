import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { GeoFirePoint } from 'geofirex';
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

    emailSignUp(email: string, password: string, displayName: string, gender: string, birth: number) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then((credentials) => {
                const data: User = {
                    email: credentials.user.email,
                    displayName: displayName,
                    uid: credentials.user.uid,
                    notification: null,
                    gender: gender,
                    birth: birth
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
        const userLastStatus = await this.getUserLastStatus(user.uid);
        const data: User = {
            email: user.email,
            displayName: user.displayName,
            uid: user.uid,  
            photoURL: user.photoURL,
            coords: userLastStatus.coords,
            notification: userLastStatus.notification,
            gender: userLastStatus.gender,
            birth: userLastStatus.birth
        }

        return userRef.set(data);
    }

    private async getUserLastStatus(userId: String): Promise<User> {
        return await this.db.doc<User>(`users/${userId}`).valueChanges().toPromise();
    }

    private async showLoader() {
        this.loader = await this.loadingCtrl.create({
            message: "Loading..."
        });
        this.loader.present();
    }

}