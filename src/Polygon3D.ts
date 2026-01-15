import { Point3D } from './Point3D';

// Polygon3D class containing 3D points and vertex connections
export class Polygon3D {
    public color: string;
    private _points: Point3D[];
    public vertices: [number, number][]; // Array of pairs representing edges between points

    constructor(color: string, points: Point3D[], vertices: [number, number][]) {
        this.color = color;
        this._points = points;
        this.vertices = vertices;
    }

    // Getter for points
    public getPoints(): Point3D[] {
        return this._points;
    }

    // Setter for points
    public setPoints(points: Point3D[]): void {
        this._points = points;
    }

    // For backward compatibility, keep points as a getter
    public get points(): Point3D[] {
        return this._points;
    }
}