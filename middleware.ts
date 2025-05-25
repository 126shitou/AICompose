import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // 中间件逻辑可以在这里添加
    console.log('Middleware executed for:', req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        console.log('Checking authorization for:', pathname, 'Token exists:', !!token);

        // 检查用户是否已登录
        if (token) return true;

        // 公开路由列表 - 只允许特定的认证相关路由
        const publicRoutes = [
          '/profile',
          '/setting',
        ];

        // 公开的API路由 - 只有认证相关的API
        const publicApiRoutes = [
          '/api/auth/signin',
          '/api/auth/signout',
          '/api/auth/session',
          '/api/auth/providers',
          '/api/auth/callback',
          '/api/auth/csrf',
        ];

        // 如果是公开页面路由，允许访问
        if (!publicRoutes.includes(pathname)) {
          return true;
        }

        // 如果是公开API路由，允许访问
        if (publicApiRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // 其他所有路由（包括API）都需要登录
        return false;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - /_next/static (静态文件)
     * - /_next/image (图像优化文件)  
     * - /favicon.ico (favicon文件)
     * - 公开资源文件
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 