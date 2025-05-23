'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from '@/lib/motion-mock';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  CopyPlus,
  Sparkles,
  Dice5,
  RefreshCw,
  ImagePlus,
  History,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageParams {
  prompt: string;
  aspect_ratio: keyof typeof aspectRatioOptions;
  num_outputs: number;
  num_inference_steps: number;
  seed: number;
  output_format: string;
  output_quality: number;
  megapixels: number;
}

const aspectRatioOptions = {
  '1:1': { width: 512, height: 512, label: '1:1 Square' },
  '16:9': { width: 682, height: 384, label: '16:9 Landscape' },
  '9:16': { width: 384, height: 682, label: '9:16 Portrait' },
  '4:3': { width: 590, height: 442, label: '4:3 Classic' },
  '3:4': { width: 442, height: 590, label: '3:4 Portrait' }
} as const;

export default function ImagePage() {
  const { t } = useTranslation();
  const [params, setParams] = useState<ImageParams>({
    prompt: '',
    aspect_ratio: '1:1',
    num_outputs: 1,
    num_inference_steps: 4,
    seed: Math.floor(Math.random() * 1000000),
    output_format: 'webp',
    output_quality: 90,
    megapixels: 1,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [recentSeeds, setRecentSeeds] = useState<number[]>([]);
  const generateButtonRef = useRef<HTMLButtonElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / params.num_inference_steps / 10);
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsGenerating(false);
              // Mock image generation with placeholder images
              const newImages = Array(params.num_outputs).fill(0).map((_, i) =>
                `https://picsum.photos/seed/${params.seed + i}/${aspectRatioOptions[params.aspect_ratio].width}/${aspectRatioOptions[params.aspect_ratio].height}`
              );
              setGeneratedImages(newImages);
              setRecentSeeds(prev => {
                const updated = [params.seed, ...prev].slice(0, 10);
                const uniqueSeeds = Array.from(new Set(updated)) as number[];
                return uniqueSeeds;
              });
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
  }, [isGenerating, params.num_inference_steps, params.num_outputs, params.seed, params.aspect_ratio]);

  const handleGenerate = () => {
    if (isGenerating) return;

    if (params.prompt.trim() === '') {
      alert('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
  };

  const handleRandomSeed = () => {
    setParams({ ...params, seed: Math.floor(Math.random() * 1000000) });
  };

  const handleMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      if (isGenerating) {
        setIsGenerating(false);
        setProgress(0);
      }
    }, 1000);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const downloadImage = (url: string, index: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-${params.seed}-${index}.${params.output_format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-[calc(100vh-120px)]">
      <h1 className="text-3xl font-bold mb-4">{t('image.title', 'Image Generation')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 p-6 light-theme-card dark:border-white/10 dark:bg-black/20 backdrop-blur-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {t('image.prompt', 'Prompt')}
            </label>
            <Textarea
              placeholder={t('image.promptPlaceholder', 'Describe the image you want to generate...')}
              value={params.prompt}
              onChange={(e) => setParams({ ...params, prompt: e.target.value })}
              className="h-20 bg-background/50 dark:bg-black/20 border-[#FF2D7C]/20 dark:border-[#FF2D7C]/30 focus-visible:ring-[#FF2D7C] focus-visible:border-[#FF2D7C]/30"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('image.aspectRatio', 'Aspect Ratio')}
              </label>
              <Select
                value={params.aspect_ratio}
                onValueChange={(value) => setParams({ ...params, aspect_ratio: value as keyof typeof aspectRatioOptions })}
              >
                <SelectTrigger className="bg-background/50 dark:bg-black/20 border-[#FF2D7C]/20 dark:border-[#FF2D7C]/30 focus:border-[#FF2D7C]/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(aspectRatioOptions).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('image.numOutputs', 'Number of Images')} ({params.num_outputs})
              </label>
              <Slider
                value={[params.num_outputs]}
                min={1}
                max={4}
                step={1}
                onValueChange={(value) => setParams({ ...params, num_outputs: value[0] })}
                className="py-2 "
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('image.inferenceSteps', 'Quality Steps')} ({params.num_inference_steps})
              </label>
              <Slider
                value={[params.num_inference_steps]}
                min={1}
                max={8}
                step={1}
                onValueChange={(value) => setParams({ ...params, num_inference_steps: value[0] })}
                className="py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 flex justify-between">
                <span>{t('image.seed', 'Seed')}</span>
                <button
                  onClick={handleRandomSeed}
                  className="text-xs text-[#FF2D7C] hover:text-[#FF2D7C]/80 flex items-center"
                >
                  <Dice5 className="h-3 w-3 mr-1" />
                  {t('image.randomize', 'Randomize')}
                </button>
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={params.seed}
                  onChange={(e) => setParams({ ...params, seed: parseInt(e.target.value) || 0 })}
                  className="bg-background/50 dark:bg-black/20 border-[#FF2D7C]/20 dark:border-[#FF2D7C]/30 focus-visible:ring-[#FF2D7C] focus-visible:border-[#FF2D7C]/30"
                />

              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('image.outputFormat', 'Output Format')}
              </label>
              <Select
                value={params.output_format}
                onValueChange={(value) => setParams({ ...params, output_format: value })}
              >
                <SelectTrigger className="bg-background/50 dark:bg-black/20 border-[#FF2D7C]/20 dark:border-[#FF2D7C]/30 focus:border-[#FF2D7C]/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('image.outputQuality', 'Output Quality')} ({params.output_quality}%)
              </label>
              <Slider
                value={[params.output_quality]}
                min={10}
                max={100}
                step={10}
                onValueChange={(value) => setParams({ ...params, output_quality: value[0] })}
                className="py-2"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {t('image.credits', 'Credits: ')}
              <span className="font-medium text-[#FF2D7C]">
                {params.num_outputs * Math.ceil(params.num_inference_steps / 2)}
              </span>
            </div>
            <Button
              ref={generateButtonRef}
              onClick={handleGenerate}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              disabled={params.prompt.trim() === '' || isGenerating}
              className="bg-[#FF2D7C] hover:bg-[#FF2D7C]/80 text-white relative overflow-hidden"
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
                    {t('image.generating', 'Generating...')}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('image.generate', 'Generate Image')}
                  </>
                )}
              </span>
            </Button>
          </div>

          {isGenerating && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>{t('image.holdToCancel', 'Hold the Generate button to cancel')}</p>
            </div>
          )}

          {generatedImages.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3">{t('image.results', 'Generated Images')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {generatedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Generated image ${index + 1}`}
                      className="w-full rounded-lg object-cover border border-[#FF2D7C]/20 dark:border-[#FF2D7C]/30"
                      style={{
                        aspectRatio: params.aspect_ratio.replace(':', '/'),
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white text-white hover:bg-white/20"
                        onClick={() => downloadImage(image, index)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {t('image.download', 'Download')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white text-white hover:bg-white/20"
                      >
                        <CopyPlus className="h-4 w-4 mr-1" />
                        {t('image.variations', 'Variations')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="col-span-1 p-6 light-theme-card dark:border-white/10 dark:bg-black/20 backdrop-blur-sm flex flex-col">
          <h2 className="text-xl font-semibold mb-4">{t('image.preview', 'Photo Preview')}</h2>

          <div className="flex-grow flex flex-col items-center justify-center">
            {params.prompt ? (
              <div
                className={cn(
                  "relative border-2 border-dashed border-[#FF2D7C]/30 dark:border-[#FF2D7C]/40 rounded-lg flex items-center justify-center bg-muted/30 dark:bg-black/30",
                  isGenerating && "animate-pulse"
                )}
                style={{
                  width: `${Math.min(300, aspectRatioOptions[params.aspect_ratio].width / 1.5)}px`,
                  height: `${Math.min(300, aspectRatioOptions[params.aspect_ratio].height / 1.5)}px`,
                  aspectRatio: params.aspect_ratio.replace(':', '/'),
                }}
              >
                {generatedImages.length > 0 ? (
                  <img
                    src={generatedImages[0]}
                    alt="Latest generated image"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImagePlus className="h-10 w-10 text-muted-foreground dark:text-white/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      {isGenerating
                        ? t('image.creating', 'Creating your image...')
                        : t('image.readyToGenerate', 'Photo ready')}
                    </p>
                    {isGenerating && (
                      <div className="mt-3 w-full bg-muted dark:bg-white/10 rounded-full h-1.5 border border-[#FF2D7C]/20">
                        <div
                          className="bg-gradient-to-r from-[#FF2D7C] to-[#FF2D7C]/80 h-full rounded-full transition-all shadow-sm"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8">
                <Sparkles className="h-12 w-12 text-[#FF2D7C]/30 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">
                  {t('image.enterPrompt', 'Enter a prompt')}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {t('image.promptHint', 'Describe what you want to see, and the AI will create it for you')}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-md font-medium mb-2">{t('image.promptTips', 'Prompt Tips')}</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="bg-[#FF2D7C]/20 text-[#FF2D7C] rounded-full w-5 h-5 flex items-center justify-center mr-2 shrink-0">1</span>
                  {t('image.tip1', 'Be specific about subject, style, lighting, and mood')}
                </li>
                <li className="flex items-start">
                  <span className="bg-[#FF2D7C]/20 text-[#FF2D7C] rounded-full w-5 h-5 flex items-center justify-center mr-2 shrink-0">2</span>
                  {t('image.tip2', 'Include artist references for particular styles')}
                </li>
                <li className="flex items-start">
                  <span className="bg-[#FF2D7C]/20 text-[#FF2D7C] rounded-full w-5 h-5 flex items-center justify-center mr-2 shrink-0">3</span>
                  {t('image.tip3', 'Higher step count improves detail but uses more credits')}
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}