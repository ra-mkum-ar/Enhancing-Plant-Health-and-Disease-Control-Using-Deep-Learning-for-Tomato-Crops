import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Leaf, Activity, Shield, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const Landing = () => {
  const { login, API } = useContext(AppContext);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${API}${endpoint}`, formData);
      login(response.data.token, response.data.user);
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
      setShowAuth(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Plant Defender</span>
            </div>
            <Button
              data-testid="nav-get-started-btn"
              onClick={() => setShowAuth(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1723580864282-735eecf10c42?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjB1c2luZyUyMHRhYmxldCUyMGluJTIwdG9tYXRvJTIwZmllbGR8ZW58MHx8fHwxNzY5NTc4NjY2fDA&ixlib=rb-4.1.0&q=85"
            alt="Farmer using tablet in tomato field"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/10">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-xs uppercase tracking-widest font-semibold text-accent-foreground">AI-Powered Plant Health</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Protect Your Tomato Crops with
              <span className="text-primary block mt-2">Deep Learning</span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-10 max-w-2xl mx-auto">
              Detect diseases early, get instant treatment recommendations, and track your plant health history—all powered by advanced AI vision technology.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                data-testid="hero-start-scanning-btn"
                onClick={() => setShowAuth(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Start Scanning Now
              </Button>
              <Button
                data-testid="hero-learn-more-btn"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5 h-12 px-8 rounded-full font-medium"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Features</span>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mt-3 mb-4">Everything You Need</h2>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools for maintaining healthy tomato crops
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all duration-300 border border-border/50">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Activity className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-medium mb-3">Instant Analysis</h3>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                Upload or capture a photo and get AI-powered disease detection in seconds. Our model analyzes leaf patterns, discoloration, and symptoms.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all duration-300 border border-border/50">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-medium mb-3">Treatment Plans</h3>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                Receive detailed treatment recommendations tailored to the specific disease detected, including preventive measures and best practices.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all duration-300 border border-border/50">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-medium mb-3">Track History</h3>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                Monitor your plant health over time with a comprehensive history of all scans, helping you identify patterns and improve crop management.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-primary/5">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">Ready to Protect Your Crops?</h2>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-10">
              Join farmers using AI technology to maintain healthier tomato plants
            </p>
            <Button
              data-testid="cta-get-started-btn"
              onClick={() => setShowAuth(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-md" data-testid="auth-dialog">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">{isLogin ? 'Welcome Back' : 'Create Account'}</DialogTitle>
            <DialogDescription>
              {isLogin ? 'Sign in to continue scanning your plants' : 'Start protecting your tomato crops today'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  data-testid="auth-name-input"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                  className="h-12 rounded-lg"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                data-testid="auth-email-input"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-12 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                data-testid="auth-password-input"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-12 rounded-lg"
              />
            </div>

            <Button
              data-testid="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-full font-medium"
            >
              {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              data-testid="auth-toggle-btn"
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;