import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as geofirex from 'geofirex';
import {GeoFireClient, GeoFirePoint, GeoQueryDocument} from 'geofirex';
import * as firebase from 'firebase/app';
import {Coords} from '../models/coords';

@Injectable({
    providedIn: 'root'
})
export class GeoService {

    geo: GeoFireClient;

    constructor() {
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

    pushAreaAlert(coords: Coords, rad: number, userId: string) {
        const alerts = this.geo.collection('alerts');
        const point = this.geo.point(coords.latitude, coords.longitude).data;
        alerts.add({coords: point, radius: rad, type: 'AREA', userId: userId});
    }

    getAlerts(coords: Coords, radius: number): Observable<GeoQueryDocument[]> {
        const geoPoint = this.geo.point(coords.latitude, coords.longitude);
        return this.geo.collection('alerts').within(geoPoint, radius, 'coords');
    }

    getDistance(pointA: Coords, pointB: Coords): number {
        return GeoFirePoint.distance([pointA.latitude, pointA.longitude], [pointB.latitude, pointB.longitude]);
    }
}
