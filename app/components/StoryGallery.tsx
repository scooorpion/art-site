'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize, Minimize, Info, BookOpen, Eye, Heart, Share2, ChevronsDown, ChevronsUp } from 'lucide-react';
import OptimizedImage, { imageSizes, aspectRatios } from './OptimizedImage';
import { Artwork } from '../data/artworks';
import { clsx } from 'clsx';
import AnimatedText from './AnimatedText';
// 移除动态尺寸相关的导入

interface StoryGalleryProps {
  artworks: Artwork[];
  selectedArtwork?: Artwork;
  onClose: () => void;
}

export default function StoryGallery({ artworks, selectedArtwork, onClose }: StoryGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [direction, setDirection] = useState(0);
  
  // 使用useMemo缓存当前作品
  const currentArtwork = useMemo(() => artworks[currentIndex], [artworks, currentIndex]);
  
  // 移除所有动态样式计算相关的代码

  // 如果有选中的作品，找到其索引
  useEffect(() => {
    if (selectedArtwork) {
      const index = artworks.findIndex(artwork => artwork.id === selectedArtwork.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedArtwork, artworks]);



  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    if (currentIndex < artworks.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, artworks.length]);

  const goToSlide = useCallback((index: number) => {
    if (index !== currentIndex) {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    }
  }, [currentIndex]);

  // 键盘导航
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape') onClose();
      if (e.key === 'f' || e.key === 'F') setIsFullscreen(!isFullscreen);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, currentIndex, artworks.length]);

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className={clsx(
      'fixed inset-0 z-50 bg-black flex flex-col',
      isFullscreen ? 'cursor-none' : 'cursor-default'
    )}>
      {/* 顶部控制栏 */}
      <AnimatePresence>
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6"
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors mobile-button"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <X size={24} />
                </motion.button>
                <div className="flex items-center space-x-2">
                  <BookOpen size={20} />
                  <span className="font-medium">
                    <AnimatedText variant="fadeInLeft">
                      艺术故事
                    </AnimatedText>
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => setShowThumbnails(!showThumbnails)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showThumbnails ? <ChevronsDown size={20} /> : <ChevronsUp size={20} />}
                </motion.button>
                <motion.button
                  onClick={() => setReadingMode(!readingMode)}
                  className={clsx(
                    'px-4 py-2 rounded-full transition-colors',
                    readingMode ? 'bg-white text-black' : 'bg-white/20 hover:bg-white/30'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  阅读模式
                </motion.button>
                <motion.button 
                  className="p-2 hover:bg-white/20 rounded-full transition-colors mobile-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Heart size={20} />
                </motion.button>
                <motion.button 
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Share2 size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主内容区域 */}
      <div className="flex-grow relative w-full overflow-hidden">
        <AnimatePresence mode="sync" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.1 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                goToNext();
              } else if (swipe > swipeConfidenceThreshold) {
                goToPrevious();
              }
            }}
            className="absolute inset-0 flex"
          >
            {readingMode ? (
              // 阅读模式布局
              <div className="w-full h-full flex flex-col md:flex-row">
                {/* 左侧图片 */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full relative p-4 md:p-8">
                  <div 
                    className="w-full h-full relative flex items-center justify-center"
                  >
                    <OptimizedImage
                      src={currentArtwork.image}
                      alt={currentArtwork.title}
                      fill
                      sizes="50vw"
                      priority
                      className="object-contain"
                    />
                  </div>
                </div>
                
                {/* 右侧文字 */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto p-6 md:p-12 text-white">
                  <div className="max-w-2xl">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-2 md:mb-4">
                        {currentArtwork.title}
                      </h1>
                      <div className="text-lg sm:text-xl text-gray-300 mb-4 md:mb-8">
                        <p>{currentArtwork.artist}</p>
                        <p className="text-base sm:text-lg">{currentArtwork.year} · {currentArtwork.medium}</p>
                        <p className="text-sm sm:text-base text-gray-400">{currentArtwork.dimensions}</p>
                      </div>
                      
                      <div className="prose prose-invert prose-base sm:prose-lg max-w-none">
                        <h3 className="text-xl sm:text-2xl font-serif mb-2 md:mb-4">作品描述</h3>
                        <p className="text-gray-300 sm:text-gray-200 leading-relaxed mb-4 md:mb-8">
                          {currentArtwork.description}
                        </p>
                        
                        <h3 className="text-xl sm:text-2xl font-serif mb-2 md:mb-4">创作故事</h3>
                        <p className="text-gray-300 sm:text-gray-200 leading-relaxed">
                          {currentArtwork.story}
                        </p>
                      </div>
                      
                      {/* 标签 */}
                      <div className="mt-8">
                        <h4 className="text-lg font-medium mb-3">标签</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentArtwork.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-white/20 dark:bg-gray-800/60 text-white dark:text-gray-200 text-sm rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            ) : (
              // 沉浸模式布局
              <div className="w-full h-full relative">
                {/* 背景图片 */}
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <OptimizedImage
                    src={currentArtwork.image}
                    alt={currentArtwork.title}
                    fill
                    sizes="100vw"
                    priority
                    className="object-contain"
                  />
                </div>
                
                {/* 底部信息面板 */}
                <AnimatePresence>
                  {!isFullscreen && !showThumbnails && (
                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 100 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-8"
                    >
                      <div className="max-w-4xl mx-auto text-white">
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-1 sm:mb-2">
                          {currentArtwork.title}
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-300 mb-2 sm:mb-4">
                          {currentArtwork.artist} · {currentArtwork.year}
                        </p>
                        <p className="text-gray-300 sm:text-gray-200 leading-relaxed max-w-3xl">
                          {currentArtwork.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* 导航按钮 */}
        <AnimatePresence>
          {!isFullscreen && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className={clsx(
                  "absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full transition-colors text-white",
                  currentIndex === 0
                    ? "bg-black/20 cursor-not-allowed opacity-50"
                    : "bg-black/50 hover:bg-black/70"
                )}
                whileHover={currentIndex > 0 ? { scale: 1.1, x: -2 } : {}}
                whileTap={currentIndex > 0 ? { scale: 0.95 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <ChevronLeft size={24} />
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={goToNext}
                disabled={currentIndex === artworks.length - 1}
                className={clsx(
                  "absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full transition-colors text-white",
                  currentIndex === artworks.length - 1
                    ? "bg-black/20 cursor-not-allowed opacity-50"
                    : "bg-black/50 hover:bg-black/70"
                )}
                whileHover={currentIndex < artworks.length - 1 ? { scale: 1.1, x: 2 } : {}}
                whileTap={currentIndex < artworks.length - 1 ? { scale: 0.95 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <ChevronRight size={24} />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* 全屏提示 */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 text-white px-4 py-2 rounded-full text-sm"
            >
              按 ESC 退出全屏 · 按 F 切换全屏 · 左右箭头导航
            </motion.div>
          )}
        </AnimatePresence>

        {/* 点击区域用于全屏切换 */}
        <div
          className="absolute inset-0 z-0"
          onClick={() => setIsFullscreen(!isFullscreen)}
        />
      </div>

      {/* 底部预览 */}
      <AnimatePresence>
        {showThumbnails && !isFullscreen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 z-20"
          >
            <div className="bg-black/80 backdrop-blur-md p-4">
              <div className="flex justify-center space-x-4 overflow-x-auto pb-4">
                {artworks.map((artwork, index) => {
                  const thumbnailSize = { width: 80, height: 96 };
                  
                  return (
                    <motion.div
                      key={artwork.id}
                      className={clsx(
                        "flex-shrink-0 relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300",
                        "bg-gray-900", // 背景色，以防图片未加载
                        index === currentIndex
                          ? "border-2 border-white shadow-lg"
                          : "border-2 border-transparent hover:border-white/50"
                      )}
                      style={{
                        width: `${thumbnailSize.width}px`,
                        height: `${thumbnailSize.height}px`
                      }}
                      onClick={() => goToSlide(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <OptimizedImage
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        sizes="80px"
                        className="object-cover w-full h-full" // 改为 object-cover
                      />
                      {index === currentIndex && (
                        <div className="absolute inset-0 bg-white/20" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center">
                <span className="text-white text-sm">
                  {currentIndex + 1} / {artworks.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}