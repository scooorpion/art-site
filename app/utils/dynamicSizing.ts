/**
 * 动态尺寸计算工具函数
 * 根据图片比例和屏幕尺寸计算最佳显示尺寸
 */

export interface SizeConstraints {
  maxWidth: number;
  maxHeight: number;
  minWidth?: number;
  minHeight?: number;
}

export interface CalculatedSize {
  width: number;
  height: number;
  scale: number;
}

export interface GalleryLayoutConfig {
  central: {
    main: SizeConstraints;
    side: SizeConstraints;
    thumbnail: SizeConstraints;
  };
  grid: {
    item: SizeConstraints;
  };
  story: {
    main: SizeConstraints;
    preview: SizeConstraints;
  };
}

/**
 * 获取响应式布局配置
 */
export function getResponsiveLayoutConfig(): GalleryLayoutConfig {
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  // 移动设备配置
  if (screenWidth < 640) {
    return {
      central: {
        main: {
          maxWidth: Math.min(screenWidth * 0.85, 320),
          maxHeight: Math.min(screenHeight * 0.45, 400),
          minWidth: 250,
          minHeight: 200
        },
        side: {
          maxWidth: 120,
          maxHeight: 160,
          minWidth: 80,
          minHeight: 100
        },
        thumbnail: {
          maxWidth: 60,
          maxHeight: 80,
          minWidth: 50,
          minHeight: 60
        }
      },
      grid: {
        item: {
          maxWidth: Math.min(screenWidth * 0.42, 180),
          maxHeight: Math.min(screenHeight * 0.25, 240),
          minWidth: 120,
          minHeight: 150
        }
      },
      story: {
        main: {
          maxWidth: Math.min(screenWidth * 0.9, 350),
          maxHeight: Math.min(screenHeight * 0.5, 450),
          minWidth: 280,
          minHeight: 200
        },
        preview: {
          maxWidth: 100,
          maxHeight: 130,
          minWidth: 70,
          minHeight: 90
        }
      }
    };
  }
  // 平板设备配置
  else if (screenWidth < 1024) {
    return {
      central: {
        main: {
          maxWidth: Math.min(screenWidth * 0.6, 450),
          maxHeight: Math.min(screenHeight * 0.55, 550),
          minWidth: 350,
          minHeight: 280
        },
        side: {
          maxWidth: 160,
          maxHeight: 200,
          minWidth: 120,
          minHeight: 150
        },
        thumbnail: {
          maxWidth: 80,
          maxHeight: 100,
          minWidth: 60,
          minHeight: 75
        }
      },
      grid: {
        item: {
          maxWidth: Math.min(screenWidth * 0.28, 250),
          maxHeight: Math.min(screenHeight * 0.35, 320),
          minWidth: 180,
          minHeight: 220
        }
      },
      story: {
        main: {
          maxWidth: Math.min(screenWidth * 0.7, 500),
          maxHeight: Math.min(screenHeight * 0.6, 600),
          minWidth: 400,
          minHeight: 300
        },
        preview: {
          maxWidth: 120,
          maxHeight: 150,
          minWidth: 90,
          minHeight: 110
        }
      }
    };
  }
  // 桌面设备配置
  else {
    return {
      central: {
        main: {
          maxWidth: Math.min(screenWidth * 0.4, 520),
          maxHeight: Math.min(screenHeight * 0.65, 650),
          minWidth: 400,
          minHeight: 320
        },
        side: {
          maxWidth: 192,
          maxHeight: 256,
          minWidth: 150,
          minHeight: 200
        },
        thumbnail: {
          maxWidth: 96,
          maxHeight: 120,
          minWidth: 70,
          minHeight: 90
        }
      },
      grid: {
        item: {
          maxWidth: Math.min(screenWidth * 0.22, 300),
          maxHeight: Math.min(screenHeight * 0.4, 400),
          minWidth: 220,
          minHeight: 280
        }
      },
      story: {
        main: {
          maxWidth: Math.min(screenWidth * 0.5, 600),
          maxHeight: Math.min(screenHeight * 0.7, 700),
          minWidth: 450,
          minHeight: 350
        },
        preview: {
          maxWidth: 140,
          maxHeight: 180,
          minWidth: 100,
          minHeight: 130
        }
      }
    };
  }
}

