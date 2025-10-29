'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { MoolaLogo } from '@/components/ui/MoolaLogo';
import { createPlayer } from '@/lib/api/player';
import { ArrowLeft, Mail, Phone, User } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    smsOptIn: false,
    consent: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.consent) {
      newErrors.consent = 'You must agree to continue';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create player in Supabase and sync to Klaviyo
      const { player, error } = await createPlayer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        smsOptIn: formData.smsOptIn,
      });

      if (error) {
        throw new Error(error);
      }

      // Store player ID in localStorage for the game
      localStorage.setItem('coinFlipPlayerId', player.id);
      localStorage.setItem('coinFlipPlayerEmail', player.email);
      
      // Redirect to instructions
      window.location.href = '/instructions';
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <MoolaLogo size="md" white />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          <Card className="glass-card border-white/20">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white mb-2">
                Let's Get Started!
              </CardTitle>
              <p className="text-white/80">
                Enter your details to play the 5-minute challenge
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-white">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary touch-target"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-400 text-sm">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary touch-target"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-white">
                    Phone Number <span className="text-white/60">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary touch-target"
                    />
                  </div>
                </div>

                {/* SMS Opt-in */}
                {formData.phone && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-3"
                  >
                    <Checkbox
                      id="smsOptIn"
                      checked={formData.smsOptIn}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, smsOptIn: checked as boolean }))
                      }
                      className="border-white/40 data-[state=checked]:bg-primary"
                    />
                    <label htmlFor="smsOptIn" className="text-sm text-white/90 cursor-pointer">
                      Send me SMS updates about my results
                    </label>
                  </motion.div>
                )}

                {/* Consent Checkbox */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, consent: checked as boolean }))
                      }
                      className="border-white/40 data-[state=checked]:bg-primary mt-0.5"
                    />
                    <label htmlFor="consent" className="text-sm text-white/90 cursor-pointer leading-relaxed">
                      I agree to receive educational content from Moola and understand this is a simulation with no real money involved. *
                    </label>
                  </div>
                  {errors.consent && (
                    <p className="text-red-400 text-sm">{errors.consent}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-gradient text-lg font-semibold py-3 h-auto touch-target"
                >
                  {isLoading ? 'Getting Ready...' : 'Start Challenge'}
                </Button>

                {errors.submit && (
                  <p className="text-red-400 text-sm text-center">{errors.submit}</p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Privacy Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-white/60 mt-6"
          >
            We respect your privacy. No spam, unsubscribe anytime.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
