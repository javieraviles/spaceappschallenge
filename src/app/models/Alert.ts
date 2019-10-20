export interface Alert {
    id: string;
    coords: any;
    type: string;
    radius: number;
    userId: string;
    hazard?: string;
    timestamp: Date;
    gender?: string;
    age?: number;
}
