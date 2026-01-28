import React, { useState, useRef, useContext } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Leaf, Upload, Camera, History, BookOpen, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout, token, API } = useContext(AppContext);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      toast.error('Camera access denied');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        setSelectedImage(file);
        setPreviewUrl(canvas.toDataURL());
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const handleScan = async () => {
    if (!selectedImage) {
      toast.error('Please select or capture an image first');
      return;
    }

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(',')[1];
        
        const response = await axios.post(
          `${API}/scans`,
          { image_base64: base64 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success('Scan completed!');
        navigate(`/scan/${response.data.id}`);
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to analyze image');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-white/70 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2" onClick={() => navigate('/dashboard')} role="button">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Plant Defender</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                data-testid="nav-history-btn"
                variant="ghost"
                onClick={() => navigate('/history')}
                className="rounded-full"
              >
                <History className="h-5 w-5 mr-2" />
                History
              </Button>
              <Button
                data-testid="nav-diseases-btn"
                variant="ghost"
                onClick={() => navigate('/diseases')}
                className="rounded-full"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Diseases
              </Button>
              <Button
                data-testid="nav-logout-btn"
                variant="ghost"
                onClick={logout}
                className="rounded-full"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">Upload or capture an image to check your tomato plant health</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="relative overflow-hidden rounded-xl bg-card border border-border shadow-sm p-8" data-testid="upload-section">
            <h2 className="text-2xl md:text-3xl font-medium mb-6">Scan Your Plant</h2>

            {!previewUrl && !showCamera && (
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-64 rounded-2xl border-2 border-dashed border-border/50 bg-accent/30 hover:bg-accent/50 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1680341965294-17b33273e17d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBwbGFudCUyMGhlYWx0aHklMjBsZWF2ZXMlMjBjbG9zZSUyMHVwfGVufDB8fHx8MTc2OTU3ODY2NHww&ixlib=rb-4.1.0&q=85)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
                  <Upload className="h-12 w-12 text-primary relative z-10 mb-3" data-testid="upload-icon" />
                  <p className="text-sm font-medium text-foreground relative z-10">Click to upload image</p>
                  <p className="text-xs text-muted-foreground relative z-10 mt-1">PNG, JPG, WEBP up to 10MB</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="file-input"
                />

                <div className="text-center text-sm text-muted-foreground">or</div>

                <Button
                  data-testid="camera-btn"
                  onClick={startCamera}
                  variant="outline"
                  className="w-full h-12 rounded-full border-2 border-primary text-primary hover:bg-primary/5"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Use Camera
                </Button>
              </div>
            )}

            {showCamera && (
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-xl"
                  data-testid="camera-video"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-3">
                  <Button
                    data-testid="capture-photo-btn"
                    onClick={capturePhoto}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-full"
                  >
                    Capture Photo
                  </Button>
                  <Button
                    data-testid="cancel-camera-btn"
                    onClick={stopCamera}
                    variant="outline"
                    className="h-12 rounded-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {previewUrl && !showCamera && (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden">
                  <img src={previewUrl} alt="Selected plant" className="w-full h-auto" data-testid="preview-image" />
                </div>
                <div className="flex gap-3">
                  <Button
                    data-testid="analyze-btn"
                    onClick={handleScan}
                    disabled={isScanning}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-full"
                  >
                    {isScanning ? 'Analyzing...' : 'Analyze Plant'}
                  </Button>
                  <Button
                    data-testid="reset-btn"
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewUrl(null);
                    }}
                    variant="outline"
                    className="h-12 rounded-full"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="relative overflow-hidden rounded-xl bg-card border border-border shadow-sm p-8">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <History className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">View History</h3>
              <p className="text-sm text-muted-foreground mb-4">Access all your previous scans and diagnoses</p>
              <Button
                data-testid="view-history-btn"
                onClick={() => navigate('/history')}
                variant="outline"
                className="w-full h-10 rounded-full border-2 border-primary text-primary hover:bg-primary/5"
              >
                Go to History
              </Button>
            </Card>

            <Card className="relative overflow-hidden rounded-xl bg-card border border-border shadow-sm p-8">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Disease Library</h3>
              <p className="text-sm text-muted-foreground mb-4">Learn about common tomato plant diseases</p>
              <Button
                data-testid="browse-diseases-btn"
                onClick={() => navigate('/diseases')}
                variant="outline"
                className="w-full h-10 rounded-full border-2 border-primary text-primary hover:bg-primary/5"
              >
                Browse Diseases
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;