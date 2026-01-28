import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Leaf, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const Diseases = () => {
  const { API } = useContext(AppContext);
  const navigate = useNavigate();
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      const response = await axios.get(`${API}/diseases`);
      setDiseases(response.data);
    } catch (error) {
      toast.error('Failed to load diseases');
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-2" data-testid="diseases-title">Disease Library</h1>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">Learn about common tomato plant diseases and how to treat them</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-pulse text-primary text-lg font-medium">Loading...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {diseases.map((disease) => (
              <Card key={disease.id} className="p-8 rounded-xl bg-card border border-border shadow-sm" data-testid={`disease-${disease.id}`}>
                <h2 className="text-2xl md:text-3xl font-medium mb-4">{disease.name}</h2>
                <p className="text-base leading-relaxed text-muted-foreground mb-6">{disease.description}</p>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="symptoms">
                    <AccordionTrigger className="text-lg font-medium">Symptoms</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 mt-2">
                        {disease.symptoms.map((symptom, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                            <p className="text-base leading-relaxed">{symptom}</p>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="causes">
                    <AccordionTrigger className="text-lg font-medium">Causes</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 mt-2">
                        {disease.causes.map((cause, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                            <p className="text-base leading-relaxed">{cause}</p>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="treatment">
                    <AccordionTrigger className="text-lg font-medium">Treatment</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-base leading-relaxed mt-2">{disease.treatment}</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="prevention">
                    <AccordionTrigger className="text-lg font-medium">Prevention</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 mt-2">
                        {disease.prevention.map((measure, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                            <p className="text-base leading-relaxed">{measure}</p>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Diseases;