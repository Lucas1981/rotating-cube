import { Point3D } from "./Point3D";
import { Point2D } from "./Point2D";
import { Polygon3D } from "./Polygon3D";
import { Polygon2D } from "./Polygon2D";
import { Object3D } from "./Object3D";
import {
  HALF_SCREEN_WIDTH,
  HALF_SCREEN_HEIGHT,
  FOCAL_LENGTH,
} from "./constants";

// Interface for JSON 3D polygon data
interface Polygon3DData {
  color: string;
  points: { x: number; y: number; z: number }[];
  vertices: number[][]; // JSON arrays are number[][], not tuples
}

// Function to create a 3D polygon from JSON data (compile-time loading)
export function create3DPolygonFromJSONData(
  jsonData: Polygon3DData
): Polygon3D {
  // Convert plain objects to Point3D instances
  const points = jsonData.points.map(
    (point) => new Point3D(point.x, point.y, point.z)
  );

  // Convert number[][] to [number, number][] with validation
  const vertices: [number, number][] = jsonData.vertices.map((vertex) => {
    if (vertex.length !== 2) {
      throw new Error(
        `Invalid vertex: expected 2 elements, got ${vertex.length}`
      );
    }
    return [vertex[0], vertex[1]];
  });

  return new Polygon3D(jsonData.color, points, vertices);
}

// Function to create a 3D object from JSON data array (compile-time loading)
export function create3DObjectFromJSONData(
  jsonDataArray: Polygon3DData[]
): Object3D {
  // Convert each JSON polygon to Polygon3D
  const polygons = jsonDataArray.map((polygonData) =>
    create3DPolygonFromJSONData(polygonData)
  );

  return new Object3D(polygons);
}

// Simple orthographic projection from 3D to 2D
export function project3DPointOrthographic(point3D: Point3D): Point2D {
  // Simple orthographic projection with scaling and centering
  // For now, we ignore Z and scale/center X and Y to screen coordinates
  const scale = 200; // Scale factor to make the object visible

  // Project 3D point to 2D screen coordinates
  const screenX = HALF_SCREEN_WIDTH + point3D.x * scale;
  const screenY = HALF_SCREEN_HEIGHT - point3D.y * scale; // Flip Y axis (canvas Y goes down)

  return new Point2D(screenX, screenY);
}

// Perspective projection from 3D to 2D
export function project3DPoint(point3D: Point3D): Point2D {
  // Perspective projection parameters
  const cameraDistance = 5; // Distance from camera to origin
  const scale = 200; // Base scale factor

  // Apply camera distance (move camera back along z-axis)
  const adjustedZ = point3D.z + cameraDistance;

  // Prevent division by zero or negative z (behind camera)
  const safeZ = Math.max(adjustedZ, 0.1);

  // Perspective division using pre-calculated focal length
  const perspectiveFactor = FOCAL_LENGTH / safeZ;
  const projectedX = point3D.x * perspectiveFactor;
  const projectedY = point3D.y * perspectiveFactor;

  // Scale and center to screen coordinates using pre-calculated centers
  const screenX = HALF_SCREEN_WIDTH + projectedX * scale;
  const screenY = HALF_SCREEN_HEIGHT - projectedY * scale; // Flip Y axis (canvas Y goes down)

  return new Point2D(screenX, screenY);
}

// Convert a 3D polygon to a 2D polygon by projecting all points
export function convert3DPolygonTo2DPolygon(polygon3D: Polygon3D): Polygon2D {
  // Project all 3D points to 2D
  const projectedPoints = polygon3D
    .getPoints()
    .map((point) => project3DPoint(point));

  // Return new 2D polygon with projected points and same vertices/color
  return new Polygon2D(polygon3D.color, projectedPoints, polygon3D.vertices);
}

// Function to rotate a 3D object around the Y-axis
export function rotate3DObjectY(
  object3D: Object3D,
  angleInDegrees: number
): void {
  // Convert degrees to radians
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  const cosAngle = Math.cos(angleInRadians);
  const sinAngle = Math.sin(angleInRadians);

  // Rotate each polygon in the object
  for (const polygon of object3D.getPolygons()) {
    const rotatedPoints = polygon.getPoints().map((point) => {
      // Y-axis rotation matrix:
      // x' = x * cos(θ) + z * sin(θ)
      // y' = y (unchanged)
      // z' = -x * sin(θ) + z * cos(θ)
      const newX = point.x * cosAngle + point.z * sinAngle;
      const newY = point.y; // Y remains unchanged for Y-axis rotation
      const newZ = -point.x * sinAngle + point.z * cosAngle;

      return new Point3D(newX, newY, newZ);
    });

    // Set the rotated points back to the polygon
    polygon.setPoints(rotatedPoints);
  }
}

// Function to draw a 3D object by projecting and rendering all polygons
export function draw3DObject(
  ctx: CanvasRenderingContext2D,
  object3D: Object3D
): void {
  // Import draw2DPolygon here to avoid circular dependencies
  const { draw2DPolygon } = require("./2d-utils");

  // Iterate through all polygons in the object
  for (const polygon3D of object3D.getPolygons()) {
    // Project the 3D polygon to 2D
    const polygon2D = convert3DPolygonTo2DPolygon(polygon3D);

    // Draw the projected polygon
    draw2DPolygon(ctx, polygon2D);
  }
}
