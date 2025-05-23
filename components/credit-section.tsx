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
          >
            <Card className={cn(
              "relative h-full border transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
              tier.isPopular ? "border-[#FF2D7C]" : "border-border hover:border-primary/50"
            )}>
              {tier.isPopular && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <Badge className="bg-[#FF2D7C] hover:bg-[#FF2D7C] px-3 py-1">
                    <Sparkles className="h-3.5 w-3.5 mr-1" /> {t('pricing.mostPopular', 'Most Popular')}
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{tier.name}</span>
                  <span className="text-2xl">{tier.price}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-[#00F7FF] mb-1">{tier.credits}</div>
                  <div className="text-sm text-muted-foreground">{t('pricing.creditsIncluded', 'Credits Included')}</div>
                </div>
                <ul className="space-y-2">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-[#00FF88] mr-2 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={cn(
                    "w-full",
                    tier.isPopular 
                      ? "bg-[#FF2D7C] hover:bg-[#FF2D7C]/80" 
                      : "bg-primary hover:bg-primary/80"
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