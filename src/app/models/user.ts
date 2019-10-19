import { Coords } from './coords';

export class User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    coords?: Coords;
}