/**
 * 根据图片长宽比和约束条件计算最佳尺寸
 */
export function calculateOptimalSize(
  aspectRatio: number,
  constraints: SizeConstraints
): CalculatedSize {
  const { maxWidth, maxHeight, minWidth = 100, minHeight = 100 } = constraints;

  let width: number;
  let height: number;

  // 如果图片是横向的（宽 > 高）
  if (aspectRatio > 1) {
    // 先按最大宽度计算
    width = maxWidth;
    height = width / aspectRatio;
    
    // 如果高度超出限制，按最大高度重新计算
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    
    // 确保不小于最小尺寸
    if (width < minWidth) {
      width = minWidth;
      height = width / aspectRatio;
    }
    if (height < minHeight) {
      height = minHeight;
      width = height * aspectRatio;
    }
  } 
  // 如果图片是纵向的（高 > 宽）
  else {
    // 先按最大高度计算
    height = maxHeight;
    width = height * aspectRatio;
    
    // 如果宽度超出限制，按最大宽度重新计算
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }
    
    // 确保不小于最小尺寸
    if (height < minHeight) {
      height = minHeight;
      width = height * aspectRatio;
    }
    if (width < minWidth) {
      width = minWidth;
      height = width / aspectRatio;
    }
  }

  // 计算缩放比例
  const scale = Math.min(width / maxWidth, height / maxHeight);

  return {
    width: Math.round(width),
    height: Math.round(height),
    scale: Math.round(scale * 100) / 100
  };
}

/**
 * 为中央画廊计算侧边图片的位置和尺寸
 */
export function calculateSideImageLayout(
  mainAspectRatio: number,
  sideAspectRatio: number,
  offset: number,
  position: 'left' | 'right'
): {
  size: CalculatedSize;
  transform: string;
  opacity: number;
  zIndex: number;
} {
  const config = getResponsiveLayoutConfig();
  const sideConstraints = config.central.side;
  
  // 计算侧边图片尺寸
  const size = calculateOptimalSize(sideAspectRatio, sideConstraints);
  
  // 根据偏移量计算位置和样式
  const baseTranslateX = position === 'left' ? -200 : 200;
  const translateX = baseTranslateX + (position === 'left' ? -offset * 120 : offset * 120);
  const scale = Math.max(0.4, 1 - (offset * 0.15));
  const opacity = Math.max(0.1, 1 - (offset * 0.3));
  const zIndex = Math.max(1, 10 - offset);
  
  return {
    size,
    transform: `translateX(${translateX}px) scale(${scale})`,
    opacity,
    zIndex
  };
}

/**
 * 为网格画廊计算瀑布流布局
 */
export function calculateMasonryLayout(
  images: Array<{ aspectRatio: number; id: string }>,
  containerWidth: number,
  columns: number = 3
): Array<{
  id: string;
  size: CalculatedSize;
  position: { x: number; y: number };
}> {
  const config = getResponsiveLayoutConfig();
  const itemConstraints = config.grid.item;
  
  const columnWidth = containerWidth / columns;
  const columnHeights = new Array(columns).fill(0);
  const results: Array<{
    id: string;
    size: CalculatedSize;
    position: { x: number; y: number };
  }> = [];
  
  images.forEach((image) => {
    // 调整约束以适应列宽
    const adjustedConstraints = {
      ...itemConstraints,
      maxWidth: Math.min(itemConstraints.maxWidth, columnWidth * 0.9)
    };
    
    const size = calculateOptimalSize(image.aspectRatio, adjustedConstraints);
    
    // 找到最短的列
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    
    const position = {
      x: shortestColumnIndex * columnWidth + (columnWidth - size.width) / 2,
      y: columnHeights[shortestColumnIndex]
    };
    
    results.push({
      id: image.id,
      size,
      position
    });
    
    // 更新列高度
    columnHeights[shortestColumnIndex] += size.height + 20; // 20px 间距
  });
  
  return results;
}

/**
 * 生成动态CSS样式对象
 */
export function generateDynamicStyles(size: CalculatedSize): React.CSSProperties {
  return {
    width: `${size.width}px`,
    height: `${size.height}px`,
    minWidth: `${size.width}px`,
    minHeight: `${size.height}px`
  };
}

/**
 * 检测设备类型
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}