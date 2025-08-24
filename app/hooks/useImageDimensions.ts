'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  isLoading: boolean;
  error: string | null;
}

interface UseImageDimensionsReturn {
  dimensions: ImageDimensions;
  loadImage: (src: string) => void;
}

// 全局缓存，避免重复加载相同图片
const imageCache = new Map<string, ImageDimensions>();

/**
 * 自动检测图片尺寸的React Hook
 * 在前端动态获取图片的实际长宽比，无需预处理
 */
export function useImageDimensions(): UseImageDimensionsReturn {
  const [dimensions, setDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
    aspectRatio: 1,
    isLoading: false,
    error: null
  });
  
  const currentSrcRef = useRef<string>('');
  const isMountedRef = useRef(true);
  const currentImageRef = useRef<HTMLImageElement | null>(null);
  
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // 清理正在加载的图片，防止内存泄漏
      if (currentImageRef.current) {
        currentImageRef.current.onload = null;
        currentImageRef.current.onerror = null;
        currentImageRef.current.src = '';
        currentImageRef.current = null;
      }
    };
  }, []);

  const loadImage = useCallback((src: string) => {
    if (!src || currentSrcRef.current === src) return;
    
    // 清理之前的图片加载
    if (currentImageRef.current) {
      currentImageRef.current.onload = null;
      currentImageRef.current.onerror = null;
      currentImageRef.current.src = '';
    }
    
    currentSrcRef.current = src;
    
    // 检查缓存
    const cached = imageCache.get(src);
    if (cached) {
      if (isMountedRef.current) {
        setDimensions(cached);
      }
      return;
    }

    if (isMountedRef.current) {
      setDimensions(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));
    }

    const img = new Image();
    currentImageRef.current = img;
    
    img.onload = () => {
      // 检查是否仍然是当前请求的图片
      if (!isMountedRef.current || currentSrcRef.current !== src || currentImageRef.current !== img) {
        return;
      }
      
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const newDimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio,
        isLoading: false,
        error: null
      };
      
      // 缓存结果
      imageCache.set(src, newDimensions);
      
      setDimensions(newDimensions);
    };

    img.onerror = () => {
      // 检查是否仍然是当前请求的图片
      if (!isMountedRef.current || currentSrcRef.current !== src || currentImageRef.current !== img) {
        return;
      }
      
      const errorDimensions = {
        width: 0,
        height: 0,
        aspectRatio: 1,
        isLoading: false,
        error: `无法加载图片: ${src}`
      };
      
      setDimensions(errorDimensions);
    };

    img.src = src;
  }, []);

  return { dimensions, loadImage };
}

/**
 * 批量检测多个图片尺寸的Hook
 */
