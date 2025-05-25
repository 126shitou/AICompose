'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { ModeToggle } from './mode-toggle';
import { LanguageSelector } from './language-selector';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MessageSquare, 
  Image as ImageIcon, 
  Film, 
  Music, 
  Mic, 
  Menu, 
  X,
  User,
  LogIn,
  LogOut,
  Settings,
  CreditCard,
  Sparkles
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  color?: string;
}

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/' 
    });
  };

  const navItems: NavItem[] = [
    {
      name: t('nav.chat', 'Chat'),
      href: '/chat',
      icon: <MessageSquare className="h-4 w-4" />,
      color: '#00F7FF'
    },
    {
      name: t('nav.image', 'Image'),
      href: '/image',
      icon: <ImageIcon className="h-4 w-4" />,
      color: '#FF2D7C'
    },
    {
      name: t('nav.video', 'Video'),
      href: '/video',
      icon: <Film className="h-4 w-4" />,
      color: '#00FF88'
    },
    {
      name: t('nav.music', 'Music'),
      href: '/music',
      icon: <Music className="h-4 w-4" />,
      color: '#7C3AED'
    },
    {
      name: t('nav.audio', 'Audio'),
      href: '/audio',
      icon: <Mic className="h-4 w-4" />,
      color: '#F59E0B'
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-150",
        isScrolled 
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200/20 dark:border-white/10 py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative w-8 h-8 bg-gradient-to-br from-[#00F7FF] to-[#FF2D7C] rounded-lg transform rotate-45 transition-all duration-300 group-hover:rotate-[60deg] group-hover:scale-110">
            <div className="absolute inset-1 bg-white dark:bg-black rounded-md transition-all duration-300" />
          </div>
          <span className="font-bold text-xl   duration-200 group-hover:text-[#00F7FF]">NexusAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          <nav className="flex items-center space-x-1">
            {/* Navigation Items */}
                    {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                            className={cn(
                    "h-10 px-3 py-2 hover:bg-accent/50 hover:text-accent-foreground transition-all duration-300 relative group",
                    "border-b-2 border-transparent hover:border-b-2",
                    pathname === item.href && "border-b-2"
                            )}
                            style={{ 
                    borderBottomColor: pathname === item.href ? item.color : 'transparent',
                            }}
                          >
                            <div className="flex items-center gap-2">
                    <div 
                      className="will-change-transform group-hover:scale-110 group-hover:animate-pulse"
                      style={{ 
                        color: item.color,
                        transition: 'transform 300ms ease-out'
                      }}
                    >
                      {item.icon}
                    </div>
                    <span 
                      className="text-sm font-medium will-change-transform group-hover:translate-x-0.5"
                      style={{ transition: 'transform 200ms ease-out' }}
                    >
                      {item.name}
                    </span>
                            </div>
                </Button>
                        </Link>
            ))}

            {/* Pricing Link */}
            <Link href="/pricing">
              <Button
                variant="ghost"
                className={cn(
                  "h-10 px-3 py-2 hover:bg-accent/50 hover:text-accent-foreground transition-all duration-300 relative group",
                  "border-b-2 border-transparent hover:border-b-2",
                  pathname === '/pricing' && "border-b-2"
                )}
                style={{
                  borderBottomColor: pathname === '/pricing' ? '#FFD700' : 'transparent',
                }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles 
                    className="h-4 w-4 text-[#FFD700] will-change-transform group-hover:scale-110 group-hover:rotate-12"
                    style={{ transition: 'transform 300ms ease-out' }}
                  />
                  <span 
                    className="text-sm font-medium will-change-transform group-hover:translate-x-0.5"
                    style={{ transition: 'transform 200ms ease-out' }}
                  >
                    {t('nav.pricing', 'Pricing')}
                  </span>
                </div>
              </Button>
                </Link>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-3">
            <div className="transform transition-all duration-300 hover:scale-105">
            <LanguageSelector />
            </div>
            <div className="transform transition-all duration-300 hover:scale-105 hover:rotate-12">
            <ModeToggle />
            </div>
            
            {status === 'authenticated' && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer transform transition-all duration-300 hover:scale-105">
                    <div className="flex flex-col items-end text-sm">
                      <span className="font-medium text-foreground">{session.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {session.user.credits ? `${session.user.credits} credits` : 'Loading...'}
                      </span>
                    </div>
                    <Avatar className="hover:ring-2 hover:ring-[#00F7FF] transition-all">
                      <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                      <AvatarFallback className="bg-[#00F7FF]/20 text-[#00F7FF]">
                        {session.user.name?.split(' ').map(n => n[0]).join('') || session.user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 dark:bg-gray-800/95 dark:border-gray-600/50 dark:backdrop-blur-sm">
                  <DropdownMenuLabel className="dark:text-gray-200">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-gray-600/50" />
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700/50 dark:focus:bg-gray-700/50  cursor-pointer">
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700/50 dark:focus:bg-gray-700/50  cursor-pointer">
                    <Link href="/billing" className="flex items-center w-full">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700/50 dark:focus:bg-gray-700/50  cursor-pointer">
                    <Link href="/settings" className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-gray-600/50" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700/50 dark:focus:bg-gray-700/50  cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={handleLogin}
                disabled={status === 'loading'}
                className="bg-[#00F7FF] hover:bg-[#00F7FF]/80 text-black transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <LogIn className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                {status === 'loading' ? 'Loading...' : t('nav.login', 'Sign In')}
              </Button>
            )}
        </div>

        {/* Mobile Navigation */}
          <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="transition-all duration-300 hover:scale-110 hover:rotate-90">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] bg-background/95 dark:bg-background backdrop-blur-xl border-r border-gray-200/20 dark:border-white/10">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="flex items-center space-x-2 group" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="relative w-8 h-8 bg-gradient-to-br from-[#00F7FF] to-[#FF2D7C] rounded-lg transform rotate-45 transition-all duration-300 group-hover:rotate-[60deg] group-hover:scale-110">
                        <div className="absolute inset-1 bg-white dark:bg-black rounded-md transition-all duration-300" />
                    </div>
                      <span className="font-bold text-xl   duration-200 group-hover:text-[#00F7FF]">NexusAI</span>
                  </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="transition-all duration-300 hover:scale-110 hover:rotate-90">
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="space-y-1">
                    {navItems.map((item, index) => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div
                        className={cn(
                            "flex items-center px-3 py-3 rounded-md transition-all group",
                            "duration-300 ease-in-out border-l-4 border-transparent",
                            "hover:scale-[1.02] hover:shadow-sm",
                          pathname === item.href
                              ? "bg-accent/10 scale-[1.02]"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                        style={{ 
                            borderLeftColor: pathname === item.href ? item.color : 'transparent',
                            animationDelay: `${index * 50}ms`,
                        }}
                      >
                          <div 
                            className="mr-3 will-change-transform group-hover:scale-110 group-hover:rotate-6" 
                            style={{ 
                              color: item.color,
                              transition: 'transform 300ms ease-out'
                            }}
                          >
                            {item.icon}
                          </div>
                          <span 
                            className="will-change-transform group-hover:translate-x-1"
                            style={{ transition: 'transform 200ms ease-out' }}
                          >
                            {item.name}
                          </span>
                      </div>
                    </Link>
                  ))}
                  <Link 
                    href="/pricing" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                      <div className={cn(
                        "flex items-center px-3 py-3 rounded-md transition-all duration-300 ease-in-out group",
                        "border-l-4 border-transparent hover:scale-[1.02] hover:shadow-sm",
                        pathname === '/pricing'
                          ? "bg-accent/10 scale-[1.02]"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                        style={{
                          borderLeftColor: pathname === '/pricing' ? '#FFD700' : 'transparent',
                          animationDelay: `${navItems.length * 50}ms`,
                        }}>
                        <Sparkles 
                          className="mr-3 h-4 w-4 text-[#FFD700] will-change-transform group-hover:scale-110 group-hover:rotate-12"
                          style={{ transition: 'transform 300ms ease-out' }}
                        />
                        <span 
                          className="will-change-transform group-hover:translate-x-1"
                          style={{ transition: 'transform 200ms ease-out' }}
                        >
                          {t('nav.pricing', 'Pricing')}
                        </span>
                    </div>
                  </Link>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200/40 dark:border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <ModeToggle />
                    <LanguageSelector />
                  </div>
                  
                  {status === 'authenticated' && session?.user ? (
                    <div className="space-y-2">
                      <div className="flex items-center px-3 py-3 rounded-md bg-accent/5">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                          <AvatarFallback className="bg-[#00F7FF]/20 text-[#00F7FF]">
                            {session.user.name?.split(' ').map(n => n[0]).join('') || session.user.email?.[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{session.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.user.credits ? `${session.user.credits} credits` : 'Loading...'}
                          </p>
                        </div>
                      </div>
                      <div 
                        className="flex items-center px-3 py-3 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link href="/profile" className="flex items-center w-full">
                          <User className="mr-3 h-4 w-4" />
                          <span>{t('nav.profile', 'Profile')}</span>
                        </Link>
                      </div>
                      <div 
                        className="flex items-center px-3 py-3 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-3 h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-red-600 dark:text-red-400">Log out</span>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => {
                        handleLogin();
                        setIsMobileMenuOpen(false);
                      }}
                      disabled={status === 'loading'}
                      className="w-full bg-[#00F7FF] hover:bg-[#00F7FF]/80 text-black"
                    >
                      <LogIn className="mr-2 h-4 w-4" /> 
                      {status === 'loading' ? 'Loading...' : t('nav.login', 'Sign In')}
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}