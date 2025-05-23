'use client';

import { useState } from 'react';
import { motion } from '@/lib/motion-mock';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Film, 
  Music, 
  Mic, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type FeatureType = 'chat' | 'image' | 'video' | 'music' | 'audio';

interface Feature {
  id: FeatureType;
  icon: React.ReactNode;
  color: string;
  title: string;
  description: string;
  image: string;
}

export function FeatureShowcase() {
  const { t } = useTranslation();
  const [activeFeature, setActiveFeature] = useState<FeatureType>('chat');

  const features: Feature[] = [
    {
      id: 'chat',
      icon: <MessageSquare className="h-6 w-6" />,
      color: '#00F7FF',
      title: t('features.chat.title', 'AI Chat Assistant'),
      description: t('features.chat.description', 'Engage in dynamic conversations with our advanced AI. Get answers, explore ideas, and solve problems with a responsive chat interface.'),
      image: 'https://images.pexels.com/photos/4526413/pexels-photo-4526413.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'image',
      icon: <ImageIcon className="h-6 w-6" />,
      color: '#FF2D7C',
      title: t('features.image.title', 'Image Generation'),
      description: t('features.image.description', 'Transform your ideas into stunning visuals with customizable parameters and real-time feedback.'),
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'video',
      icon: <Film className="h-6 w-6" />,
      color: '#00FF88',
      title: t('features.video.title', 'Video Creation'),
      description: t('features.video.description', 'Bring your stories to life with AI-powered video generation from text prompts or images.'),
      image: 'https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'music',
      icon: <Music className="h-6 w-6" />,
      color: '#7C3AED',
      title: t('features.music.title', 'Music Composition'),
      description: t('features.music.description', 'Create original music tracks from simple descriptions. Perfect for content creators and music enthusiasts.'),
      image: 'https://images.pexels.com/photos/164853/pexels-photo-164853.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'audio',
      icon: <Mic className="h-6 w-6" />,
      color: '#F59E0B',
      title: t('features.audio.title', 'Text to Speech'),
      description: t('features.audio.description', 'Convert text to natural-sounding speech with multiple voice options and language support.'),
      image: 'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  const currentFeature = features.find(f => f.id === activeFeature) || features[0];

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t('features.title', 'Explore Our AI Capabilities')}
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          {t('features.subtitle', 'Discover what you can create with our advanced AI technologies')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => setActiveFeature(feature.id)}
            className={cn(
              "flex flex-col items-center p-4 rounded-lg transition-all duration-300 border",
              activeFeature === feature.id 
                ? `border-[${feature.color}] bg-[${feature.color}]/10 shadow-lg transform -translate-y-1`
                : "border-transparent hover:bg-white/5"
            )}
          >
            <div 
              className="p-3 rounded-full mb-3" 
              style={{ backgroundColor: `${feature.color}20` }}
            >
              <div style={{ color: feature.color }}>{feature.icon}</div>
            </div>
            <span className="font-medium">{feature.title}</span>
          </button>
        ))}
      </div>

      <motion.div 
        key={currentFeature.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-xl overflow-hidden"
      >
        <div className="grid md:grid-cols-2 gap-8 p-8 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
          <div className="flex flex-col justify-center">
            <h3 
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: currentFeature.color }}
            >
              {currentFeature.title}
            </h3>
            <p className="text-gray-300 mb-6">
              {currentFeature.description}
            </p>
            <Button 
              className="w-fit"
              style={{ 
                backgroundColor: currentFeature.color,
                color: '#000',
              }}
            >
              {t('features.tryNow', 'Try Now')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden h-[250px] md:h-[300px]">
            <img 
              src={currentFeature.image} 
              alt={currentFeature.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}