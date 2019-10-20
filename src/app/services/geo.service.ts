import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as geofirex from 'geofirex';
import {GeoFireClient, GeoFirePoint, GeoQueryDocument} from 'geofirex';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import {Alert, Coords} from '../models';

@Injectable({
    providedIn: 'root'
})
export class GeoService {

    geo: GeoFireClient;

    constructor(private db: AngularFirestore) {
        this.geo = geofirex.init(firebase);
    }

    async pushSingleAlert(id: string, coords: Coords, userId: string): Promise<string> {
        return new Promise<string>(async resolve => {
            const alerts = this.geo.collection('alerts');

            let point;
            if (coords) {
                point = this.geo.point(coords.latitude, coords.longitude).data;
            } else {
                point = null;
            }

            if (id) {
                await alerts.setDoc(id, {coords: point, radius: 100, type: 'SINGLE', userId: userId});
                resolve(id);
            } else {
                const doc = await alerts.add({coords: point, radius: 100, type: 'SINGLE', userId: userId});
                resolve(doc.id);
            }
        });
    }

    pushAreaAlert(coords: Coords, rad: number, hazardType: string, user: string) {
        const alerts = this.geo.collection('alerts');
        const point = this.geo.point(coords.latitude, coords.longitude).data;
        alerts.add({coords: point, radius: rad, type: 'AREA', hazard: hazardType, userId: user, timestamp: new Date()});
    }

    getAlerts(coords: Coords, radius: number): Observable<GeoQueryDocument[]> {
        const geoPoint = this.geo.point(coords.latitude, coords.longitude);
        return this.geo.collection('alerts').within(geoPoint, radius, 'coords');
    }

    getUserSingleAlert(userId: string) {
        return this.db.collection<Alert>('alerts', ref => ref.where('userId', '==', userId)).valueChanges();
    }

    deleteAlert(alertId: string) {
        return this.db.doc<Alert>(`alerts/${alertId}`).delete();
    }

    getDistance(pointA: Coords, pointB: Coords): number {
        return GeoFirePoint.distance([pointA.latitude, pointA.longitude], [pointB.latitude, pointB.longitude]);
    }
}
