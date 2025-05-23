'use client';

import { motion } from '@/lib/motion-mock';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  credits: number;
  features: string[];
  isPopular?: boolean;
}

export function CreditSection() {
  const { t } = useTranslation();

  const pricingTiers: PricingTier[] = [
    {
      name: t('pricing.basic.name', 'Starter'),
      price: '$9.99',
      description: t('pricing.basic.description', 'Perfect for beginners exploring AI capabilities'),
      credits: 100,
      features: [
        t('pricing.basic.feature1', 'Basic AI chat access'),
        t('pricing.basic.feature2', '5 image generations per day'),
        t('pricing.basic.feature3', '2 audio generations per day'),
        t('pricing.basic.feature4', 'Standard response time'),
      ]
    },
    {
      name: t('pricing.pro.name', 'Creator'),
      price: '$29.99',
      description: t('pricing.pro.description', 'Ideal for content creators and professionals'),
      credits: 500,
      features: [
        t('pricing.pro.feature1', 'Advanced AI chat with knowledge sources'),
        t('pricing.pro.feature2', '20 image generations per day'),
        t('pricing.pro.feature3', '10 video generations per day'),
        t('pricing.pro.feature4', '20 audio generations per day'),
        t('pricing.pro.feature5', 'Priority response time'),
      ],
      isPopular: true
    },
    {
      name: t('pricing.enterprise.name', 'Enterprise'),
      price: '$99.99',
      description: t('pricing.enterprise.description', 'For teams and high-volume needs'),
      credits: 2000,
      features: [
        t('pricing.enterprise.feature1', 'Unlimited AI chat with all features'),
        t('pricing.enterprise.feature2', 'Unlimited image generations'),
        t('pricing.enterprise.feature3', 'Unlimited video generations'),
        t('pricing.enterprise.feature4', 'Unlimited audio generations'),
        t('pricing.enterprise.feature5', 'Instant response time'),
        t('pricing.enterprise.feature6', 'Dedicated support'),
      ]
    }
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t('pricing.title', 'Choose Your Plan')}
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('pricing.subtitle', 'Select the perfect credit package for your creative needs')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
          >
            <Card className={cn(
              "relative h-full border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col light-theme-card dark:bg-gray-900/40 dark:border-gray-700/40",
              tier.isPopular 
                ? "border-[#FF2D7C] shadow-[0_0_20px_#FF2D7C/20] dark:shadow-[0_0_20px_#FF2D7C/15] scale-105" 
                : "border-border hover:border-primary/50 dark:hover:border-gray-500/50"
            )}>
              {tier.isPopular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <Badge className="bg-gradient-to-r from-[#FF2D7C] to-[#FF2D7C]/80 hover:from-[#FF2D7C]/90 hover:to-[#FF2D7C]/70 px-4 py-2 text-white shadow-lg">
                    <Sparkles className="h-4 w-4 mr-2" /> 
                    {t('pricing.mostPopular', 'Most Popular')}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="mb-4">
                  <CardTitle className="text-2xl font-bold mb-2 dark:text-gray-200">
                    {tier.name}
                  </CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={cn(
                      "text-4xl font-bold",
                      tier.isPopular ? "text-[#FF2D7C]" : "text-[#00F7FF]"
                    )}>
                      {tier.price}
                    </span>
                    <span className="text-sm text-muted-foreground dark:text-gray-400">/month</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                  {tier.description}
                </p>
              </CardHeader>
              
              <CardContent className="flex-grow px-6">
                <div className="text-center mb-6 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/30 border border-gray-200/50 dark:border-gray-600/30">
                  <div className={cn(
                    "text-3xl font-bold mb-1",
                    tier.isPopular ? "text-[#FF2D7C]" : "text-[#00F7FF]"
                  )}>
                    {tier.credits.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground dark:text-gray-400">
                    {t('pricing.creditsIncluded', 'Credits Included')}
                  </div>
                </div>
                
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00FF88]/20 dark:bg-[#00FF88]/25 flex items-center justify-center mt-0.5">
                        <Check className="h-3 w-3 text-[#00FF88]" />
                      </div>
                      <span className="text-sm leading-relaxed dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="pt-6 px-6 pb-6">
                <Button 
                  className={cn(
                    "w-full h-12 text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl",
                    tier.isPopular 
                      ? "bg-gradient-to-r from-[#FF2D7C] to-[#FF2D7C]/80 hover:from-[#FF2D7C]/90 hover:to-[#FF2D7C]/70 text-white border-0 hover:scale-105" 
                      : "bg-gradient-to-r from-[#00F7FF] to-[#00F7FF]/80 hover:from-[#00F7FF]/90 hover:to-[#00F7FF]/70 text-black border-0 hover:scale-105"
                  )}
                >
                  {t('pricing.selectPlan', 'Select Plan')}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}