import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Leaf, ArrowLeft, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { format } from 'date-fns';

const History = () => {
  const { token, API } = useContext(AppContext);
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const response = await axios.get(`${API}/scans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScans(response.data);
    } catch (error) {
      toast.error('Failed to load history');
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
              data-testid="back-btn"
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-2" data-testid="history-title">Scan History</h1>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">View all your previous plant health scans</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-pulse text-primary text-lg font-medium">Loading...</div>
          </div>
        ) : scans.length === 0 ? (
          <Card className="p-12 text-center" data-testid="empty-history">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No scans yet</h3>
            <p className="text-muted-foreground mb-6">Start scanning your plants to see your history here</p>
            <Button
              data-testid="start-scanning-btn"
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-full"
            >
              Start Scanning
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scans.map((scan) => (
              <Card
                key={scan.id}
                data-testid={`scan-card-${scan.id}`}
                onClick={() => navigate(`/scan/${scan.id}`)}
                className="group cursor-pointer relative overflow-hidden rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={`data:image/jpeg;base64,${scan.image_base64}`}
                    alt="Plant scan"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-medium mb-1">{scan.disease_detected || 'Unknown'}</h3>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(scan.created_at), 'MMM dd, yyyy - HH:mm')}
                      </p>
                    </div>
                    {scan.severity && (
                      <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getSeverityColor(scan.severity)}`}>
                        {scan.severity}
                      </span>
                    )}
                  </div>
                  {scan.confidence && (
                    <div className="text-xs text-muted-foreground">
                      Confidence: <span className="font-medium">{scan.confidence}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;