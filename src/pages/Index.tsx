import { useState } from 'react';
import { Upload, Camera, FileImage, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploader } from '@/components/ImageUploader';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { LandmarkVisualizer } from '@/components/LandmarkVisualizer';
import { analyzeBodyShape } from '@/utils/bodyShapeAnalyzer';

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

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageSelect = (file: File | null) => {
    if (!file) {
      // Clear all states when removing image
      setSelectedImage(null);
      setImagePreview(null);
      setAnalysisResult(null);
      return;
    }

    setSelectedImage(file);
    setAnalysisResult(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !imagePreview) return;

    setIsAnalyzing(true);
    
    try {
      const img = new Image();
      img.onload = async () => {
        const result = await analyzeBodyShape(img);
        setAnalysisResult(result);
        setIsAnalyzing(false);
      };
      img.src = imagePreview;
    } catch (error) {
      console.error('Advanced analysis failed:', error);
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Advanced AI Body & Face Shape Detector
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            MediaPipe-style pose detection with advanced computer vision for accurate body and face shape analysis
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Upload Section */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Image Upload & Analysis
                </CardTitle>
                <CardDescription>
                  Upload for MediaPipe-style landmark detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  imagePreview={imagePreview}
                />
                
                {selectedImage && !analysisResult && (
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Advanced AI Analysis...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Analyze Body & Face Shape
                      </>
                    )}
                  </Button>
                )}

                {analysisResult && (
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <FileImage className="h-4 w-4 mr-2" />
                    Analyze New Image
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Landmark Visualization */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>MediaPipe-Style Landmarks</CardTitle>
                <CardDescription>
                  Real-time pose detection and measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LandmarkVisualizer
                  imagePreview={imagePreview}
                  landmarks={analysisResult?.landmarks || null}
                  measurements={analysisResult?.measurements || null}
                />
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>AI Analysis Results</CardTitle>
                <CardDescription>
                  Body & face shape classification with confidence scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResultsDisplay
                  result={analysisResult}
                  isAnalyzing={isAnalyzing}
                />
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Shape Guides */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Body Shape Guide */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Body Shape Classifications</CardTitle>
                <CardDescription>
                  Enhanced with Athlete category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { shape: 'Hourglass', description: 'Balanced shoulders and hips with defined waist' },
                    { shape: 'Pear', description: 'Hips wider than shoulders, defined waist' },
                    { shape: 'Apple', description: 'Fuller midsection, narrower hips' },
                    { shape: 'Rectangle', description: 'Similar measurements throughout' },
                    { shape: 'Inverted Triangle', description: 'Broader shoulders than hips' },
                    { shape: 'Athlete', description: 'High muscle mass, defined physique' },
                  ].map((item) => (
                    <div key={item.shape} className="text-center p-4 rounded-lg bg-gradient-to-b from-blue-50 to-indigo-50">
                      <h3 className="font-semibold text-blue-900 mb-2">{item.shape}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Face Shape Guide */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Face Shape Classifications</CardTitle>
                <CardDescription>
                  Advanced facial geometry analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { shape: 'Oval', description: 'Balanced and versatile, slightly longer than wide' },
                    { shape: 'Round', description: 'Fullness around cheekbones, similar length and width' },
                    { shape: 'Square', description: 'Strong jawline and forehead, roughly equal proportions' },
                    { shape: 'Heart', description: 'Wide forehead and cheekbones, narrow chin' },
                    { shape: 'Diamond', description: 'Narrow forehead and jawline, wide cheekbones' },
                    { shape: 'Oblong', description: 'Face longer than wide, elongated shape' },
                  ].map((item) => (
                    <div key={item.shape} className="text-center p-4 rounded-lg bg-gradient-to-b from-purple-50 to-pink-50">
                      <h3 className="font-semibold text-purple-900 mb-2">{item.shape}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
