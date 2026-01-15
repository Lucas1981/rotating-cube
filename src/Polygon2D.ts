import { Point2D } from './Point2D';

// Polygon2D class containing points and vertex connections
export class Polygon2D {
    public color: string;
    public points: Point2D[];
    public vertices: [number, number][]; // Array of pairs representing edges between points

    constructor(color: string, points: Point2D[], vertices: [number, number][]) {
        this.color = color;
        this.points = points;
        this.vertices = vertices;
    }
}