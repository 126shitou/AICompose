'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from '@/lib/motion-mock';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    User,
    Mail,
    Calendar,
    MapPin,
    Phone,
    Edit2,
    Save,
    X,
    Settings,
    Shield,
    CreditCard,
    BarChart3,
    MessageSquare,
    Image as ImageIcon,
    Film,
    Music,
    Mic,
    Star,
    Trophy,
    TrendingUp,
    Bell,
    Lock,
    Smartphone,
    Globe,
    Eye,
    EyeOff
} from 'lucide-react';

interface UserData {
    id: string;
    name: string;
    email: string;
    avatar: string;
    credits: number;
    membershipType: 'Free' | 'Pro' | 'Enterprise';
    joinDate: string;
    location: string;
    phone: string;
    bio: string;
    website: string;
}

interface UsageStats {
    chatMessages: number;
    imagesGenerated: number;
    videosCreated: number;
    musicGenerated: number;
    audioGenerated: number;
    totalCreditsUsed: number;
    achievementCount: number;
}

export default function ProfilePage() {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('overview');

    // Mock user data (in real app, this would come from global state or API)
    const [userData, setUserData] = useState<UserData>({
        id: '1',
        name: 'Alex Chen',
        email: 'alex.chen@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        credits: 1250,
        membershipType: 'Pro',
        joinDate: '2024-01-15',
        location: 'San Francisco, CA',
        phone: '+1 (555) 123-4567',
        bio: 'Creative AI enthusiast passionate about exploring the intersection of technology and art.',
        website: 'https://alexchen.dev'
    });

    const [usageStats] = useState<UsageStats>({
        chatMessages: 2847,
        imagesGenerated: 156,
        videosCreated: 23,
        musicGenerated: 45,
        audioGenerated: 78,
        totalCreditsUsed: 8750,
        achievementCount: 12
    });

    const [editForm, setEditForm] = useState(userData);

    // Listen for URL tab parameter
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['overview', 'settings', 'security', 'billing'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleSaveProfile = () => {
        setUserData(editForm);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditForm(userData);
        setIsEditing(false);
    };

    const getMembershipColor = (type: string) => {
        switch (type) {
            case 'Enterprise': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
            case 'Pro': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
            default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800/30';
        }
    };

    const statsItems = [
        { label: 'Chat Messages', value: usageStats.chatMessages, icon: MessageSquare, color: '#00F7FF' },
        { label: 'Images Generated', value: usageStats.imagesGenerated, icon: ImageIcon, color: '#FF2D7C' },
        { label: 'Videos Created', value: usageStats.videosCreated, icon: Film, color: '#00FF88' },
        { label: 'Music Generated', value: usageStats.musicGenerated, icon: Music, color: '#7C3AED' },
        { label: 'Audio Generated', value: usageStats.audioGenerated, icon: Mic, color: '#F59E0B' },
    ];

    return (
        <div className="min-h-[calc(100vh-120px)] p-6">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Overview */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <Avatar className="h-24 w-24 ring-4 ring-[#00F7FF]/20 dark:ring-[#00F7FF]/30">
                                        <AvatarImage src={userData.avatar} alt={userData.name} />
                                        <AvatarFallback className="bg-[#00F7FF]/20 text-[#00F7FF] text-xl font-bold">
                                            {userData.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold dark:text-gray-200">{userData.name}</h3>
                                        <p className="text-sm text-muted-foreground dark:text-gray-400">{userData.email}</p>

                                        <Badge className={cn('text-xs font-medium', getMembershipColor(userData.membershipType))}>
                                            <Star className="h-3 w-3 mr-1" />
                                            {userData.membershipType} Member
                                        </Badge>
                                    </div>

                                    {/* Credits Display */}
                                    <div className="w-full p-4 rounded-lg bg-gradient-to-br from-[#00F7FF]/10 to-[#00F7FF]/5 border border-[#00F7FF]/20 dark:from-[#00F7FF]/15 dark:to-[#00F7FF]/5 dark:border-[#00F7FF]/30">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium dark:text-gray-300">Available Credits</span>
                                            <CreditCard className="h-4 w-4 text-[#00F7FF]" />
                                        </div>
                                        <div className="text-2xl font-bold text-[#00F7FF]">{userData.credits.toLocaleString()}</div>
                                        <Progress value={65} className="mt-2 h-2" />
                                        <p className="text-xs text-muted-foreground mt-1 dark:text-gray-400">65% of monthly allowance used</p>
                                    </div>

                                    <Link href="/billing">
                                        <Button
                                            variant="outline"
                                            className="w-full border-[#00F7FF]/40 hover:border-[#00F7FF] hover:bg-[#00F7FF]/10 dark:border-[#00F7FF]/30 dark:hover:border-[#00F7FF]/60 dark:hover:bg-[#00F7FF]/15"
                                        >
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Purchase Credits
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                    Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm dark:text-gray-300">Total Earned</span>
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                        {usageStats.achievementCount}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm dark:text-gray-300">Credits Used</span>
                                    <span className="text-sm font-medium dark:text-gray-200">{usageStats.totalCreditsUsed.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm dark:text-gray-300">Member Since</span>
                                    <span className="text-sm font-medium dark:text-gray-200">
                                        {new Date(userData.joinDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Detailed Information */}
                    <div className="lg:col-span-2">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800/50 dark:border-gray-700/50">
                                <TabsTrigger value="overview" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700/50 dark:data-[state=active]:text-gray-200">Overview</TabsTrigger>
                                <TabsTrigger value="settings" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700/50 dark:data-[state=active]:text-gray-200">Settings</TabsTrigger>
                                <TabsTrigger value="security" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700/50 dark:data-[state=active]:text-gray-200">Security</TabsTrigger>
                                <TabsTrigger value="billing" className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700/50 dark:data-[state=active]:text-gray-200">Billing</TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="space-y-6">
                                {/* Usage Statistics */}
                                <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                            <BarChart3 className="h-5 w-5 text-[#00F7FF]" />
                                            Usage Statistics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {statsItems.map((item, index) => (
                                                <motion.div
                                                    key={item.label}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/30 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/30 dark:to-gray-700/20"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="p-2 rounded-lg"
                                                                style={{ backgroundColor: `${item.color}20` }}
                                                            >
                                                                <item.icon
                                                                    className="h-4 w-4"
                                                                    style={{ color: item.color }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground dark:text-gray-400">{item.label}</p>
                                                                <p className="text-lg font-semibold dark:text-gray-200">{item.value.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Personal Information */}
                                <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                                <User className="h-5 w-5 text-[#00F7FF]" />
                                                Personal Information
                                            </CardTitle>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsEditing(!isEditing)}
                                                className="border-[#00F7FF]/40 hover:border-[#00F7FF] hover:bg-[#00F7FF]/10 dark:border-[#00F7FF]/30 dark:hover:border-[#00F7FF]/60 dark:hover:bg-[#00F7FF]/15"
                                            >
                                                {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                                                {isEditing ? 'Cancel' : 'Edit'}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {isEditing ? (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name" className="dark:text-gray-300">Full Name</Label>
                                                        <Input
                                                            id="name"
                                                            value={editForm.name}
                                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                            className="dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                                                        <Input
                                                            id="email"
                                                            value={editForm.email}
                                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                            className="dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone" className="dark:text-gray-300">Phone</Label>
                                                        <Input
                                                            id="phone"
                                                            value={editForm.phone}
                                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                            className="dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="location" className="dark:text-gray-300">Location</Label>
                                                        <Input
                                                            id="location"
                                                            value={editForm.location}
                                                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                            className="dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                                                        />
                                                    </div>
                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label htmlFor="website" className="dark:text-gray-300">Website</Label>
                                                        <Input
                                                            id="website"
                                                            value={editForm.website}
                                                            onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                                                            className="dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                                                        />
                                                    </div>
                                                    <div className="space-y-2 md:col-span-2">
                                                        <Label htmlFor="bio" className="dark:text-gray-300">Bio</Label>
                                                        <Textarea
                                                            id="bio"
                                                            value={editForm.bio}
                                                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                                            className="dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 pt-4">
                                                    <Button
                                                        onClick={handleSaveProfile}
                                                        className="bg-[#00F7FF] hover:bg-[#00F7FF]/80 text-black"
                                                    >
                                                        <Save className="h-4 w-4 mr-2" />
                                                        Save Changes
                                                    </Button>
                                                    <Button variant="outline" onClick={handleCancelEdit} className="dark:border-gray-600/50 dark:text-gray-300 dark:hover:bg-gray-700/50">
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Full Name</p>
                                                            <p className="font-medium dark:text-gray-200">{userData.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Email</p>
                                                            <p className="font-medium dark:text-gray-200">{userData.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Phone</p>
                                                            <p className="font-medium dark:text-gray-200">{userData.phone}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Location</p>
                                                            <p className="font-medium dark:text-gray-200">{userData.location}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Website</p>
                                                            <p className="font-medium dark:text-gray-200">{userData.website}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Member Since</p>
                                                            <p className="font-medium dark:text-gray-200">{new Date(userData.joinDate).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <p className="text-sm text-muted-foreground mb-2 dark:text-gray-400">Bio</p>
                                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{userData.bio}</p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Settings Tab */}
                            <TabsContent value="settings" className="space-y-6">
                                <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                            <Settings className="h-5 w-5 text-[#00F7FF]" />
                                            Preferences
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium dark:text-gray-200">Email Notifications</p>
                                                    <p className="text-sm text-muted-foreground dark:text-gray-400">Receive updates about your account activity</p>
                                                </div>
                                                <Switch />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium dark:text-gray-200">Marketing Communications</p>
                                                    <p className="text-sm text-muted-foreground dark:text-gray-400">Get tips, feature updates, and special offers</p>
                                                </div>
                                                <Switch />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium dark:text-gray-200">Usage Analytics</p>
                                                    <p className="text-sm text-muted-foreground dark:text-gray-400">Help improve our services with anonymous usage data</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Security Tab */}
                            <TabsContent value="security" className="space-y-6">
                                <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                            <Shield className="h-5 w-5 text-[#00F7FF]" />
                                            Security Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="current-password" className="dark:text-gray-300">Current Password</Label>
                                                <div className="relative mt-2">
                                                    <Input
                                                        id="current-password"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter current password"
                                                        className="pr-10 dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent dark:text-gray-400 dark:hover:text-gray-300"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="new-password" className="dark:text-gray-300">New Password</Label>
                                                <Input
                                                    id="new-password"
                                                    type="password"
                                                    placeholder="Enter new password"
                                                    className="mt-2 dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="confirm-password" className="dark:text-gray-300">Confirm Password</Label>
                                                <Input
                                                    id="confirm-password"
                                                    type="password"
                                                    placeholder="Confirm new password"
                                                    className="mt-2 dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200"
                                                />
                                            </div>
                                            <Button className="bg-[#00F7FF] hover:bg-[#00F7FF]/80 text-black">
                                                <Lock className="h-4 w-4 mr-2" />
                                                Update Password
                                            </Button>
                                        </div>

                                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium dark:text-gray-200">Two-Factor Authentication</p>
                                                    <p className="text-sm text-muted-foreground dark:text-gray-400">Add an extra layer of security to your account</p>
                                                </div>
                                                <Button variant="outline" className="dark:border-gray-600/50 dark:text-gray-300 dark:hover:bg-gray-700/50">
                                                    <Smartphone className="h-4 w-4 mr-2" />
                                                    Enable 2FA
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Billing Tab */}
                            <TabsContent value="billing" className="space-y-6">
                                <Card className="border-border bg-card/50 backdrop-blur-sm dark:bg-gray-900/40 dark:border-gray-700/40">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 dark:text-gray-200">
                                            <CreditCard className="h-5 w-5 text-[#00F7FF]" />
                                            Billing Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200/50 dark:border-blue-700/30">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h4 className="font-semibold text-blue-900 dark:text-blue-400">Pro Plan</h4>
                                                    <p className="text-sm text-blue-700 dark:text-blue-300">$29.99/month</p>
                                                </div>
                                                <Badge className="bg-blue-600 hover:bg-blue-600 text-white">Active</Badge>
                                            </div>
                                            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">Next billing date: March 15, 2024</p>
                                            <div className="flex gap-3">
                                                <Link href="/billing">
                                                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600/50 dark:text-blue-400 dark:hover:bg-blue-900/30">
                                                        Change Plan
                                                    </Button>
                                                </Link>
                                                <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600/50 dark:text-red-400 dark:hover:bg-red-900/30">
                                                    Cancel Subscription
                                                </Button>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-4 dark:text-gray-200">Payment Method</h4>
                                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs flex items-center justify-center font-bold">
                                                            VISA
                                                        </div>
                                                        <div>
                                                            <p className="font-medium dark:text-gray-200">•••• •••• •••• 4242</p>
                                                            <p className="text-sm text-muted-foreground dark:text-gray-400">Expires 12/25</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="dark:border-gray-600/50 dark:text-gray-300 dark:hover:bg-gray-700/50">
                                                        Update
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium mb-4 dark:text-gray-200">Billing History</h4>
                                            <div className="space-y-3">
                                                {[
                                                    { date: '2024-02-15', amount: '$29.99', status: 'Paid' },
                                                    { date: '2024-01-15', amount: '$29.99', status: 'Paid' },
                                                    { date: '2023-12-15', amount: '$29.99', status: 'Paid' },
                                                ].map((invoice, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                        <div>
                                                            <p className="font-medium dark:text-gray-200">{invoice.amount}</p>
                                                            <p className="text-sm text-muted-foreground dark:text-gray-400">{invoice.date}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                                {invoice.status}
                                                            </Badge>
                                                            <Button variant="ghost" size="sm" className="dark:text-gray-300 dark:hover:bg-gray-700/50">
                                                                Download
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
