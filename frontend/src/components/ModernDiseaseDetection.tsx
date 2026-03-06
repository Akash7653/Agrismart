import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Upload, AlertTriangle, CheckCircle, Info, Phone, 
  Shield, Bug, Droplets, Sun, Wind, Zap, Loader2, 
  ArrowRight, X, Leaf, Search, Microscope
} from 'lucide-react';
import { useTranslation } from '../utils/translations';

interface DetectionResult {
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  causes: string[];
  treatments: string[];
  prevention: string[];
  affectedArea: number;
  id?: string;
}

interface DiseaseDetectionProps {
  currentLanguage: string;
}

const ModernDiseaseDetection: React.FC<DiseaseDetectionProps> = ({ currentLanguage }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const { t } = useTranslation(currentLanguage);

  const commonDiseases = [
    { name: 'Leaf Blight', icon: Bug, color: 'red' },
    { name: 'Powdery Mildew', icon: Wind, color: 'yellow' },
    { name: 'Root Rot', icon: Droplets, color: 'blue' },
    { name: 'Sun Scald', icon: Sun, color: 'orange' }
  ];

  useEffect(() => {
    if (!detectionResult || !detectionResult.id) return;
    const id = detectionResult.id;
    const name = t(`diseases.${id}.name`);
    const desc = t(`diseases.${id}.description`);
    setDetectionResult(prev => prev ? { ...prev, disease: name, description: desc } : prev);
  }, [currentLanguage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDetectionResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setIsVideoReady(true);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraOpen(false);
      setIsVideoReady(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageData);
        setDetectionResult(null);
        stopCamera();
      }
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResult: DetectionResult = {
      id: 'leaf_blight',
      disease: 'Leaf Blight',
      confidence: 92,
      severity: 'High',
      description: 'A fungal disease affecting leaves, causing yellowing and browning of leaf margins.',
      causes: [
        'High humidity and warm temperatures',
        'Poor air circulation',
        'Overhead irrigation'
      ],
      treatments: [
        'Apply fungicide spray (copper-based)',
        'Remove infected leaves immediately',
        'Improve air circulation',
        'Reduce overhead watering'
      ],
      prevention: [
        'Ensure proper plant spacing',
        'Water at base of plants',
        'Monitor humidity levels',
        'Use resistant varieties'
      ],
      affectedArea: 35
    };
    
    setDetectionResult(mockResult);
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderUploadArea = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Microscope className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Disease Detection</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload or capture a photo of your crop for instant AI-powered disease identification and treatment recommendations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-red-400 transition-colors">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Image</h3>
          <p className="text-gray-600 mb-4">Choose a photo from your device</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Choose File</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-red-400 transition-colors">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Take Photo</h3>
          <p className="text-gray-600 mb-4">Capture a new image with your camera</p>
          <button
            onClick={startCamera}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Camera className="w-4 h-4" />
            <span>Open Camera</span>
          </button>
        </div>
      </div>

      {/* Common Diseases Reference */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2 text-red-600" />
          Common Crop Diseases
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {commonDiseases.map((disease, index) => {
            const Icon = disease.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
                <div className={`w-12 h-12 bg-${disease.color}-100 rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`w-6 h-6 text-${disease.color}-600`} />
                </div>
                <p className="text-sm font-medium text-gray-900">{disease.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCameraView = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Capture Photo</h3>
        <button
          onClick={stopCamera}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        {!isVideoReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="mt-4 flex justify-center">
        <button
          onClick={capturePhoto}
          disabled={!isVideoReady}
          className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Camera className="w-4 h-4" />
          <span>Capture Photo</span>
        </button>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      {/* Image Preview */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Analyzed Image</h3>
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={selectedImage || ''} 
            alt="Analyzed crop" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg">
            <span className="text-sm font-medium text-gray-900">AI Analyzed</span>
          </div>
        </div>
      </div>

      {/* Detection Results */}
      {detectionResult && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Detection Results</h3>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getSeverityColor(detectionResult.severity)}`}>
              {detectionResult.severity} Severity
            </div>
          </div>

          <div className="space-y-6">
            {/* Disease Info */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bug className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{detectionResult.disease}</h4>
                <p className="text-gray-600 mb-3">{detectionResult.description}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Confidence:</span>
                    <span className={`font-bold ${getConfidenceColor(detectionResult.confidence)}`}>
                      {detectionResult.confidence}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Affected Area:</span>
                    <span className="font-bold text-gray-900">{detectionResult.affectedArea}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Detection Confidence</span>
                <span className={`font-bold ${getConfidenceColor(detectionResult.confidence)}`}>
                  {detectionResult.confidence}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    detectionResult.confidence >= 90 ? 'bg-green-500' :
                    detectionResult.confidence >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${detectionResult.confidence}%` }}
                />
              </div>
            </div>

            {/* Causes */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
                Possible Causes
              </h5>
              <ul className="space-y-2">
                {detectionResult.causes.map((cause, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatments */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                Recommended Treatments
              </h5>
              <ul className="space-y-2">
                {detectionResult.treatments.map((treatment, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{treatment}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prevention */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Info className="w-4 h-4 mr-2 text-blue-600" />
                Prevention Tips
              </h5>
              <ul className="space-y-2">
                {detectionResult.prevention.map((prevention, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{prevention}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Consult Expert</span>
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Leaf className="w-4 h-4" />
                <span>View Treatments</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">AI Disease Detection</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Advanced AI-powered crop disease identification with instant treatment recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAnalyzing ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Image</h3>
                <p className="text-gray-600 mb-6">Our AI is examining your crop image for disease detection</p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Image preprocessing complete</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">Feature extraction in progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-gray-700">AI model analyzing...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isCameraOpen ? (
          renderCameraView()
        ) : selectedImage ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <button
                onClick={analyzeImage}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all flex items-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Analyze for Diseases</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            {renderAnalysis()}
          </div>
        ) : (
          renderUploadArea()
        )}
      </div>
    </div>
  );
};

export default ModernDiseaseDetection;
