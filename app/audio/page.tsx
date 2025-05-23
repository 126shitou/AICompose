'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Play,
  Pause,
  Volume2,
  Mic,
  RefreshCw,
  Sparkles,
  Crown,
  Star,
  Globe,
  User,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Voice models data
const allVoices = [
  // English - British Male
  { id: 'bm_lewis', nameKey: 'voice.bm_lewis', gender: 'male', premium: false, sample: '#', avatar: 'lewis', rating: 4.8, language: 'en' },
  { id: 'bm_daniel', nameKey: 'voice.bm_daniel', gender: 'male', premium: false, sample: '#', avatar: 'daniel', rating: 4.7, language: 'en' },
  { id: 'bm_george', nameKey: 'voice.bm_george', gender: 'male', premium: true, sample: '#', avatar: 'george', rating: 4.9, language: 'en' },
  // English - British Female
  { id: 'bf_emma', nameKey: 'voice.bf_emma', gender: 'female', premium: false, sample: '#', avatar: 'emma', rating: 4.7, language: 'en' },
  { id: 'bf_alice', nameKey: 'voice.bf_alice', gender: 'female', premium: false, sample: '#', avatar: 'alice', rating: 4.8, language: 'en' },
  { id: 'bf_lily', nameKey: 'voice.bf_lily', gender: 'female', premium: true, sample: '#', avatar: 'lily', rating: 4.9, language: 'en' },
  // Japanese - Male
  { id: 'jm_kumo', nameKey: 'voice.jm_kumo', gender: 'male', premium: false, sample: '#', avatar: 'kumo', rating: 4.7, language: 'ja' },
  // Japanese - Female
  { id: 'jf_tebukuro', nameKey: 'voice.jf_tebukuro', gender: 'female', premium: false, sample: '#', avatar: 'tebukuro', rating: 4.8, language: 'ja' },
  { id: 'jf_alpha', nameKey: 'voice.jf_alpha', gender: 'female', premium: true, sample: '#', avatar: 'alpha', rating: 4.9, language: 'ja' },
  { id: 'jf_gongitsune', nameKey: 'voice.jf_gongitsune', gender: 'female', premium: true, sample: '#', avatar: 'gongitsune', rating: 4.8, language: 'ja' },
  // Chinese - Male
  { id: 'zm_yunxia', nameKey: 'voice.zm_yunxia', gender: 'male', premium: false, sample: '#', avatar: 'yunxia', rating: 4.8, language: 'zh' },
  { id: 'zm_yunxi', nameKey: 'voice.zm_yunxi', gender: 'male', premium: true, sample: '#', avatar: 'yunxi', rating: 4.9, language: 'zh' },
  { id: 'zm_yunyang', nameKey: 'voice.zm_yunyang', gender: 'male', premium: true, sample: '#', avatar: 'yunyang', rating: 4.8, language: 'zh' },
  // Chinese - Female
  { id: 'zf_xiaobei', nameKey: 'voice.zf_xiaobei', gender: 'female', premium: false, sample: '#', avatar: 'xiaobei', rating: 4.7, language: 'zh' },
  { id: 'zf_xiaoni', nameKey: 'voice.zf_xiaoni', gender: 'female', premium: true, sample: '#', avatar: 'xiaoni', rating: 4.9, language: 'zh' },
  // French - Female
  { id: 'ff_siwis', nameKey: 'voice.ff_siwis', gender: 'female', premium: true, sample: '#', avatar: 'siwis', rating: 4.8, language: 'fr' },
];

const languageNames = {
  en: 'English',
  ja: '日本語',
  zh: '中文',
  fr: 'Français'
};

interface AudioParams {
  text: string;
  voice: string;
  speed: number;
  pitch: number;
  volume: number;
  output_format: string;
}