export function useMultipleImageDimensions() {
  const [dimensionsMap, setDimensionsMap] = useState<Record<string, ImageDimensions>>({});
  const [isLoading, setIsLoading] = useState(false);
  const loadedSourcesRef = useRef<Set<string>>(new Set());
  const isMountedRef = useRef(true);
  const loadingImagesRef = useRef<Set<HTMLImageElement>>(new Set());
  
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // 清理所有正在加载的图片，防止内存泄漏
      loadingImagesRef.current.forEach(img => {
        img.onload = null;
        img.onerror = null;
        img.src = '';
      });
      loadingImagesRef.current.clear();
    };
  }, []);

  const loadImages = useCallback(async (imageSources: string[]) => {
    if (!imageSources.length) return;
    
    // 清理之前的图片加载
    loadingImagesRef.current.forEach(img => {
      img.onload = null;
      img.onerror = null;
      img.src = '';
    });
    loadingImagesRef.current.clear();
    
    // 过滤出需要加载的图片（未加载过的）
    const sourcesToLoad = imageSources.filter(src => 
      !loadedSourcesRef.current.has(src) && !imageCache.has(src)
    );
    
    if (!sourcesToLoad.length) {
      // 所有图片都已缓存，直接从缓存获取
      const cachedDimensions: Record<string, ImageDimensions> = {};
      imageSources.forEach(src => {
        const cached = imageCache.get(src);
        if (cached) {
          cachedDimensions[src] = cached;
        }
      });
      
      if (isMountedRef.current && Object.keys(cachedDimensions).length > 0) {
        setDimensionsMap(prev => ({ ...prev, ...cachedDimensions }));
      }
      return;
    }
    
    if (isMountedRef.current) {
      setIsLoading(true);
    }
    
    const newDimensionsMap: Record<string, ImageDimensions> = {};

    const loadPromises = sourcesToLoad.map((src) => {
      return new Promise<void>((resolve) => {
        // 检查缓存
        const cached = imageCache.get(src);
        if (cached) {
          newDimensionsMap[src] = cached;
          loadedSourcesRef.current.add(src);
          resolve();
          return;
        }
        
        const img = new Image();
        loadingImagesRef.current.add(img);
        
        const cleanup = () => {
          img.onload = null;
          img.onerror = null;
          img.src = '';
          loadingImagesRef.current.delete(img);
        };
        
        img.onload = () => {
          if (!isMountedRef.current) {
            cleanup();
            resolve();
            return;
          }
          
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          const dimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight,
            aspectRatio,
            isLoading: false,
            error: null
          };
          
          newDimensionsMap[src] = dimensions;
          imageCache.set(src, dimensions);
          loadedSourcesRef.current.add(src);
          cleanup();
          resolve();
        };

        img.onerror = () => {
          if (!isMountedRef.current) {
            cleanup();
            resolve();
            return;
          }
          
          const errorDimensions = {
            width: 0,
            height: 0,
            aspectRatio: 1,
            isLoading: false,
            error: `无法加载图片: ${src}`
          };
          
          newDimensionsMap[src] = errorDimensions;
          loadedSourcesRef.current.add(src);
          cleanup();
          resolve();
        };

        img.src = src;
      });
    });

    await Promise.all(loadPromises);
    
    if (isMountedRef.current) {
      setDimensionsMap(prev => ({ ...prev, ...newDimensionsMap }));
      setIsLoading(false);
    }
  }, []);

  return { dimensionsMap, isLoading, loadImages };
}

/**
 * 根据图片比例和容器约束计算最佳显示尺寸
 */
export function calculateOptimalSize(
  aspectRatio: number,
  maxWidth: number,
  maxHeight: number,
  minWidth: number = 200,
  minHeight: number = 200
): { width: number; height: number } {
  // 如果图片是横向的（宽 > 高）
  if (aspectRatio > 1) {
    const width = Math.min(maxWidth, Math.max(minWidth, maxHeight * aspectRatio));
    const height = width / aspectRatio;
    return { width: Math.round(width), height: Math.round(height) };
  } 
  // 如果图片是纵向的（高 > 宽）
  else {
    const height = Math.min(maxHeight, Math.max(minHeight, maxWidth / aspectRatio));
    const width = height * aspectRatio;
    return { width: Math.round(width), height: Math.round(height) };
  }
}

/**
 * 根据屏幕尺寸获取响应式的最大尺寸约束
 */
export function getResponsiveConstraints() {
  if (typeof window === 'undefined') {
    return { maxWidth: 400, maxHeight: 500 }; // 服务端渲染默认值
  }

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // 移动设备
  if (screenWidth < 640) {
    return {
      maxWidth: Math.min(screenWidth * 0.8, 300),
      maxHeight: Math.min(screenHeight * 0.4, 400)
    };
  }
  // 平板设备
  else if (screenWidth < 1024) {
    return {
      maxWidth: Math.min(screenWidth * 0.6, 400),
      maxHeight: Math.min(screenHeight * 0.5, 500)
    };
  }
  // 桌面设备
  else {
    return {
      maxWidth: Math.min(screenWidth * 0.4, 500),
      maxHeight: Math.min(screenHeight * 0.6, 600)
    };
  }
}