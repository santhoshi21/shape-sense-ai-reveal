
import { CheckCircle, Circle, Copy, Download, User, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface AnalysisResult {
  bodyShape: string;
  faceShape: string;
  confidence: {
    body: number;
    face: number;
  };
  measurements: {
    shoulderWidth: number;
    waistWidth: number;
    hipWidth: number;
  };
  faceMeasurements: {
    faceWidth: number;
    faceHeight: number;
    jawlineWidth: number;
  };
  ratios: {
    shoulderToWaist: number;
    waistToHip: number;
    shoulderToHip: number;
  };
  landmarks: any;
  timestamp: string;
}

interface ResultsDisplayProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export const ResultsDisplay = ({ result, isAnalyzing }: ResultsDisplayProps) => {
  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      toast.success('Results copied to clipboard!');
    }
  };

  const downloadJSON = () => {
    if (result) {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `body-face-analysis-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Analysis downloaded!');
    }
  };

  if (isAnalyzing) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Scan className="h-8 w-8 text-blue-600 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Advanced AI Analysis in Progress...</h3>
        <p className="text-gray-600 text-sm">MediaPipe-style pose detection & face analysis</p>
        <div className="mt-4 space-y-2">
          {[
            'Applying Gaussian blur & noise reduction...',
            'Detecting pose landmarks with MediaPipe...',
            'Calculating anthropometric measurements...',
            'Analyzing facial geometry & proportions...',
            'Classifying body & face shapes with ML...',
            'Generating confidence scores & JSON output...'
          ].map((step, index) => (
            <div key={index} className="flex items-center justify-center text-sm text-gray-500">
              <div className="animate-pulse mr-2">
                <Circle className="h-3 w-3" />
              </div>
              {step}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12 text-gray-500">
        <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">No analysis results yet</p>
        <p className="text-sm">Upload an image for AI-powered body & face analysis</p>
      </div>
    );
  }

  const getShapeColor = (shape: string) => {
    const colors = {
      'Hourglass': 'bg-pink-100 text-pink-800',
      'Pear': 'bg-green-100 text-green-800',
      'Apple': 'bg-red-100 text-red-800',
      'Rectangle': 'bg-blue-100 text-blue-800',
      'Inverted Triangle': 'bg-purple-100 text-purple-800',
      'Athlete': 'bg-orange-100 text-orange-800',
      'Oval': 'bg-emerald-100 text-emerald-800',
      'Round': 'bg-amber-100 text-amber-800',
      'Square': 'bg-slate-100 text-slate-800',
      'Heart': 'bg-rose-100 text-rose-800',
      'Diamond': 'bg-violet-100 text-violet-800',
      'Oblong': 'bg-cyan-100 text-cyan-800',
    };
    return colors[shape as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Dual Analysis Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <h4 className="font-semibold mb-2">Body Shape</h4>
          <Badge className={`text-sm px-3 py-1 ${getShapeColor(result.bodyShape)}`}>
            {result.bodyShape}
          </Badge>
          <p className="text-xs text-gray-600 mt-1">
            Confidence: {(result.confidence.body * 100).toFixed(1)}%
          </p>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <h4 className="font-semibold mb-2">Face Shape</h4>
          <Badge className={`text-sm px-3 py-1 ${getShapeColor(result.faceShape)}`}>
            {result.faceShape}
          </Badge>
          <p className="text-xs text-gray-600 mt-1">
            Confidence: {(result.confidence.face * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <Separator />

      {/* Body Measurements */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <User className="h-4 w-4" />
          Body Measurements (MediaPipe Detection)
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(result.measurements).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <span className="capitalize font-medium">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-blue-600 font-semibold">{value.toFixed(1)}px</span>
            </div>
          ))}
        </div>
      </div>

      {/* Face Measurements */}
      <div>
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Scan className="h-4 w-4" />
          Facial Measurements (Advanced Geometry)
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(result.faceMeasurements).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <span className="capitalize font-medium">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-purple-600 font-semibold">{value.toFixed(1)}px</span>
            </div>
          ))}
        </div>
      </div>

      {/* Body Ratios */}
      <div>
        <h4 className="font-semibold mb-3">Anthropometric Ratios</h4>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(result.ratios).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="capitalize font-medium">
                {key.replace(/([A-Z])/g, ' $1').replace('To', ' to ').trim()}
              </span>
              <span className="text-indigo-600 font-semibold">{value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          onClick={copyToClipboard}
          variant="outline"
          className="flex-1"
          size="sm"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy JSON
        </Button>
        <Button 
          onClick={downloadJSON}
          variant="outline"
          className="flex-1"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Enhanced JSON Preview */}
      <div>
        <h4 className="font-semibold mb-2">Complete Analysis JSON</h4>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-64">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>

      <div className="text-xs text-gray-500 text-center bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
        <strong>Tech Stack:</strong> React + TypeScript + Advanced Computer Vision<br/>
        <strong>Algorithms:</strong> MediaPipe-style Pose Detection, Gaussian Blur, Sobel Edge Detection<br/>
        Analysis completed at {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>
  );
};
