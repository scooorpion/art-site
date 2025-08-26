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
    const mainImageDimensions = currentImageDimensions.dimensions;
    if (!mainImageDimensions) return {};
    
    return generateDynamicStyles(
      calculateOptimalSize(
        mainImageDimensions.aspectRatio,
        layoutConfig.central.main
      )
    );
  }, [currentImageDimensions.dimensions, layoutConfig.central.main]);

  // 使用useMemo缓存侧边作品的动态样式计算
  const sideImageStyles = useMemo(() => {
    return sideArtworks.map(({ index }) => {
      const artwork = artworks[index];
      const dimensions = imageDimensions.dimensionsMap[artwork.image];
      if (!dimensions) return {};
      
      return generateDynamicStyles(
        calculateOptimalSize(
          dimensions.aspectRatio,
          layoutConfig.central.side
        )
      );
    });
  }, [sideArtworks, artworks, imageDimensions.dimensionsMap, layoutConfig.central.side]);

  // 使用useMemo缓存底部缩略图的动态样式计算
  const thumbnailStyles = useMemo(() => {
    return artworks.map((artwork) => {
      const dimensions = imageDimensions.dimensionsMap[artwork.image];
      if (!dimensions) return {};
      
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
  }, [artworks, imageDimensions.dimensionsMap]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-white pt-20 sm:pt-24 md:pt-32 mobile-nav-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 large-container">
        {/* 标题区域 */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            <AnimatedText
              variant="fadeInUp"
              delay={0.2}
              className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-serif font-bold mb-4 mobile-title large-title bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            >
              中央展厅
            </AnimatedText>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            沉浸式艺术体验，每一幅作品都值得细细品味
          </motion.p>
        </div>

        {/* 主展示区域 */}
        <div className="relative h-[70vh] flex items-center justify-center">
          {/* 侧边作品 */}
          <div className="absolute inset-0 flex items-center justify-center">
            {sideArtworks.map(({ index, position, offset }) => {
              const artwork = artworks[index];
              const isLeft = position === 'left';
              const translateX = isLeft ? -200 - (offset * 120) : 200 + (offset * 120);
              const artworkDimensions = imageDimensions.dimensionsMap[artwork.image];
               const sideLayout = artworkDimensions?.aspectRatio ? 
                 calculateSideImageLayout(
                   currentImageDimensions.dimensions?.aspectRatio || 1,
                   artworkDimensions.aspectRatio,
                   offset,
                   position as 'left' | 'right'
                 ) : null;
               
               const scale = 1 - (offset * 0.15);
               const opacity = sideLayout ? sideLayout.opacity : 1 - (offset * 0.3);
               const zIndex = sideLayout ? sideLayout.zIndex : 10 - offset;

              return (
                <motion.div
                  key={`${index}-${position}-${offset}`}
                  className="absolute cursor-pointer group"
                  style={{
                    transform: `translateX(${translateX}px) scale(${scale})`,
                    opacity,
                    zIndex
                  }}
                  onClick={() => goToIndex(index)}
                  transition={{ duration: 0.3 }}
                >
                  <div 
                    className="overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                    style={Object.keys(sideImageStyles[sideArtworks.findIndex(item => item.index === index && item.position === position && item.offset === offset)] || {}).length > 0 ? 
                      sideImageStyles[sideArtworks.findIndex(item => item.index === index && item.position === position && item.offset === offset)] : 
                      { width: '192px', height: '256px' } // 默认尺寸
                    }
                  >
                    <OptimizedImage
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      sizes="200px"
                      className="group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 中央主作品 */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-20 cursor-pointer group"
            onClick={() => onArtworkClick(currentArtwork)}
          >
            <div 
              className="overflow-hidden shadow-2xl transition-all duration-300 ease-in-out"
              style={Object.keys(mainImageStyles).length > 0 ? 
                 mainImageStyles : 
                 { width: '320px', height: '320px' } // 默认尺寸
               }
            >
              <OptimizedImage
                src={currentArtwork.image}
                alt={currentArtwork.title}
                fill
                sizes={imageSizes.hero}
                priority
                className="group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* 悬停遮罩 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              
              {/* 信息按钮 */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo(!showInfo);
                }}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={{ rotate: showInfo ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Info size={20} />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>

          {/* 导航按钮 */}
          <motion.button
            onClick={goToPrevious}
            className="absolute left-4 z-30 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button
            onClick={goToNext}
            className="absolute right-4 z-30 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>

        {/* 作品信息 */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-serif font-bold mb-2">{currentArtwork.title}</h2>
                <p className="text-gray-300 mb-4">
                  {currentArtwork.artist} · {currentArtwork.year} · {currentArtwork.medium}
                </p>
                <p className="text-gray-400 text-sm mb-4">{currentArtwork.dimensions}</p>
                <p className="text-gray-200 max-w-2xl mx-auto leading-relaxed">
                  {currentArtwork.description}
                </p>
                
                {/* 标签 */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {currentArtwork.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/20 text-white text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 控制栏 */}
        <div className="mt-8 flex items-center justify-center space-x-6">
          {/* 自动播放控制 */}
          <motion.button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={clsx(
              'flex items-center space-x-2 px-4 py-2 rounded-full transition-colors',
              isAutoPlay
                ? 'bg-white/20 dark:bg-gray-800/60 text-white dark:text-gray-200'
                : 'bg-white/10 dark:bg-gray-800/30 text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              key={isAutoPlay ? 'pause' : 'play'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isAutoPlay ? <Pause size={16} /> : <Play size={16} />}
            </motion.div>
            <span className="text-sm text-current">{isAutoPlay ? '暂停' : '播放'}</span>
          </motion.button>

          {/* 进度指示器 */}
          <div className="flex items-center space-x-2">
            {artworks.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={clsx(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'bg-white w-8'
                    : 'bg-white/40 hover:bg-white/60'
                )}
              />
            ))}
          </div>

          {/* 计数器 */}
          <div className="text-sm text-gray-400">
            {currentIndex + 1} / {artworks.length}
          </div>
        </div>

        {/* 底部缩略图列表 */}
        <div className="mt-12 pb-8">
          <div className="flex justify-center">
            <div className="flex space-x-4 overflow-x-auto pb-4 max-w-full">
              {artworks.map((artwork, index) => {
                const thumbnailSize = { width: 80, height: 96 };
                
                return (
                  <motion.div
                    key={artwork.id}
                    className={clsx(
                      "flex-shrink-0 relative cursor-pointer overflow-hidden transition-all duration-300 rounded-lg",
                      "bg-gray-900", // 背景色，以防图片未加载
                      index === currentIndex
                        ? "border-2 border-white shadow-lg"
                        : "border-2 border-transparent hover:border-white/50"
                    )}
                    style={{
                      width: `${thumbnailSize.width}px`,
                      height: `${thumbnailSize.height}px`
                    }}
                    onClick={() => goToIndex(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <OptimizedImage
                      src={artwork.thumbnail}
                      alt={artwork.title}
                      fill
                      sizes="80px"
                      className="object-cover w-full h-full"
                    />
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-white/20" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}