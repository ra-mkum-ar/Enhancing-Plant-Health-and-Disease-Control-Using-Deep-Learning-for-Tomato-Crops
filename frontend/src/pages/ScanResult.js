import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Leaf, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { format } from 'date-fns';

const ScanResult = () => {
  const { scanId } = useParams();
  const { token, API } = useContext(AppContext);
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScan();
  }, [scanId]);

  const fetchScan = async () => {
    try {
      const response = await axios.get(`${API}/scans/${scanId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScan(response.data);
    } catch (error) {
      toast.error('Failed to load scan');
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'None': 'bg-green-100 text-green-700 border-green-200',
      'Mild': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Moderate': 'bg-orange-100 text-orange-700 border-orange-200',
      'Severe': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[severity] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const isHealthy = scan?.disease_detected?.toLowerCase().includes('healthy') || scan?.severity === 'None';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-white/70 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2" onClick={() => navigate('/dashboard')} role="button">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Plant Defender</span>
            </div>
            <Button
              data-testid="back-to-history-btn"
              variant="ghost"
              onClick={() => navigate('/history')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to History
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:sticky lg:top-8 h-fit">
            <Card className="overflow-hidden rounded-xl bg-card border border-border shadow-sm" data-testid="scan-image-card">
              <img
                src={`data:image/jpeg;base64,${scan?.image_base64}`}
                alt="Plant scan"
                className="w-full h-auto"
              />
              <div className="p-6">
                <p className="text-xs text-muted-foreground">
                  Scanned on {format(new Date(scan?.created_at), 'MMMM dd, yyyy \\at HH:mm')}
                </p>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-8 rounded-xl bg-card border border-border shadow-sm" data-testid="diagnosis-card">
              <div className="flex items-start gap-4 mb-6">
                {isHealthy ? (
                  <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-medium mb-2">{scan?.disease_detected || 'Unknown'}</h2>
                  <div className="flex flex-wrap gap-2">
                    {scan?.severity && (
                      <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getSeverityColor(scan.severity)}`}>
                        {scan.severity} Severity
                      </span>
                    )}
                    {scan?.confidence && (
                      <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border font-medium">
                        {scan.confidence} Confidence
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {scan?.treatment && (
              <Card className="p-8 rounded-xl bg-card border border-border shadow-sm" data-testid="treatment-card">
                <h3 className="text-xl font-medium mb-4">Treatment</h3>
                <p className="text-base leading-relaxed text-foreground">{scan.treatment}</p>
              </Card>
            )}

            {scan?.recommendations && scan.recommendations.length > 0 && (
              <Card className="p-8 rounded-xl bg-card border border-border shadow-sm" data-testid="recommendations-card">
                <h3 className="text-xl font-medium mb-4">Recommendations</h3>
                <ul className="space-y-3">
                  {scan.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                      <p className="text-base leading-relaxed text-foreground">{rec}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <div className="flex gap-4">
              <Button
                data-testid="new-scan-btn"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-full"
              >
                New Scan
              </Button>
              <Button
                data-testid="view-diseases-btn"
                onClick={() => navigate('/diseases')}
                variant="outline"
                className="flex-1 border-2 border-primary text-primary hover:bg-primary/5 h-12 rounded-full"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanResult;