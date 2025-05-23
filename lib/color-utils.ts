/**
 * 颜色工具函数
 * 用于处理动态颜色值，避免 Tailwind CSS 动态类名不生效的问题
 */

// 项目主题色彩定义
export const themeColors = {
  cyan: '#00F7FF',
  pink: '#FF2D7C', 
  green: '#00FF88',
  purple: '#7C3AED',
  orange: '#F59E0B',
  gold: '#FFD700',
} as const;

/**
 * 将十六进制颜色转换为 RGBA 格式
 * @param hex 十六进制颜色值 (如: #FF0000)
 * @param alpha 透明度 (0-1)
 * @returns RGBA 颜色字符串
 */
export function hexToRgba(hex: string, alpha: number): string {
  // 移除 # 符号
  const cleanHex = hex.replace('#', '');
  
  // 解析 RGB 值
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 获取主题色的 CSS 样式对象
 * @param color 颜色值
 * @param options 选项
 */
export function getColorStyles(
  color: string, 
  options: {
    alpha?: number;
    borderAlpha?: number;
    includeHover?: boolean;
  } = {}
) {
  const { alpha = 0.1, borderAlpha = 1, includeHover = false } = options;
  
  const styles: Record<string, any> = {
    backgroundColor: hexToRgba(color, alpha),
    borderColor: hexToRgba(color, borderAlpha),
    color: color,
  };

  if (includeHover) {
    styles['&:hover'] = {
      backgroundColor: hexToRgba(color, alpha * 1.5),
    };
  }

  return styles;
}

/**
 * 获取预定义主题色
 * @param colorName 颜色名称
 * @param alpha 透明度
 */
export function getThemeColor(
  colorName: keyof typeof themeColors,
  alpha?: number
): string {
  const color = themeColors[colorName];
  return alpha ? hexToRgba(color, alpha) : color;
}

/**
 * 生成 Tailwind CSS 的 safelist 颜色数组
 */
export function generateColorSafelist(): string[] {
  const colors = Object.values(themeColors);
  const alphas = ['', '/10', '/20', '/30', '/50', '/80'];
  const prefixes = ['bg-', 'border-', 'text-', 'hover:bg-', 'hover:text-'];
  
  const safelist: string[] = [];
  
  colors.forEach(color => {
    prefixes.forEach(prefix => {
      alphas.forEach(alpha => {
        safelist.push(`${prefix}[${color}]${alpha}`);
      });
    });
  });
  
  return safelist;
} 