export default function AudioPage() {
  const { t } = useTranslation();
  const [params, setParams] = useState<AudioParams>({
    text: '',
    voice: 'bf_emma',
    speed: 1.0,
    pitch: 1.0,
    volume: 1.0,
    output_format: 'mp3',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingSample, setIsPlayingSample] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const generateButtonRef = useRef<HTMLButtonElement>(null);

  // Filter voices based on selected language and gender
  const filteredVoices = allVoices.filter(voice => {
    const languageMatch = selectedLanguage === 'all' || voice.language === selectedLanguage;
    const genderMatch = selectedGender === 'all' || voice.gender === selectedGender;
    return languageMatch && genderMatch;
  });

  const selectedVoice = allVoices.find(v => v.id === params.voice) || allVoices[0];

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsGenerating(false);
              // Mock audio generation
              setGeneratedAudio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isGenerating]);

  const handleGenerate = () => {
    if (isGenerating) return;

    if (params.text.trim() === '') {
      alert('Please enter text to convert');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlaySample = (voiceId: string) => {
    // Mock sample play
    setIsPlayingSample(voiceId);
    setTimeout(() => {
      setIsPlayingSample(null);
    }, 2000);
  };

  const downloadAudio = async () => {
    if (!generatedAudio) return;
    
    try {
      // Fetch the audio file
      const response = await fetch(generatedAudio);
      if (!response.ok) {
        throw new Error('Failed to fetch audio file');
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `speech-${params.voice}-${Date.now()}.${params.output_format}`;
      a.style.display = 'none';
      
      // Add to DOM, click, and remove
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading audio:', error);
      alert('Failed to download audio. Please try again.');
    }
  };

  const getVoiceDisplayName = (voice: any) => {
    // Mock translation - in real app this would use t()
    const names = {
      'voice.bm_lewis': 'Lewis',
      'voice.bm_daniel': 'Daniel', 
      'voice.bm_george': 'George',
      'voice.bf_emma': 'Emma',
      'voice.bf_alice': 'Alice',
      'voice.bf_lily': 'Lily',
      'voice.jm_kumo': 'Kumo',
      'voice.jf_tebukuro': 'Tebukuro',
      'voice.jf_alpha': 'Alpha',
      'voice.jf_gongitsune': 'Gongitsune',
      'voice.zm_yunxia': 'Yunxia',
      'voice.zm_yunxi': 'Yunxi',
      'voice.zm_yunyang': 'Yunyang',
      'voice.zf_xiaobei': 'Xiaobei',
      'voice.zf_xiaoni': 'Xiaoni',
      'voice.ff_siwis': 'Siwis'
    };
    return names[voice.nameKey as keyof typeof names] || voice.id;
  };

  return (
    <div className="min-h-[calc(100vh-120px)]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Input and Parameters */}
        <Card className="col-span-1 lg:col-span-2 p-6 light-theme-card dark:border-white/10 dark:bg-black/20 backdrop-blur-sm">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {t('audio.text', 'Text to Convert')}
            </label>
            <Textarea
              placeholder={t('audio.textPlaceholder', 'Enter the text you want to convert to speech...')}
              value={params.text}
              onChange={(e) => setParams({ ...params, text: e.target.value })}
              className="h-32 bg-background/50 dark:bg-black/20 border-[#F59E0B]/20 dark:border-[#F59E0B]/30 focus-visible:ring-[#F59E0B] focus-visible:border-[#F59E0B]/30"
            />
            <div className="mt-2 text-sm text-muted-foreground">
              {params.text.length} characters
            </div>
          </div>

          {/* Voice Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">
                {t('audio.selectVoice', 'Select Voice')}
              </label>
              <div className="flex gap-2">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32 bg-background/50 dark:bg-black/20 border-[#F59E0B]/20 dark:border-[#F59E0B]/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger className="w-24 bg-background/50 dark:bg-black/20 border-[#F59E0B]/20 dark:border-[#F59E0B]/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {filteredVoices.map((voice) => (
                <div
                  key={voice.id}
                  className={cn(
                    "p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                    params.voice === voice.id
                      ? "border-[#F59E0B] bg-[#F59E0B]/10"
                      : "border-[#F59E0B]/20 hover:border-[#F59E0B]/40"
                  )}
                  onClick={() => setParams({ ...params, voice: voice.id })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
                        {voice.gender === 'male' ? <User className="h-4 w-4 text-[#F59E0B]" /> : <Users className="h-4 w-4 text-[#F59E0B]" />}
                      </div>
                      <div>
                        <div className="font-medium text-sm flex items-center gap-1">
                          {getVoiceDisplayName(voice)}
                          {voice.premium && <Crown className="h-3 w-3 text-[#F59E0B]" />}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {languageNames[voice.language as keyof typeof languageNames]}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-[#F59E0B]/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySample(voice.id);
                      }}
                    >
                      {isPlayingSample === voice.id ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-[#F59E0B]" />
                      <span className="text-xs">{voice.rating}</span>
                    </div>
                    {voice.premium && (
                      <Badge variant="secondary" className="text-xs bg-[#F59E0B]/20 text-[#F59E0B]">
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audio Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('audio.speed', 'Speed')} ({params.speed}x)
              </label>
              <Slider
                value={[params.speed]}
                min={0.5}
                max={2.0}
                step={0.1}
                onValueChange={(value) => setParams({ ...params, speed: value[0] })}
                className="py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('audio.pitch', 'Pitch')} ({params.pitch}x)
              </label>
              <Slider
                value={[params.pitch]}
                min={0.5}
                max={2.0}
                step={0.1}
                onValueChange={(value) => setParams({ ...params, pitch: value[0] })}
                className="py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('audio.outputFormat', 'Output Format')}
              </label>
              <Select
                value={params.output_format}
                onValueChange={(value) => setParams({ ...params, output_format: value })}
              >
                <SelectTrigger className="bg-background/50 dark:bg-black/20 border-[#F59E0B]/20 dark:border-[#F59E0B]/30 focus:border-[#F59E0B]/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp3">MP3</SelectItem>
                  <SelectItem value="wav">WAV</SelectItem>
                  <SelectItem value="ogg">OGG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {t('audio.credits', 'Credits: ')}
              <span className="font-medium text-[#F59E0B]">
                {Math.ceil(params.text.length / 100)}
              </span>
            </div>
            <Button
              ref={generateButtonRef}
              onClick={handleGenerate}
              disabled={params.text.trim() === '' || isGenerating}
              className="bg-[#F59E0B] hover:bg-[#F59E0B]/80 text-white relative overflow-hidden"
            >
              {isGenerating && (
                <div
                  className="absolute left-0 top-0 bottom-0 bg-white/20"
                  style={{ width: `${progress}%` }}
                />
              )}
              <span className="relative flex items-center">
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {t('audio.generating', 'Generating...')}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('audio.generate', 'Generate Speech')}
                  </>
                )}
              </span>
            </Button>
          </div>
        </Card>

        {/* Audio Preview */}
        <Card className="col-span-1 p-6 light-theme-card dark:border-white/10 dark:bg-black/20 backdrop-blur-sm flex flex-col">
          <h2 className="text-xl font-semibold mb-4">{t('audio.preview', 'Audio Preview')}</h2>

          <div className="flex-grow flex flex-col items-center justify-center">
            {params.text ? (
              <div className="w-full">
                {generatedAudio ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/40 flex items-center justify-center border-4 border-[#F59E0B]/30">
                        <Button
                          size="lg"
                          variant="ghost"
                          className="w-16 h-16 rounded-full bg-[#F59E0B] hover:bg-[#F59E0B]/80 text-white"
                          onClick={handlePlayPause}
                        >
                          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-medium text-[#F59E0B] mb-1">
                        {getVoiceDisplayName(selectedVoice)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {languageNames[selectedVoice.language as keyof typeof languageNames]} • {selectedVoice.gender}
                      </div>
                    </div>

                    <audio
                      ref={audioRef}
                      src={generatedAudio}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />

                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#F59E0B]/40 text-[#F59E0B] hover:bg-[#F59E0B]/10"
                        onClick={downloadAudio}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {t('audio.download', 'Download')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={cn(
                      "relative border-2 border-dashed border-[#F59E0B]/30 dark:border-[#F59E0B]/40 rounded-lg p-8 flex flex-col items-center justify-center bg-muted/30 dark:bg-black/30",
                      isGenerating && "animate-pulse"
                    )}
                  >
                    <Volume2 className="h-12 w-12 text-[#F59E0B]/50 mb-3" />
                    <p className="text-sm text-muted-foreground text-center mb-3">
                      {isGenerating
                        ? t('audio.creating', 'Creating your audio...')
                        : t('audio.readyToGenerate', 'Ready to generate')}
                    </p>
                    {isGenerating && (
                      <div className="w-full bg-muted dark:bg-white/10 rounded-full h-1.5 border border-[#F59E0B]/20">
                        <div
                          className="bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/80 h-full rounded-full transition-all shadow-sm"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8">
                <Mic className="h-12 w-12 text-[#F59E0B]/30 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">
                  {t('audio.enterText', 'Enter text to convert')}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {t('audio.textHint', 'Type or paste the text you want to convert to speech')}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
