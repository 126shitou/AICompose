'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state

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
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-8 h-8 bg-gradient-to-br from-[#00F7FF] to-[#FF2D7C] rounded-lg transform rotate-45">
            <div className="absolute inset-1 bg-white dark:bg-black rounded-md" />
          </div>
          <span className="font-bold text-xl">NexusAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t('nav.create', 'Create')}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              "duration-150 ease-in-out will-change-[background-color,color] backdrop-blur-sm",
                              pathname === item.href
                                ? "bg-accent text-accent-foreground"
                                : "bg-transparent hover:bg-accent/80"
                            )}
                            style={{
                              borderLeft: pathname === item.href ? `3px solid ${item.color}` : 'none'
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div style={{ color: item.color }}>{item.icon}</div>
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {t(`nav.${item.name.toLowerCase()}.description`, `Create with AI ${item.name}`)}
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-background/80 backdrop-blur-sm hover:bg-accent/80"
                    )}
                  >
                    {t('nav.pricing', 'Pricing')}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-3 ml-4">
            <LanguageSelector />
            <ModeToggle />

            {isLoggedIn ? (
              <Link href="/profile">
                <Avatar className="hover:ring-2 hover:ring-primary transition-all cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button className="bg-[#00F7FF] hover:bg-[#00F7FF]/80 text-black">
                <LogIn className="mr-2 h-4 w-4" /> {t('nav.login', 'Sign In')}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-3">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] bg-background/95 dark:bg-background backdrop-blur-xl border-r border-gray-200/20 dark:border-white/10">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="relative w-8 h-8 bg-gradient-to-br from-[#00F7FF] to-[#FF2D7C] rounded-lg transform rotate-45">
                      <div className="absolute inset-1 bg-white dark:bg-black rounded-md" />
                    </div>
                    <span className="font-bold text-xl">NexusAI</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div
                        className={cn(
                          "flex items-center px-3 py-3 rounded-md transition-colors",
                          "duration-150 ease-in-out",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                        style={{
                          borderLeft: pathname === item.href ? `3px solid ${item.color}` : 'none'
                        }}
                      >
                        <div className="mr-3" style={{ color: item.color }}>{item.icon}</div>
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href="/pricing"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center px-3 py-3 rounded-md transition-colors duration-150 ease-in-out hover:bg-accent hover:text-accent-foreground">
                      <Sparkles className="mr-3 h-4 w-4 text-[#FFD700]" />
                      <span>{t('nav.pricing', 'Pricing')}</span>
                    </div>
                  </Link>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200/40 dark:border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <ModeToggle />
                    <LanguageSelector />
                  </div>

                  {isLoggedIn ? (
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="flex items-center px-3 py-3 rounded-md transition-colors duration-150 ease-in-out hover:bg-accent hover:text-accent-foreground">
                        <User className="mr-3 h-4 w-4" />
                        <span>{t('nav.profile', 'Profile')}</span>
                      </div>
                    </Link>
                  ) : (
                    <Button className="w-full bg-[#00F7FF] hover:bg-[#00F7FF]/80 text-black">
                      <LogIn className="mr-2 h-4 w-4" /> {t('nav.login', 'Sign In')}
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}