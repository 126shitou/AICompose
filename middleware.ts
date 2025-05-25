import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // 中间件逻辑可以在这里添加
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // 检查用户是否已登录
        if (token) return true;
        
        // 检查是否是需要保护的路由
        const { pathname } = req.nextUrl;
        
        // 公开路由列表
        const publicRoutes = [
          '/',
          '/login',
          '/api/auth',
        ];
        
        // 如果是公开路由，允许访问
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }
        
        // 其他路由需要登录
        return false;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - /api/auth (Next-auth API路由)
     * - /_next/static (静态文件)
     * - /_next/image (图像优化文件)
     * - /favicon.ico (favicon文件)
     * - 公开资源
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 