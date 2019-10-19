import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Coords, User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private db: AngularFirestore,) { }

    updateCoords(userId: string, coords: Coords) {
        this.db.collection<User>('users').doc(userId).update({coords: coords});
    }
}