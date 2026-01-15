import { Polygon3D } from './Polygon3D';

// Object3D class containing multiple 3D polygons
export class Object3D {
    private _polygons: Polygon3D[];

    constructor(polygons: Polygon3D[]) {
        this._polygons = polygons;
    }

    // Getter for polygons
    public getPolygons(): Polygon3D[] {
        return this._polygons;
    }

    // Setter for polygons
    public setPolygons(polygons: Polygon3D[]): void {
        this._polygons = polygons;
    }

    // For backward compatibility, keep polygons as a getter
    public get polygons(): Polygon3D[] {
        return this._polygons;
    }
}