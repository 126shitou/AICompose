'use client';

import { useState } from 'react';
import { motion } from '@/lib/motion-mock';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
    Settings,
    Bell,
    Palette,
    Globe,
    Shield,
    Database,
    Download,
    Trash2,
    RefreshCw,
    Volume2,
    Monitor,
    Smartphone,
    Mail,
    MessageSquare,
    Image as ImageIcon,
    Save,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    securityAlerts: boolean;
    weeklyDigest: boolean;
    productUpdates: boolean;
}

interface AppearanceSettings {
    theme: 'light' | 'dark' | 'system';
    language: string;
    fontSize: number;
    compactMode: boolean;
    animations: boolean;
}

interface PrivacySettings {
    profileVisibility: 'public' | 'private' | 'friends';
    dataCollection: boolean;
    personalization: boolean;
    thirdPartySharing: boolean;
}

export default function SettingsPage() {
    const { t } = useTranslation();

    // Settings state
    const [notifications, setNotifications] = useState<NotificationSettings>({
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
        weeklyDigest: true,
        productUpdates: true,
    });

    const [appearance, setAppearance] = useState<AppearanceSettings>({
        theme: 'system',
        language: 'en',
        fontSize: 16,
        compactMode: false,
        animations: true,
    });

    const [privacy, setPrivacy] = useState<PrivacySettings>({
        profileVisibility: 'private',
        dataCollection: true,
        personalization: true,
        thirdPartySharing: false,
    });

    const handleSaveSettings = () => {
        // In a real app, this would save to backend
        console.log('Settings saved:', { notifications, appearance, privacy });
        // Show success message
    };

    const handleResetSettings = () => {
        // Reset to defaults
        setNotifications({
            emailNotifications: true,
            pushNotifications: true,
            marketingEmails: false,
            securityAlerts: true,
            weeklyDigest: true,
            productUpdates: true,
        });
        setAppearance({
            theme: 'system',
            language: 'en',
            fontSize: 16,
            compactMode: false,
            animations: true,
        });
        setPrivacy({
            profileVisibility: 'private',
            dataCollection: true,
            personalization: true,
            thirdPartySharing: false,
        });
    };

    return (
        <div className="min-h-[calc(100vh-120px)] p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/profile">
                            <Button variant="outline" size="icon" className="dark:border-gray-600/50 dark:hover:bg-gray-700/50">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold dark:text-gray-200">Settings</h1>
                            <p className="text-muted-foreground dark:text-gray-400">Manage your account preferences and application settings</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={handleResetSettings} className="dark:border-gray-600/50 dark:text-gray-300 dark:hover:bg-gray-700/50">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset to Defaults
                        </Button>
                        <Button onClick={handleSaveSettings} className="bg-[#00F7FF] hover:bg-[#00F7FF]/80 text-black">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="notifications" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800/50 dark:border-gray-700/50">
                        <TabsTrigger value="notifications" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700/50 dark:data-[state=active]:text-gray-200">
                            <Bell className="h-4 w-4 mr-2" />
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700/50 dark:data-[state=active]:text-gray-200">
                            <Palette className="h-4 w-4 mr-2" />
                            Appearance
                        </TabsTrigger>
                        <TabsTrigger value="privacy" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700/50 dark:data-[state=active]:text-gray-200">
                            <Shield className="h-4 w-4 mr-2" />
                            Privacy
                        </TabsTrigger>
                        <TabsTrigger value="data" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700/50 dark:data-[state=active]:text-gray-200">
                            <Database className="h-4 w-4 mr-2" />
                            Data
                        </TabsTrigger>
                    </TabsList>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-6">
                        <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                    <Bell className="h-5 w-5 text-[#00F7FF]" />
                                    Notification Preferences
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium dark:text-gray-200">Email Notifications</p>
                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Receive important updates via email</p>
                                        </div>
                                        <Switch 
                                            checked={notifications.emailNotifications}
                                            onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
                                        />
                                    </div>

                                    <Separator className="dark:bg-gray-700/50" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium dark:text-gray-200">Push Notifications</p>
                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Get instant notifications on your device</p>
                                        </div>
                                        <Switch 
                                            checked={notifications.pushNotifications}
                                            onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                                        />
                                    </div>

                                    <Separator className="dark:bg-gray-700/50" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium dark:text-gray-200">Marketing Emails</p>
                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Receive promotional content and special offers</p>
                                        </div>
                                        <Switch 
                                            checked={notifications.marketingEmails}
                                            onCheckedChange={(checked) => setNotifications({...notifications, marketingEmails: checked})}
                                        />
                                    </div>

                                    <Separator className="dark:bg-gray-700/50" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium dark:text-gray-200">Security Alerts</p>
                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Important security notifications (recommended)</p>
                                        </div>
                                        <Switch 
                                            checked={notifications.securityAlerts}
                                            onCheckedChange={(checked) => setNotifications({...notifications, securityAlerts: checked})}
                                        />
                                    </div>

                                    <Separator className="dark:bg-gray-700/50" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium dark:text-gray-200">Weekly Digest</p>
                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Summary of your weekly activity</p>
                                        </div>
                                        <Switch 
                                            checked={notifications.weeklyDigest}
                                            onCheckedChange={(checked) => setNotifications({...notifications, weeklyDigest: checked})}
                                        />
                                    </div>

                                    <Separator className="dark:bg-gray-700/50" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium dark:text-gray-200">Product Updates</p>
                                            <p className="text-sm text-muted-foreground dark:text-gray-400">News about new features and improvements</p>
                                        </div>
                                        <Switch 
                                            checked={notifications.productUpdates}
                                            onCheckedChange={(checked) => setNotifications({...notifications, productUpdates: checked})}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Appearance Tab */}
                    <TabsContent value="appearance" className="space-y-6">
                        <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                    <Palette className="h-5 w-5 text-[#00F7FF]" />
                                    Appearance & Display
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="dark:text-gray-300">Theme</Label>
                                        <Select value={appearance.theme} onValueChange={(value: any) => setAppearance({...appearance, theme: value})}>
                                            <SelectTrigger className="dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200">
                                                <SelectValue placeholder="Select theme" />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-gray-800 dark:border-gray-600/50">
                                                <SelectItem value="light">
                                                    <div className="flex items-center gap-2">
                                                        <Monitor className="h-4 w-4" />
                                                        Light
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="dark">
                                                    <div className="flex items-center gap-2">
                                                        <Monitor className="h-4 w-4" />
                                                        Dark
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="system">
                                                    <div className="flex items-center gap-2">
                                                        <Smartphone className="h-4 w-4" />
                                                        System
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator className="dark:bg-gray-700/50" />

                                    <div className="space-y-2">
                                        <Label className="dark:text-gray-300">Language</Label>
                                        <Select value={appearance.language} onValueChange={(value) => setAppearance({...appearance, language: value})}>
                                            <SelectTrigger className="dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200">
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-gray-800 dark:border-gray-600/50">
                                                <SelectItem value="en">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4" />
                                                        English
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="zh">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4" />
                                                        中文
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="ja">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4" />
                                                        日本語
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator className="dark:bg-gray-700/50" />

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="dark:text-gray-300">Font Size</Label>
                                            <span className="text-sm text-muted-foreground dark:text-gray-400">{appearance.fontSize}px</span>
                                        </div>
                                        <Slider
                                            value={[appearance.fontSize]}
                                            onValueChange={(value) => setAppearance({...appearance, fontSize: value[0]})}
                                            max={24}
                                            min={12}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>

                                    <Separator className="dark:bg-gray-700/50" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium dark:text-gray-200">Compact Mode</p>
                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Reduce spacing for a more compact interface</p>
                                        </div>
                                        <Switch 
                                            checked={appearance.compactMode}
                                            onCheckedChange={(checked) => setAppearance({...appearance, compactMode: checked})}
                                        />
                                    </div>

                                    <Separator className="dark:bg-gray-700/50" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium dark:text-gray-200">Animations</p>
                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Enable smooth transitions and animations</p>
                                        </div>
                                        <Switch 
                                            checked={appearance.animations}
                                            onCheckedChange={(checked) => setAppearance({...appearance, animations: checked})}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Privacy Tab */}
                    <TabsContent value="privacy" className="space-y-6">
                        <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                    <Shield className="h-5 w-5 text-[#00F7FF]" />
                                    Privacy & Security
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="dark:text-gray-300">Profile Visibility</Label>
                                        <Select value={privacy.profileVisibility} onValueChange={(value: any) => setPrivacy({...privacy, profileVisibility: value})}>
                                            <SelectTrigger className="dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200">
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-gray-800 dark:border-gray-600/50">
                                                <SelectItem value="public">Public - Visible to everyone</SelectItem>
                                                <SelectItem value="private">Private - Only visible to you</SelectItem>
                                                <SelectItem value="friends">Friends - Visible to connections only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator className="dark:bg-gray-700/50" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium dark:text-gray-200">Data Collection</p>
                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Allow collection of usage data to improve service</p>
                                        </div>
                                        <Switch 
                                            checked={privacy.dataCollection}
                                            onCheckedChange={(checked) => setPrivacy({...privacy, dataCollection: checked})}
                                        />
                                    </div>

                                    <Separator className="dark:bg-gray-700/50" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium dark:text-gray-200">Personalization</p>
                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Use your data to personalize your experience</p>
                                        </div>
                                        <Switch 
                                            checked={privacy.personalization}
                                            onCheckedChange={(checked) => setPrivacy({...privacy, personalization: checked})}
                                        />
                                    </div>

                                    <Separator className="dark:bg-gray-700/50" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-medium dark:text-gray-200">Third-party Sharing</p>
                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Share anonymized data with partners</p>
                                        </div>
                                        <Switch 
                                            checked={privacy.thirdPartySharing}
                                            onCheckedChange={(checked) => setPrivacy({...privacy, thirdPartySharing: checked})}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Data Tab */}
                    <TabsContent value="data" className="space-y-6">
                        <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                    <Database className="h-5 w-5 text-[#00F7FF]" />
                                    Data Management
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="p-4 border border-blue-200 dark:border-blue-700/30 rounded-lg bg-blue-50/50 dark:bg-blue-900/20">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-blue-900 dark:text-blue-400">Export Your Data</h4>
                                            <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                                            Download a copy of all your data including chats, generated content, and preferences.
                                        </p>
                                        <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600/50 dark:text-blue-400 dark:hover:bg-blue-900/30">
                                            <Download className="h-4 w-4 mr-2" />
                                            Request Data Export
                                        </Button>
                                    </div>

                                    <div className="p-4 border border-amber-200 dark:border-amber-700/30 rounded-lg bg-amber-50/50 dark:bg-amber-900/20">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-amber-900 dark:text-amber-400">Clear Cache & Temporary Data</h4>
                                            <RefreshCw className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                                            Clear temporary files and cache to free up space and resolve potential issues.
                                        </p>
                                        <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600/50 dark:text-amber-400 dark:hover:bg-amber-900/30">
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Clear Cache
                                        </Button>
                                    </div>

                                    <div className="p-4 border border-red-200 dark:border-red-700/30 rounded-lg bg-red-50/50 dark:bg-red-900/20">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-red-900 dark:text-red-400">Delete Account</h4>
                                            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        </div>
                                        <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                                            Permanently delete your account and all associated data. This action cannot be undone.
                                        </p>
                                        <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600/50 dark:text-red-400 dark:hover:bg-red-900/30">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Account
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
} 