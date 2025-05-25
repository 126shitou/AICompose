import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      credits?: number;
      usageStats?: {
        totalGenerations: number;
        imageGenerations: number;
        audioGenerations: number;
        videoGenerations: number;
        chatMessages: number;
      };
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    credits?: number;
  }
} 