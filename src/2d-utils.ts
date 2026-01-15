import { Point2D } from './Point2D';
import { Polygon2D } from './Polygon2D';

// Interface for JSON polygon data
interface PolygonData {
    color: string;
    points: { x: number; y: number }[];
    vertices: number[][]; // JSON arrays are number[][], not tuples
}

// Function to draw a 2D polygon as wireframe
export function draw2DPolygon(ctx: CanvasRenderingContext2D, polygon: Polygon2D): void {
    ctx.strokeStyle = polygon.color;
    ctx.lineWidth = 2;

    // Draw each edge defined in the vertices array
    for (const [startIndex, endIndex] of polygon.vertices) {
        const startPoint = polygon.points[startIndex];
        const endPoint = polygon.points[endIndex];

        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
    }
}

// Function to create a 2D polygon from JSON data (compile-time loading)
export function create2DPolygonFromJSONData(jsonData: PolygonData): Polygon2D {
    // Convert plain objects to Point2D instances
    const points = jsonData.points.map(point => new Point2D(point.x, point.y));
    
    // Convert number[][] to [number, number][] with validation
    const vertices: [number, number][] = jsonData.vertices.map(vertex => {
        if (vertex.length !== 2) {
            throw new Error(`Invalid vertex: expected 2 elements, got ${vertex.length}`);
        }
        return [vertex[0], vertex[1]];
    });
    
    return new Polygon2D(jsonData.color, points, vertices);
}

// Function to load a 2D polygon from a JSON file (runtime loading)
export async function load2DPolygonFromFile(filename: string): Promise<Polygon2D> {
    try {
        const response = await fetch(`./assets/${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to load file: ${filename} (${response.status})`);
        }
        
        const data: PolygonData = await response.json();
        
        return create2DPolygonFromJSONData(data);
    } catch (error) {
        console.error(`Error loading polygon from ${filename}:`, error);
        throw error;
    }
}