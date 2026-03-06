import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, Info, Phone } from 'lucide-react';
import { useTranslation, raw } from '../utils/translations';

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

const DiseaseDetection: React.FC<DiseaseDetectionProps> = ({ currentLanguage }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const { t } = useTranslation(currentLanguage);

  // When language changes, re-translate the current detection result if present
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

  const openCamera = async () => {
    try {
      setIsVideoReady(false);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment', // Use back camera on mobile
          frameRate: { ideal: 30 }
        } 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      
      // We set stream and open modal; actual attachment to the video element
      // happens in the effect below (after the modal/video element is mounted).
      // Try a direct attach if the ref already exists (fast path).
      if (videoRef.current) {
        try {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        } catch {
          // ignore, the effect will handle attachment
        }
      }
    } catch {
      // permissions or devices not available
      alert(t('cameraAccessError') || 'Unable to access camera. Please check permissions or use file upload instead.');
    }
  };

  // Attach stream to video element after it's mounted and the modal is open.
  useEffect(() => {
    const video = videoRef.current;
    if (isCameraOpen && stream && video) {
      // attach the stream
      try {
        if (video.srcObject !== stream) video.srcObject = stream;
      } catch {
        // ignore assignment errors
      }

      const onLoaded = () => {
        video.play().catch(() => {});
      };

      const markReady = () => setIsVideoReady(true);

      video.addEventListener('loadedmetadata', onLoaded);
      video.addEventListener('canplay', markReady);
      video.addEventListener('playing', markReady);

      // If the video is already in a playable state, mark ready immediately
      if (video.readyState >= 3) {
        setIsVideoReady(true);
      }

      return () => {
        video.removeEventListener('loadedmetadata', onLoaded);
        video.removeEventListener('canplay', markReady);
        video.removeEventListener('playing', markReady);
      };
    }
    return;
  }, [isCameraOpen, stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isVideoReady) {
      const video = videoRef.current as HTMLVideoElement;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Ensure video is playing and has loaded
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        alert('Camera is still loading. Please wait a moment and try again.');
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        // Clear canvas first
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the video frame
        context.drawImage(video, 0, 0);
        
        // Convert to high quality JPEG
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Verify the image is not empty/black
        if (imageDataUrl === 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R/Huf/Z') {
          alert('Failed to capture image. Please ensure the camera is working properly.');
          return;
        }
        
        setSelectedImage(imageDataUrl);
        closeCamera();
        setDetectionResult(null);
      } else {
        alert('Failed to access camera context. Please try again.');
      }
    } else {
      alert('Camera is not ready. Please wait for the video to load completely.');
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
    setIsVideoReady(false);
  };
  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults: Array<DetectionResult & { id: string }> = [
        {
          id: 'lateBlight',
          disease: 'Late Blight (Phytophthora infestans)',
          confidence: 94,
          severity: 'High',
          description: 'Late blight is a devastating disease affecting potatoes and tomatoes, caused by the water mold Phytophthora infestans. It can destroy entire crops within days under favorable conditions.',
          causes: [
            'High humidity (>90%)',
            'Temperature between 15-20°C',
            'Prolonged leaf wetness',
            'Poor air circulation',
            'Infected seed tubers'
          ],
          treatments: [
            'Apply copper-based fungicides immediately',
            'Use systemic fungicides like metalaxyl',
            'Remove and destroy infected plants',
            'Improve drainage and air circulation',
            'Apply protective sprays every 7-14 days'
          ],
          prevention: [
            'Use certified disease-free seeds',
            'Plant resistant varieties',
            'Ensure proper spacing for air circulation',
            'Avoid overhead watering',
            'Regular monitoring and early detection'
          ],
          affectedArea: 35
        },
        {
          id: 'earlyBlight',
          disease: 'Early Blight (Alternaria solani)',
          confidence: 87,
          severity: 'Medium',
          description: 'Early blight is a common fungal disease affecting tomatoes and potatoes, characterized by dark spots with concentric rings on leaves.',
          causes: [
            'High temperatures (24-29°C)',
            'High humidity',
            'Plant stress',
            'Poor nutrition',
            'Wounds from insects or pruning'
          ],
          treatments: [
            'Apply fungicides containing chlorothalonil',
            'Remove affected leaves immediately',
            'Improve plant nutrition',
            'Ensure proper watering practices',
            'Use crop rotation strategies'
          ],
          prevention: [
            'Maintain proper plant spacing',
            'Water at soil level, not on leaves',
            'Apply mulch to prevent soil splash',
            'Regular pruning of lower branches',
            'Balanced fertilization'
          ],
          affectedArea: 20
        }
      ];

      // Randomly select one result
      const result = mockResults[Math.floor(Math.random() * mockResults.length)];
      // if translations exist for this disease, use them
      // Prefer translated disease name/description when available via the t() helper
      const diseaseId = (result as DetectionResult & { id?: string }).id;
      let translatedName = result.disease;
      let translatedDesc = result.description;
      if (diseaseId) {
        const nameKey = `diseases.${diseaseId}.name`;
        const descKey = `diseases.${diseaseId}.description`;
        try {
          const maybeName = t(nameKey);
          const maybeDesc = t(descKey);
          // t() falls back to English or the key, so only use if different from the key
          if (maybeName && !maybeName.startsWith('diseases.')) translatedName = maybeName;
          if (maybeDesc && !maybeDesc.startsWith('diseases.')) translatedDesc = maybeDesc;
        } catch {
          // ignore translation resolution errors
        }
      }

      setDetectionResult({ ...result, disease: translatedName, description: translatedDesc });
      setIsAnalyzing(false);
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const commonDiseases = [
    {
      name: "Late Blight",
      crop: "Potato, Tomato",
      prevalence: "High",
      season: "Monsoon"
    },
    {
      name: "Powdery Mildew",
      crop: "Various crops",
      prevalence: "Medium",
      season: "Winter"
    },
    {
      name: "Leaf Spot",
      crop: "Rice, Wheat",
      prevalence: "High",
      season: "Kharif"
    },
    {
      name: "Rust",
      crop: "Wheat, Barley",
      prevalence: "Medium",
      season: "Rabi"
    }
  ];

  return (
    <div id="disease" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('diseaseDetectionTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('diseaseDetectionSubtitle')}
          </p>
        </div>

        {/* Camera Modal */}
        {isCameraOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{t('takePhoto')}</h3>
                  <button
                    onClick={closeCamera}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 bg-black rounded-lg"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Loading indicator (render only while video not ready) */}
                  {!isVideoReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <p>{t('loading') || 'Loading camera...'}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center mt-4 space-x-4">
                  <button
                    onClick={capturePhoto}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture Photo
                  </button>
                  <button
                    onClick={closeCamera}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('uploadImage')}</h3>
              
              {!selectedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">{t('uploadImage')}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Drag and drop or click to select
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected crop"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t('analyzing')}
                      </div>
                    ) : (
                      t('analyzeForDiseases')
                    )}
                  </button>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                title="Upload crop image"
                placeholder="Select an image file"
              />
            </div>

            {/* Camera Option */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('takePhoto')}</h4>
              <button 
                onClick={openCamera}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                {t('openCamera')}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {isAnalyzing && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <div className="animate-pulse space-y-4">
                    <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                  <p className="text-lg text-gray-600 mt-4">
                    {t('analyzing')}
                  </p>
                </div>
              </div>
            )}

            {detectionResult && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {t('detectionResultTitle') || 'Detection Result'}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(detectionResult.severity)}`}>
                        {t(detectionResult.severity === 'High' ? 'severityHigh' : detectionResult.severity === 'Medium' ? 'severityMedium' : 'severityLow') || detectionResult.severity} {t('severity') || 'Severity'}
                      </span>
                      <span className="text-sm text-gray-600">
                        {detectionResult.confidence}% {t('confidence') || 'Confidence'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl">
                      {detectionResult.severity === 'High' ? '🚨' : 
                       detectionResult.severity === 'Medium' ? '⚠️' : '✅'}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {detectionResult.disease}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {detectionResult.description}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-red-800 mb-2 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          {t('primaryCauses') || 'Primary Causes'}
                        </h5>
                      <ul className="space-y-1 text-sm text-red-700">
                        {(raw(currentLanguage, `diseases.${detectionResult.id}.causes`) as string[] || detectionResult.causes).map((cause, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-green-800 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t('treatmentOptions') || 'Treatment Options'}
                      </h5>
                      <ul className="space-y-1 text-sm text-green-700">
                        {((raw(currentLanguage, `diseases.${detectionResult.id}.treatments`) as string[]) || detectionResult.treatments).slice(0, 3).map((treatment, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {treatment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      {t('preventionMeasures') || 'Prevention Measures'}
                    </h5>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-blue-700">
                      {(raw(currentLanguage, `diseases.${detectionResult.id}.prevention`) as string[] || detectionResult.prevention).map((measure, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {measure}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => { window.location.hash = '#consultations'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center justify-center"
                      aria-label="Consult Expert"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {t('consultExpert') || 'Consult Expert'}
                    </button>
                    <button
                      onClick={() => { window.location.hash = '#marketplace'; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                      aria-label="Order Treatment"
                    >
                      {t('orderTreatment') || 'Order Treatment'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Common Diseases Info */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Common Crop Diseases
              </h3>
              <div className="grid gap-4">
                {commonDiseases.map((disease, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <div className="font-medium text-gray-900">{disease.name}</div>
                      <div className="text-sm text-gray-600">{disease.crop}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{disease.prevalence}</div>
                      <div className="text-xs text-gray-500">{disease.season}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;