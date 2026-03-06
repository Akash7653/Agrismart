import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Upload, AlertTriangle, CheckCircle, Info, Phone, 
  Shield, Bug, Droplets, Sun, Wind, Loader2, 
  ArrowRight, X, Leaf, Search, Microscope
} from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useThemeColors } from '../hooks/useThemeColors';

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

const ModernDiseaseDetectionFixed: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const { isDark } = useTheme();
  const colors = useThemeColors();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [cameraError, setCameraError] = useState<string>('');

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

  useEffect(() => {
    // Cleanup camera on unmount
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
      setIsCameraOpen(false);
      setIsVideoReady(false);
      setCameraError('');
    } catch (error) {
      console.error('Error stopping camera:', error);
    }
  };

  const startCamera = async () => {
    // Stop existing camera first
    stopCamera();
    
    // Small delay to ensure cleanup
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      setCameraError('');
      setIsVideoReady(false);
      
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Get media stream with better constraint
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false
      });
      
      setStream(mediaStream);
      setIsCameraOpen(true);
      
      // Wait for video ref to be ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!videoRef.current) {
        mediaStream.getTracks().forEach(track => track.stop());
        throw new Error('Video element not found');
      }
      
      videoRef.current.srcObject = mediaStream;
      
      // Wait for loadedmetadata
      const loadPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Camera initialization timeout'));
        }, 10000);
        
        const onLoadedMetadata = () => {
          clearTimeout(timeout);
          videoRef.current?.removeEventListener('loadedmetadata', onLoadedMetadata);
          resolve();
        };
        
        if (videoRef.current) {
          videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
        }
      });
      
      await loadPromise;
      
      // Try to play
      if (videoRef.current) {
        try {
          await videoRef.current.play();
          setIsVideoReady(true);
          setCameraError('');
        } catch (playError) {
          console.error('Play error:', playError);
          setCameraError('Failed to start video playback');
          stopCamera();
        }
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      stopCamera();
      
      let errorMessage = 'Unable to access camera';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow access.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is in use by another application.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Camera failed to initialize. Try again.';
      }
      setCameraError(errorMessage);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDetectionResult(null);
        setCameraError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isVideoReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Get video dimensions
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      if (!videoWidth || !videoHeight) {
        console.error('Video dimensions not available');
        setCameraError('Failed to capture photo. Video not ready.');
        return;
      }
      
      // Set canvas to match video's native resolution
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw entire video frame to canvas (no scaling, full resolution)
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        
        // Convert to high-quality image
        const imageData = canvas.toDataURL('image/jpeg', 0.95);
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
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 text-center hover:shadow-2xl hover:border-red-400 transition-all duration-300 transform hover:scale-105 group animate-slideUp">
          <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
            <Upload className="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-black dark:text-white mb-2">Upload Image</h3>
          <p className="text-black dark:text-gray-400 mb-4 text-sm font-bold">Choose a photo from your device</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 flex items-center space-x-2 mx-auto text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Choose File</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 text-center hover:shadow-2xl hover:border-orange-400 transition-all duration-300 transform hover:scale-105 group animate-slideUp" style={{ animationDelay: '100ms' }}>
          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
            <Camera className="w-7 h-7 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-bold text-black dark:text-white mb-2">Take Photo</h3>
          <p className="text-black dark:text-gray-400 mb-4 text-sm font-bold">Capture a photo with your camera</p>
          <button
            onClick={startCamera}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center space-x-2 mx-auto text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Open Camera</span>
          </button>
        </div>
      </div>

      {/* Common Diseases Reference */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-lg p-6 border border-red-100 dark:border-gray-700 mt-8 animate-fadeInScale" style={{ animationDelay: '200ms' }}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
          Common Crop Diseases
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {commonDiseases.map((disease, index) => {
            const Icon = disease.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 transform cursor-pointer group border border-transparent hover:border-red-300 dark:hover:border-red-700" style={{ animationDelay: `${index * 50}ms` }}>
                <div className={`w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 text-red-600 dark:text-red-400`} />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{disease.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderCameraView = () => (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Capture Photo</h3>
        <button
          onClick={stopCamera}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      
      {/* Error Display */}
      {cameraError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-sm text-red-700 dark:text-red-300">{cameraError}</p>
          </div>
          <button
            onClick={() => {
              stopCamera();
              setTimeout(() => startCamera(), 500);
            }}
            className="ml-2 text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Video Container - Full Size */}
      <div className="relative bg-black rounded-lg overflow-hidden mx-auto w-full" style={{ maxWidth: '640px', aspectRatio: '4/3' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
          style={{ transform: 'scaleX(-1)' }}
        />
        {!isVideoReady && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="mt-4 flex justify-center space-x-3">
        <button
          onClick={capturePhoto}
          disabled={!isVideoReady}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
        >
          <Camera className="w-4 h-4" />
          <span>Capture Photo</span>
        </button>
        <button
          onClick={stopCamera}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 text-sm"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-4 animate-slideUp">
      {/* Image Preview */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300">
        <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Analyzed Image</h3>
        <div className="relative rounded-lg overflow-hidden mx-auto" style={{ width: '480px', maxWidth: '100%' }}>
          <img 
            src={selectedImage || ''} 
            alt="Analyzed crop" 
            className="w-full h-auto object-contain animate-fadeInScale"
            style={{ maxHeight: '600px' }}
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-md border border-green-200">
            <span className="text-xs font-medium text-green-700">✓ AI Analyzed</span>
          </div>
        </div>
      </div>

      {/* Detection Results */}
      {detectionResult && (
        <div className="bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-red-900/30 rounded-xl shadow-md p-4 border border-red-100 dark:border-red-900/50 animate-slideUp">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-black dark:text-white">Detection Results</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(detectionResult.severity)}`}>
              {detectionResult.severity} Severity
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Disease Info */}
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <Bug className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-black dark:text-white text-lg">{detectionResult.disease}</h4>
                <p className="text-black dark:text-gray-300 text-sm mt-1 font-bold">{detectionResult.description}</p>
                <div className="flex items-center mt-3 space-x-4">
                  <span className="text-sm text-black dark:text-gray-400 font-bold">Confidence:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${detectionResult.confidence}%` }}
                      ></div>
                    </div>
                    <span className={`font-bold text-sm ${getConfidenceColor(detectionResult.confidence)} min-w-max`}>
                      {detectionResult.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Causes */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800/50 hover:shadow-md transition-all duration-300">
              <h5 className="font-bold text-black dark:text-white mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                Possible Causes
              </h5>
              <ul className="space-y-2">
                {detectionResult.causes.map((cause, index) => (
                  <li key={index} className="text-sm text-black dark:text-gray-300 font-bold flex items-start pl-2" style={{ animationDelay: `${index * 50}ms` }}>
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatments */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800/50 hover:shadow-md transition-all duration-300">
              <h5 className="font-bold text-black dark:text-white mb-3 flex items-center">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                Recommended Treatments
              </h5>
              <ul className="space-y-2">
                {detectionResult.treatments.map((treatment, index) => (
                  <li key={index} className="text-sm text-black dark:text-gray-300 font-bold flex items-start pl-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{treatment}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prevention */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800/50 hover:shadow-md transition-all duration-300">
              <h5 className="font-bold text-black dark:text-white mb-3 flex items-center">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                Prevention Tips
              </h5>
              <ul className="space-y-2">
                {detectionResult.prevention.map((tip, index) => (
                  <li key={index} className="text-sm text-black dark:text-gray-300 font-bold flex items-start pl-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={analyzeImage}
          disabled={isAnalyzing || !selectedImage}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold hover:from-red-700 hover:to-pink-700"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Microscope className="w-5 h-5" />
              <span>Analyze Image</span>
            </>
          )}
        </button>
        <button
          onClick={() => {
            setSelectedImage(null);
            setDetectionResult(null);
          }}
          className="px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 flex items-center space-x-2 font-semibold"
        >
          <Upload className="w-5 h-5" />
          <span>New Image</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-white dark:bg-gray-950 text-black dark:text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 border-b border-red-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 bg-clip-text text-transparent dark:from-red-400 dark:via-orange-400 dark:to-pink-400">AI Disease Detection</h1>
            </div>
            <p className="text-black dark:text-gray-400 max-w-2xl mx-auto font-bold">
              Identify plant diseases instantly using advanced AI image recognition technology
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isCameraOpen && !selectedImage && renderUploadArea()}
        {isCameraOpen && renderCameraView()}
        {selectedImage && !isAnalyzing && renderAnalysis()}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeInScale">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white mb-3 animate-slideUp">AI Analyzing Your Crop...</h3>
            <p className="text-black dark:text-gray-400 text-center max-w-md animate-slideUp font-bold" style={{ animationDelay: '100ms' }}>
              Our advanced AI is processing your image for disease detection and personalized treatment recommendations.
            </p>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInScale { animation: fadeInScale 0.5s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ModernDiseaseDetectionFixed;
