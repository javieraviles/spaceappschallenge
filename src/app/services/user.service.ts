import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { GeoFireClient, GeoFirePoint } from 'geofirex';
import * as geofirex from 'geofirex';
import { Coords, User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
    geo: GeoFireClient;

    constructor(private db: AngularFirestore) {
        this.geo = geofirex.init(firebase);
    }

    updateCoords(userId: string, coords: Coords) {
        const geoPoint: GeoFirePoint = this.geo.point(coords.latitude, coords.longitude);
        this.db.collection<User>('users').doc(userId).update({ coords: geoPoint.data });
    }
}