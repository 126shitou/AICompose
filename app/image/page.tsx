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
  useSeed: boolean;
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
    useSeed: false,
    output_format: 'webp',
    output_quality: 90,
    megapixels: 1,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const generateButtonRef = useRef<HTMLButtonElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Mock user ID - replace with actual user authentication
  const userId = 'user_123'; // TODO: Get from user context/auth

  const handleGenerate = async () => {
    if (isGenerating) return;

    if (params.prompt.trim() === '') {
      alert('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setError('');

    try {
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      const response = await fetch('/api/gen-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          prompt: params.prompt,
          aspect_ratio: params.aspect_ratio,
          num_outputs: params.num_outputs,
          num_inference_steps: params.num_inference_steps,
          ...(params.useSeed && { seed: params.seed }),
          output_format: params.output_format,
          output_quality: params.output_quality,
          megapixels: params.megapixels.toString(),
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate image');
      }

      if (result.success && result.data.images) {
        setGeneratedImages(result.data.images);
        setSelectedImageIndex(0);
      } else {
        throw new Error('No images generated');
      }

    } catch (error: any) {
      console.error('Generation error:', error);
      setError(error.message || 'Failed to generate image');
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
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

  const downloadImage = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `image-${params.seed}-${index}.${params.output_format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)]">
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">
                  {t('image.seed', 'Seed Control')}
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={params.useSeed}
                    onChange={(e) => setParams({ ...params, useSeed: e.target.checked })}
                    className="mr-2 h-4 w-4 text-[#FF2D7C] border-gray-300 rounded focus:ring-[#FF2D7C] focus:ring-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {t('image.useSeed', 'Use Custom Seed')}
                  </span>
                </label>
              </div>

              {params.useSeed && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{t('image.seedValue', 'Seed Value')}</span>
                    <button
                      onClick={handleRandomSeed}
                      className="text-xs text-[#FF2D7C] hover:text-[#FF2D7C]/80 flex items-center"
                    >
                      <Dice5 className="h-3 w-3 mr-1" />
                      {t('image.randomize', 'Randomize')}
                    </button>
                  </div>
                  <Input
                    type="number"
                    value={params.seed}
                    onChange={(e) => setParams({ ...params, seed: parseInt(e.target.value) || 0 })}
                    className="bg-background/50 dark:bg-black/20 border-[#FF2D7C]/20 dark:border-[#FF2D7C]/30 focus-visible:ring-[#FF2D7C] focus-visible:border-[#FF2D7C]/30"
                    placeholder="Enter seed number"
                  />
                </div>
              )}
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

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('image.num_inference_steps', 'Number Inference Steps')}
              </label>
              <Select
                value={params.megapixels.toString()}
                onValueChange={(value) => setParams({ ...params, megapixels: parseFloat(value) })}
              >
                <SelectTrigger className="bg-background/50 dark:bg-black/20 border-[#FF2D7C]/20 dark:border-[#FF2D7C]/30 focus:border-[#FF2D7C]/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="0.25">0.25</SelectItem>
                </SelectContent>
              </Select>
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

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
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
                    src={generatedImages[selectedImageIndex] || generatedImages[0]}
                    alt="Selected generated image"
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

          {/* Image Selection Grid */}
          {generatedImages.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">{t('image.selectImage', 'Select Image')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {generatedImages.map((image, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                      selectedImageIndex === index
                        ? "border-[#FF2D7C] shadow-lg"
                        : "border-[#FF2D7C]/20 hover:border-[#FF2D7C]/40"
                    )}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`Generated image ${index + 1}`}
                      className="w-full h-16 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {selectedImageIndex === index ? '✓' : index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


        </Card>
      </div>

      {/* Single Image Display Area */}
      {generatedImages.length > 0 && (
        <Card className="mt-6 p-6 light-theme-card dark:border-white/10 dark:bg-black/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">{t('image.selectedImage', 'Selected Image')}</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {selectedImageIndex + 1} of {generatedImages.length}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="border-[#FF2D7C]/40 text-[#FF2D7C] hover:bg-[#FF2D7C]/10"
                onClick={() => downloadImage(generatedImages[selectedImageIndex], selectedImageIndex)}
              >
                <Download className="h-4 w-4 mr-1" />
                {t('image.download', 'Download')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#FF2D7C]/40 text-[#FF2D7C] hover:bg-[#FF2D7C]/10"
              >
                <CopyPlus className="h-4 w-4 mr-1" />
                {t('image.variations', 'Variations')}
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative max-w-2xl">
              <img
                src={generatedImages[selectedImageIndex]}
                alt={`Selected image ${selectedImageIndex + 1}`}
                className="w-full rounded-lg border border-[#FF2D7C]/20 dark:border-[#FF2D7C]/30 shadow-lg"
                style={{
                  aspectRatio: params.aspect_ratio.replace(':', '/'),
                }}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}