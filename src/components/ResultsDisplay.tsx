
import { CheckCircle, Circle, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface AnalysisResult {
  bodyShape: string;
  confidence: number;
  measurements: {
    shoulderWidth: number;
    waistWidth: number;
    hipWidth: number;
  };
  ratios: {
    shoulderToWaist: number;
    waistToHip: number;
    shoulderToHip: number;
  };
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
      a.download = `body-shape-analysis-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('JSON file downloaded!');
    }
  };

  if (isAnalyzing) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Analyzing Body Shape...</h3>
        <p className="text-gray-600 text-sm">Processing image with AI algorithms</p>
        <div className="mt-4 space-y-2">
          {[
            'Detecting body contours...',
            'Calculating measurements...',
            'Classifying shape pattern...',
            'Generating confidence scores...'
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
        <Circle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">No analysis results yet</p>
        <p className="text-sm">Upload an image to get started</p>
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
    };
    return colors[shape as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Main Result */}
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-2xl font-bold mb-2">Analysis Complete</h3>
        <Badge className={`text-lg px-4 py-2 ${getShapeColor(result.bodyShape)}`}>
          {result.bodyShape}
        </Badge>
        <p className="text-sm text-gray-600 mt-2">
          Confidence: {(result.confidence * 100).toFixed(1)}%
        </p>
      </div>

      <Separator />

      {/* Measurements */}
      <div>
        <h4 className="font-semibold mb-3">Body Measurements</h4>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(result.measurements).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="capitalize font-medium">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-blue-600 font-semibold">{value.toFixed(1)}px</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ratios */}
      <div>
        <h4 className="font-semibold mb-3">Body Ratios</h4>
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

      {/* JSON Preview */}
      <div>
        <h4 className="font-semibold mb-2">JSON Output</h4>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Analysis completed at {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>
  );
};
