'use client';

import { useState } from 'react';
import { motion } from '@/lib/motion-mock';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    CreditCard,
    Download,
    Calendar,
    DollarSign,
    TrendingUp,
    ArrowLeft,
    Star,
    Crown,
    Zap,
    Clock,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface BillingData {
    currentPlan: {
        name: string;
        price: number;
        credits: number;
        billingCycle: 'monthly' | 'yearly';
        nextBillingDate: string;
        status: 'active' | 'cancelled' | 'past_due';
    };
    usageStats: {
        creditsUsed: number;
        creditsRemaining: number;
        usagePercentage: number;
        resetDate: string;
    };
    paymentMethod: {
        type: 'card' | 'paypal';
        last4: string;
        expiryMonth: number;
        expiryYear: number;
        brand: string;
    };
}

interface InvoiceItem {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    description: string;
    downloadUrl?: string;
}

export default function BillingPage() {
    const { t } = useTranslation();

    const [billingData] = useState<BillingData>({
        currentPlan: {
            name: 'Pro Plan',
            price: 29.99,
            credits: 500,
            billingCycle: 'monthly',
            nextBillingDate: '2024-03-15',
            status: 'active'
        },
        usageStats: {
            creditsUsed: 325,
            creditsRemaining: 175,
            usagePercentage: 65,
            resetDate: '2024-03-15'
        },
        paymentMethod: {
            type: 'card',
            last4: '4242',
            expiryMonth: 12,
            expiryYear: 2025,
            brand: 'Visa'
        }
    });

    const [invoiceHistory] = useState<InvoiceItem[]>([
        {
            id: 'inv_001',
            date: '2024-02-15',
            amount: 29.99,
            status: 'paid',
            description: 'Pro Plan - Monthly Subscription',
            downloadUrl: '#'
        },
        {
            id: 'inv_002',
            date: '2024-01-15',
            amount: 29.99,
            status: 'paid',
            description: 'Pro Plan - Monthly Subscription',
            downloadUrl: '#'
        },
        {
            id: 'inv_003',
            date: '2023-12-15',
            amount: 29.99,
            status: 'paid',
            description: 'Pro Plan - Monthly Subscription',
            downloadUrl: '#'
        },
        {
            id: 'inv_004',
            date: '2023-11-15',
            amount: 29.99,
            status: 'paid',
            description: 'Pro Plan - Monthly Subscription',
            downloadUrl: '#'
        },
        {
            id: 'inv_005',
            date: '2023-10-15',
            amount: 19.99,
            status: 'paid',
            description: 'Starter Plan - Monthly Subscription',
            downloadUrl: '#'
        }
    ]);

    const availablePlans = [
        {
            name: 'Starter',
            price: 9.99,
            credits: 100,
            features: ['Basic AI chat', '5 images/day', '2 audio/day'],
            color: 'gray'
        },
        {
            name: 'Pro',
            price: 29.99,
            credits: 500,
            features: ['Advanced AI chat', '20 images/day', '10 videos/day', '20 audio/day'],
            color: 'blue',
            popular: true
        },
        {
            name: 'Enterprise',
            price: 99.99,
            credits: 2000,
            features: ['Unlimited everything', 'Priority support', 'Custom models'],
            color: 'purple'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'failed':
            case 'past_due':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
        }
    };

    const getPlanColor = (color: string) => {
        switch (color) {
            case 'blue':
                return 'from-blue-500 to-blue-600';
            case 'purple':
                return 'from-purple-500 to-purple-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div className="min-h-[calc(100vh-120px)] p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/profile">
                            <Button variant="outline" size="icon" className="dark:border-gray-600/50 dark:hover:bg-gray-700/50">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold dark:text-gray-200">Billing & Subscriptions</h1>
                            <p className="text-muted-foreground dark:text-gray-400">Manage your plan, payments, and billing history</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Current Plan & Usage */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Plan */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                    <Crown className="h-5 w-5 text-[#00F7FF]" />
                                    Current Plan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-bold dark:text-gray-200">{billingData.currentPlan.name}</h3>
                                            <Badge className={getStatusColor(billingData.currentPlan.status)}>
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                {billingData.currentPlan.status}
                                            </Badge>
                                        </div>
                                        <p className="text-3xl font-bold text-[#00F7FF]">
                                            ${billingData.currentPlan.price}
                                            <span className="text-sm font-normal text-muted-foreground dark:text-gray-400">
                                                /{billingData.currentPlan.billingCycle === 'monthly' ? 'month' : 'year'}
                                            </span>
                                        </p>
                                        <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
                                            Next billing: {new Date(billingData.currentPlan.nextBillingDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold dark:text-gray-200">{billingData.currentPlan.credits}</div>
                                        <div className="text-sm text-muted-foreground dark:text-gray-400">credits included</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button className="w-full bg-gradient-to-r from-[#00F7FF] to-[#00F7FF]/80 hover:from-[#00F7FF]/90 hover:to-[#00F7FF]/70 text-black">
                                        <Zap className="h-4 w-4 mr-2" />
                                        Upgrade Plan
                                    </Button>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1 dark:border-gray-600/50 dark:text-gray-300 dark:hover:bg-gray-700/50">
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Change Plan
                                        </Button>
                                        <Button variant="outline" className="flex-1 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600/50 dark:text-red-400 dark:hover:bg-red-900/30">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Usage Statistics */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                    <TrendingUp className="h-5 w-5 text-[#00F7FF]" />
                                    Usage This Month
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium dark:text-gray-300">Credits Used</span>
                                        <span className="text-sm dark:text-gray-300">
                                            {billingData.usageStats.creditsUsed} / {billingData.currentPlan.credits}
                                        </span>
                                    </div>
                                    <Progress value={billingData.usageStats.usagePercentage} className="h-3" />
                                    <div className="flex items-center justify-between text-sm text-muted-foreground dark:text-gray-400">
                                        <span>{billingData.usageStats.creditsRemaining} credits remaining</span>
                                        <span>Resets {new Date(billingData.usageStats.resetDate).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-gradient-to-br from-[#00F7FF]/10 to-[#00F7FF]/5 border border-[#00F7FF]/20 rounded-lg dark:from-[#00F7FF]/15 dark:to-[#00F7FF]/5 dark:border-[#00F7FF]/30">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium dark:text-gray-200">Need more credits?</p>
                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Purchase additional credits or upgrade your plan</p>
                                        </div>
                                        <Button size="sm" className="bg-[#00F7FF] hover:bg-[#00F7FF]/80 text-black">
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Buy Credits
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                    <CreditCard className="h-5 w-5 text-[#00F7FF]" />
                                    Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs flex items-center justify-center font-bold">
                                            {billingData.paymentMethod.brand.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium dark:text-gray-200">
                                                •••• •••• •••• {billingData.paymentMethod.last4}
                                            </p>
                                            <p className="text-sm text-muted-foreground dark:text-gray-400">
                                                Expires {billingData.paymentMethod.expiryMonth}/{billingData.paymentMethod.expiryYear}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="dark:border-gray-600/50 dark:text-gray-300 dark:hover:bg-gray-700/50">
                                        Update
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Available Plans */}
                    <div className="space-y-6">
                        <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                    <Star className="h-5 w-5 text-[#00F7FF]" />
                                    Available Plans
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {availablePlans.map((plan) => (
                                    <div
                                        key={plan.name}
                                        className={`p-4 rounded-lg border ${
                                            plan.name === billingData.currentPlan.name
                                                ? 'border-[#00F7FF] bg-[#00F7FF]/5 dark:bg-[#00F7FF]/10'
                                                : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium dark:text-gray-200">{plan.name}</h4>
                                                    {plan.popular && (
                                                        <Badge className="bg-[#FF2D7C] hover:bg-[#FF2D7C] text-white text-xs">
                                                            Popular
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-lg font-bold text-[#00F7FF]">${plan.price}/mo</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium dark:text-gray-300">{plan.credits}</div>
                                                <div className="text-xs text-muted-foreground dark:text-gray-400">credits</div>
                                            </div>
                                        </div>
                                        
                                        <ul className="text-xs space-y-1 mb-3 dark:text-gray-400">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        {plan.name === billingData.currentPlan.name ? (
                                            <Badge className="w-full justify-center bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                Current Plan
                                            </Badge>
                                        ) : (
                                            <Button 
                                                size="sm" 
                                                className={`w-full bg-gradient-to-r ${getPlanColor(plan.color)} text-white hover:opacity-90`}
                                            >
                                                Switch to {plan.name}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Billing History */}
                <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                            <Calendar className="h-5 w-5 text-[#00F7FF]" />
                            Billing History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {invoiceHistory.map((invoice) => (
                                <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="h-4 w-4 text-green-500" />
                                            <div>
                                                <p className="font-medium dark:text-gray-200">${invoice.amount}</p>
                                                <p className="text-sm text-muted-foreground dark:text-gray-400">{invoice.date}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm dark:text-gray-300">{invoice.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={getStatusColor(invoice.status)}>
                                            {invoice.status}
                                        </Badge>
                                        {invoice.downloadUrl && (
                                            <Button variant="ghost" size="sm" className="dark:text-gray-300 dark:hover:bg-gray-700/50">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 