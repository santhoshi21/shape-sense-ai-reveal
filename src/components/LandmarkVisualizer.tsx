
import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  confidence: number;
}

interface PoseLandmarks {
  shoulders: { left: Point; right: Point };
  waist: { left: Point; right: Point };
  hips: { left: Point; right: Point };
  face: { top: Point; bottom: Point; left: Point; right: Point };
}

interface LandmarkVisualizerProps {
  imagePreview: string;
  landmarks: PoseLandmarks | null;
  measurements: {
    shoulderWidth: number;
    waistWidth: number;
    hipWidth: number;
  } | null;
}

export const LandmarkVisualizer = ({ imagePreview, landmarks, measurements }: LandmarkVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imagePreview || !landmarks || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    const img = new Image();
    img.onload = () => {
      // Set canvas size to match container
      const containerWidth = canvas.parentElement?.clientWidth || 400;
      const aspectRatio = img.height / img.width;
      canvas.width = containerWidth;
      canvas.height = containerWidth * aspectRatio;
      
      // Draw the image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Calculate scale factors
      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      
      // Draw MediaPipe-style landmarks
      drawLandmarks(ctx, landmarks, scaleX, scaleY);
      drawMeasurementLines(ctx, landmarks, measurements, scaleX, scaleY);
    };
    img.src = imagePreview;
  }, [imagePreview, landmarks, measurements]);

  const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: PoseLandmarks, scaleX: number, scaleY: number) => {
    // MediaPipe-style landmark colors
    const colors = {
      shoulder: '#00FF00',
      waist: '#FF6600',
      hip: '#FF0066',
      face: '#00CCFF'
    };

    // Draw landmark points
    const drawPoint = (point: Point, color: string, label: string) => {
      const x = point.x * scaleX;
      const y = point.y * scaleY;
      const confidence = point.confidence;
      
      // Point circle
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.globalAlpha = confidence;
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Point border
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Confidence indicator
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px Arial';
      ctx.fillText(`${(confidence * 100).toFixed(0)}%`, x + 10, y - 10);
    };

    // Draw all landmarks
    drawPoint(landmarks.shoulders.left, colors.shoulder, 'L_SHOULDER');
    drawPoint(landmarks.shoulders.right, colors.shoulder, 'R_SHOULDER');
    drawPoint(landmarks.waist.left, colors.waist, 'L_WAIST');
    drawPoint(landmarks.waist.right, colors.waist, 'R_WAIST');
    drawPoint(landmarks.hips.left, colors.hip, 'L_HIP');
    drawPoint(landmarks.hips.right, colors.hip, 'R_HIP');
    drawPoint(landmarks.face.top, colors.face, 'FACE_TOP');
    drawPoint(landmarks.face.bottom, colors.face, 'FACE_BOTTOM');
    drawPoint(landmarks.face.left, colors.face, 'FACE_LEFT');
    drawPoint(landmarks.face.right, colors.face, 'FACE_RIGHT');
  };

  const drawMeasurementLines = (ctx: CanvasRenderingContext2D, landmarks: PoseLandmarks, measurements: any, scaleX: number, scaleY: number) => {
    if (!measurements) return;

    const drawMeasurementLine = (point1: Point, point2: Point, measurement: number, color: string, label: string) => {
      const x1 = point1.x * scaleX;
      const y1 = point1.y * scaleY;
      const x2 = point2.x * scaleX;
      const y2 = point2.y * scaleY;
      
      // Draw measurement line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw measurement text
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(midX - 30, midY - 15, 60, 20);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(midX - 30, midY - 15, 60, 20);
      
      ctx.fillStyle = color;
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${measurement.toFixed(0)}px`, midX, midY + 3);
    };

    // Draw measurement lines
    drawMeasurementLine(landmarks.shoulders.left, landmarks.shoulders.right, measurements.shoulderWidth, '#00FF00', 'Shoulders');
    drawMeasurementLine(landmarks.waist.left, landmarks.waist.right, measurements.waistWidth, '#FF6600', 'Waist');
    drawMeasurementLine(landmarks.hips.left, landmarks.hips.right, measurements.hipWidth, '#FF0066', 'Hips');
  };

  if (!imagePreview) {
    return (
      <div className="aspect-[3/4] max-h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Upload an image to see landmark detection</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border-2 border-gray-200 max-h-96 object-contain"
      />
      <div className="absolute top-2 left-2 bg-black/70 text-white p-2 rounded text-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Shoulders</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Waist</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <span>Hips</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
          <span>Face</span>
        </div>
      </div>
    </div>
  );
};
