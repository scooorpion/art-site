'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Info, X, Heart, Share2 } from 'lucide-react';
import OptimizedImage, { imageSizes, aspectRatios } from './OptimizedImage';
import { Artwork } from '../data/artworks';
import { clsx } from 'clsx';
import AnimatedText from './AnimatedText';
import { useImageDimensions, useMultipleImageDimensions } from '../hooks/useImageDimensions';
import { 
  getResponsiveLayoutConfig, 
  calculateOptimalSize, 
  calculateSideImageLayout,
  generateDynamicStyles 
} from '../utils/dynamicSizing';

interface CentralGalleryProps {
  artworks: Artwork[];
  onArtworkClick: (artwork: Artwork) => void;
}

export default function CentralGallery({ artworks, onArtworkClick }: CentralGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // 检测客户端水合状态
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // 使用useMemo缓存图片URL数组，避免每次渲染都重新计算
  const imageUrls = useMemo(() => artworks.map(artwork => artwork.image), [artworks]);
  
  // 获取所有图片的尺寸信息
  const imageDimensions = useMultipleImageDimensions();
  
  // 获取当前主图片的尺寸
  const currentImageDimensions = useImageDimensions();
  
  // 使用useMemo缓存当前作品，避免不必要的重新计算
  const currentArtwork = useMemo(() => artworks[currentIndex], [artworks, currentIndex]);
  
  // 加载图片尺寸
  useEffect(() => {
    if (imageUrls.length > 0) {
      imageDimensions.loadImages(imageUrls);
    }
  }, [imageUrls, imageDimensions.loadImages]);
  
  useEffect(() => {
    if (currentArtwork?.image) {
      currentImageDimensions.loadImage(currentArtwork.image);
    }
  }, [currentArtwork?.image, currentImageDimensions.loadImage]);
  
  // 获取响应式布局配置
  const [layoutConfig, setLayoutConfig] = useState(() => getResponsiveLayoutConfig());
  
  // 使用useCallback缓存resize处理函数
  const handleResize = useCallback(() => {
    setLayoutConfig(getResponsiveLayoutConfig());
  }, []);
  
  // 监听窗口大小变化
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);



  // 自动播放功能
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % artworks.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, artworks.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  }, [artworks.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
  }, [artworks.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // 键盘导航
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlay(!isAutoPlay);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToPrevious, goToNext, isAutoPlay]);

  // 获取侧边显示的作品索引
  const getSideArtworks = () => {
    const sideCount = 3;
    const result = [];
    
    for (let i = 1; i <= sideCount; i++) {
      const leftIndex = (currentIndex - i + artworks.length) % artworks.length;
      const rightIndex = (currentIndex + i) % artworks.length;
      result.push({ index: leftIndex, position: 'left', offset: i });
      result.push({ index: rightIndex, position: 'right', offset: i });
    }
    
    return result;
  };

  const sideArtworks = getSideArtworks();

  // 使用useMemo缓存主作品的动态样式计算
  const mainImageStyles = useMemo(() => {
    // 在水合完成前使用固定样式，避免服务端客户端不匹配
    if (!isHydrated) {
      return { width: '480px', height: '480px', minWidth: '480px', minHeight: '480px' };
    }
    
    const mainImageDimensions = currentImageDimensions.dimensions;
    if (!mainImageDimensions) {
      return { width: '480px', height: '480px', minWidth: '480px', minHeight: '480px' };
    }
    
    return generateDynamicStyles(
      calculateOptimalSize(
        mainImageDimensions.aspectRatio,
        layoutConfig.central.main
      )
    );
  }, [isHydrated, currentImageDimensions.dimensions, layoutConfig.central.main]);

  // 使用useMemo缓存侧边作品的动态样式计算
  const sideImageStyles = useMemo(() => {
    return sideArtworks.map(({ index }) => {
      // 在水合完成前使用固定样式
      if (!isHydrated) {
        return { width: '192px', height: '256px' };
      }
      
      const artwork = artworks[index];
      const dimensions = imageDimensions.dimensionsMap[artwork.image];
      if (!dimensions) {
        return { width: '192px', height: '256px' };
      }
      
      return generateDynamicStyles(
        calculateOptimalSize(
          dimensions.aspectRatio,
          layoutConfig.central.side
        )
      );
    });
  }, [isHydrated, sideArtworks, artworks, imageDimensions.dimensionsMap, layoutConfig.central.side]);

  // 使用useMemo缓存底部缩略图的动态样式计算
  const thumbnailStyles = useMemo(() => {
    return artworks.map((artwork) => {
      // 在水合完成前使用固定样式
      if (!isHydrated) {
        return { width: '80px', height: '96px' };
      }
      
      const dimensions = imageDimensions.dimensionsMap[artwork.image];
      if (!dimensions) {
        return { width: '80px', height: '96px' };
      }
      
      return generateDynamicStyles(
        calculateOptimalSize(
          dimensions.aspectRatio,
          {
            maxWidth: 80,
            maxHeight: 80,
            minWidth: 60,
            minHeight: 60
          }
        )
      );
    });
  }, [isHydrated, artworks, imageDimensions.dimensionsMap]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-white">
        <div className="relative h-screen flex flex-col">
        {/* 主展示区域 - 全屏显示 */}
        <div className="flex-1 relative flex items-center justify-center pt-20 md:pt-20">
          {/* 平铺式图片展示 */}
          <div className="flex items-center justify-center gap-6 overflow-x-hidden px-4">
            {/* 左侧图片 */}
            {sideArtworks.filter(({ position }) => position === 'left').reverse().map(({ index }) => {
               const artwork = artworks[index];
               const artworkDimensions = imageDimensions.dimensionsMap[artwork.image];
               return (
                 <motion.div
                   key={`left-${index}`}
                   className="cursor-pointer group flex-shrink-0"
                   onClick={() => goToIndex(index)}
                   whileHover={{ scale: 1.05 }}
                   transition={{ duration: 0.3 }}
                 >
                   <div className="overflow-hidden shadow-2xl transform transition-transform duration-300 relative">
                    <OptimizedImage
                      src={artwork.image}
                      alt={artwork.title}
                      width={280}
                      height={artworkDimensions?.aspectRatio ? Math.round(280 / artworkDimensions.aspectRatio) : 280}
                      sizes="280px"
                      className="group-hover:brightness-110 transition-all duration-300 object-contain"
                    />
                  </div>
                </motion.div>
              );
            })}
            
            {/* 中央主作品 */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="cursor-pointer group flex-shrink-0"
              onClick={() => onArtworkClick(currentArtwork)}
            >
              <div className="overflow-hidden shadow-2xl transition-all duration-300 ease-in-out relative">
                <OptimizedImage
                  src={currentArtwork.image}
                  alt={currentArtwork.title}
                  width={360}
                  height={currentImageDimensions.dimensions?.aspectRatio ? Math.round(360 / currentImageDimensions.dimensions.aspectRatio) : 360}
                  sizes="360px"
                  priority
                  className="group-hover:scale-105 transition-transform duration-700 object-contain"
                />
                
                {/* 悬停遮罩 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                

              </div>
            </motion.div>
            
            {/* 右侧图片 */}
            {sideArtworks.filter(({ position }) => position === 'right').map(({ index }) => {
               const artwork = artworks[index];
               const artworkDimensions = imageDimensions.dimensionsMap[artwork.image];
               return (
                 <motion.div
                   key={`right-${index}`}
                   className="cursor-pointer group flex-shrink-0"
                   onClick={() => goToIndex(index)}
                   whileHover={{ scale: 1.05 }}
                   transition={{ duration: 0.3 }}
                 >
                   <div className="overflow-hidden shadow-2xl transform transition-transform duration-300 relative">
                    <OptimizedImage
                      src={artwork.image}
                      alt={artwork.title}
                      width={280}
                      height={artworkDimensions?.aspectRatio ? Math.round(280 / artworkDimensions.aspectRatio) : 280}
                      sizes="280px"
                      className="group-hover:brightness-110 transition-all duration-300 object-contain"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 导航按钮 */}
          {/* 移动端导航按钮 */}
          <motion.button
            onClick={goToPrevious}
            className="absolute left-2 md:left-4 z-30 p-2 md:p-3 bg-black/50 dark:bg-white/20 text-white dark:text-gray-200 active:bg-black/70 md:hover:bg-black/70 dark:active:bg-white/40 dark:md:hover:bg-white/40 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </motion.button>
          <motion.button
            onClick={goToNext}
            className="absolute right-2 md:right-4 z-30 p-2 md:p-3 bg-black/50 dark:bg-white/20 text-white dark:text-gray-200 active:bg-black/70 md:hover:bg-black/70 dark:active:bg-white/40 dark:md:hover:bg-white/40 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </motion.button>
        </div>



        {/* 控制栏 - 固定在底部 */}
        <div className="absolute bottom-0 left-0 right-0 z-40 pt-2 pb-2 px-2 md:px-4">
          <div className="flex items-center justify-center space-x-2 md:space-x-4">
            {/* 播放按钮 */}
            <motion.button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="p-2 md:p-2 rounded-full bg-black/20 dark:bg-white/20 active:bg-black/30 md:hover:bg-black/30 dark:active:bg-white/30 dark:md:hover:bg-white/30 text-black dark:text-white transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {isAutoPlay ? <Pause size={14} className="md:w-4 md:h-4" /> : <Play size={14} className="md:w-4 md:h-4" />}
            </motion.button>

            {/* 进度指示器 */}
            <div className="flex items-center space-x-1 md:space-x-2">
              {artworks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={clsx(
                    'rounded-full transition-all duration-300 flex items-center justify-center',
                    index === currentIndex
                      ? 'bg-black dark:bg-white w-6 h-2 md:w-8 md:h-2'
                      : 'bg-black/40 dark:bg-white/40 active:bg-black/60 md:hover:bg-black/60 dark:active:bg-white/60 dark:md:hover:bg-white/60 w-2 h-2'
                  )}
                />
              ))}
            </div>

            {/* 计数器 */}
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 min-w-[40px] text-center">
              {currentIndex + 1} / {artworks.length}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}