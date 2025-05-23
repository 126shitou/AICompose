'use client';

import { useState } from 'react';
import { motion } from '@/lib/motion-mock';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Pause, 
  Upload, 
  Film, 
  Sparkles, 
  RefreshCw, 
  Clock,
  Video
} from 'lucide-react';

export default function VideoPage() {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(5);
  const [quality, setQuality] = useState('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleGenerate = () => {
    if (prompt.trim() === '') {
      alert('Please enter a prompt');
      return;
    }
    
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate video generation with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          // Use a placeholder video
          setGeneratedVideo('https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
          return 100;
        }
        return next;
      });
    }, 100);
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // In a real implementation, we would control the video element
    const videoElement = document.getElementById('generated-video') as HTMLVideoElement;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <h1 className="text-3xl font-bold mb-4">{t('video.title', 'Video Generation')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 p-6 border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {t('video.prompt', 'Prompt')}
            </label>
            <Textarea
              placeholder={t('video.promptPlaceholder', 'Describe the video you want to generate...')}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-20 bg-black/20 border-white/20 focus-visible:ring-[#00FF88]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('video.duration', 'Duration')} ({duration} {t('video.seconds', 'seconds')})
              </label>
              <Slider
                value={[duration]}
                min={3}
                max={15}
                step={1}
                onValueChange={(value) => setDuration(value[0])}
                className="py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('video.quality', 'Quality')}
              </label>
              <Select 
                value={quality} 
                onValueChange={setQuality}
              >
                <SelectTrigger className="bg-black/20 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    {t('video.qualityDraft', 'Draft')} (360p)
                  </SelectItem>
                  <SelectItem value="standard">
                    {t('video.qualityStandard', 'Standard')} (720p)
                  </SelectItem>
                  <SelectItem value="high">
                    {t('video.qualityHigh', 'High')} (1080p)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Button 
              variant="outline" 
              className="border-white/20 hover:bg-white/5"
            >
              <Upload className="h-4 w-4 mr-2" />
              {t('video.uploadImage', 'Upload Reference Image')}
            </Button>
            
            <Button 
              variant="outline" 
              className="border-white/20 hover:bg-white/5"
            >
              <Clock className="h-4 w-4 mr-2" />
              {t('video.history', 'Recent Prompts')}
            </Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {t('video.credits', 'Credits: ')} 
              <span className="font-medium text-[#00FF88]">
                {Math.ceil(duration * (quality === 'high' ? 3 : quality === 'standard' ? 2 : 1))}
              </span>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={prompt.trim() === '' || isGenerating}
              className="bg-[#00FF88] hover:bg-[#00FF88]/80 text-black relative overflow-hidden"
            >
              {isGenerating && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-black/20"
                  style={{ width: `${progress}%` }}
                />
              )}
              <span className="relative flex items-center">
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {t('video.generating', 'Generating...')}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('video.generate', 'Generate Video')}
                  </>
                )}
              </span>
            </Button>
          </div>
          
          {generatedVideo && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3">{t('video.result', 'Generated Video')}</h3>
              <div className="rounded-lg overflow-hidden border border-white/10 bg-black">
                <video 
                  id="generated-video"
                  src={generatedVideo}
                  className="w-full max-h-[400px]"
                  controls={false}
                  loop
                  muted
                  playsInline
                  poster="https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                />
                
                <div className="p-3 bg-black/60 flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/10"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 mr-1" />
                    ) : (
                      <Play className="h-4 w-4 mr-1" />
                    )}
                    {isPlaying ? t('video.pause', 'Pause') : t('video.play', 'Play')}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white hover:bg-white/10"
                    >
                      <Film className="h-4 w-4 mr-1" />
                      {t('video.saveToGallery', 'Save')}
                    </Button>
                    
                    <a 
                      href={generatedVideo} 
                      download="generated-video.mp4"
                      className={cn(
                        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3",
                      )}
                    >
                      <Film className="h-4 w-4 mr-1" />
                      {t('video.download', 'Download')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
        
        <Card className="col-span-1 p-6 border-white/10 bg-black/20 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">{t('video.tips', 'Tips & Examples')}</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium mb-2">{t('video.promptTips', 'Effective Prompts')}</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="bg-[#00FF88]/20 text-[#00FF88] rounded-full w-5 h-5 flex items-center justify-center mr-2 shrink-0">1</span>
                  {t('video.tip1', 'Describe camera movements (pan, zoom, tracking shot)')}
                </li>
                <li className="flex items-start">
                  <span className="bg-[#00FF88]/20 text-[#00FF88] rounded-full w-5 h-5 flex items-center justify-center mr-2 shrink-0">2</span>
                  {t('video.tip2', 'Specify lighting conditions and time of day')}
                </li>
                <li className="flex items-start">
                  <span className="bg-[#00FF88]/20 text-[#00FF88] rounded-full w-5 h-5 flex items-center justify-center mr-2 shrink-0">3</span>
                  {t('video.tip3', 'Reference film styles or directors for specific looks')}
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">{t('video.examples', 'Example Prompts')}</h3>
              <div className="space-y-2">
                {[
                  t('video.example1', 'A drone shot flying over a mountain range at sunset with golden light'),
                  t('video.example2', 'Timelapse of a blooming flower in a garden, close-up macro shot'),
                  t('video.example3', 'A cyberpunk city street at night with neon lights and rain')
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 border-white/10 hover:bg-white/5"
                    onClick={() => setPrompt(example)}
                  >
                    <Video className="h-3.5 w-3.5 mr-2 shrink-0 text-[#00FF88]" />
                    <span className="line-clamp-2 text-sm">{example}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p className="mb-2 font-medium text-white">{t('video.note', 'Note:')}</p>
              <p>{t('video.noteContent', 'Longer videos and higher quality settings will consume more credits but produce better results.')}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}