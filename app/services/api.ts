// API 服务配置

// 根据环境确定 API 基础 URL
const getApiUrl = () => {
  // 在浏览器环境中
  if (typeof window !== 'undefined') {
    // 生产环境使用相对路径（通过 Nginx 代理）
    if (process.env.NODE_ENV === 'production') {
      return '/api';
    }
    // 开发环境使用本地 Strapi
    return 'http://localhost:1337/api';
  }
  
  // 在服务器端（SSR）- Docker 环境中的内部服务通信
  // 无论是生产还是开发环境，在 Docker 容器内部都使用内部 URL
  return process.env.NEXT_PUBLIC_STRAPI_URL ? `${process.env.NEXT_PUBLIC_STRAPI_URL}/api` : 'http://strapi:1337/api';
};

export const API_URL = getApiUrl();

// 获取媒体文件 URL（返回相对路径，让OptimizedImage组件处理完整URL构建）
export const getMediaUrl = (url: string) => {
  if (!url) return '';
  
  // 如果已经是完整 URL，直接返回
  if (url.startsWith('http')) {
    return url;
  }
  
  // 返回相对路径，让OptimizedImage组件处理完整URL构建
  return url.startsWith('/') ? url : `/${url}`;
};

// API 请求封装
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Strapi数据类型定义
interface StrapiArtworkData {
  id: number;
  title?: string;
  artist?: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  description?: string;
  story?: string;
  image?: string;
  thumbnail?: string;
  category?: 'oil' | 'sketch' | 'mixed';
  featured?: boolean;
  tags?: string[];
}

// 转换Strapi数据格式为前端格式
const transformArtworkData = (strapiData: unknown) => {
  if (!strapiData) return null;
  
  const data = strapiData as StrapiArtworkData;
  
  return {
    id: data.id.toString(),
    title: data.title || '',
    artist: data.artist || '',
    year: data.year || new Date().getFullYear(),
    medium: data.medium || '',
    dimensions: data.dimensions || '',
    description: data.description || '',
    story: data.story || '',
    image: getMediaUrl(data.image || ''),
    thumbnail: getMediaUrl(data.thumbnail || data.image || ''),
    category: data.category || 'oil',
    featured: data.featured || false,
    tags: data.tags || [],
  };
};

// 获取艺术作品列表
export const getArtworks = async (params?: {
  populate?: string;
  filters?: Record<string, unknown>;
  sort?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
}) => {
  const searchParams = new URLSearchParams();
  
  // 默认populate所有关联数据
  searchParams.append('populate', params?.populate || '*');
  
  if (params?.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      searchParams.append(`filters[${key}]`, String(value));
    });
  }
  
  if (params?.sort) {
    searchParams.append('sort', params.sort);
  }
  
  if (params?.pagination) {
    if (params.pagination.page) {
      searchParams.append('pagination[page]', params.pagination.page.toString());
    }
    if (params.pagination.pageSize) {
      searchParams.append('pagination[pageSize]', params.pagination.pageSize.toString());
    }
  }
  
  const queryString = searchParams.toString();
  const endpoint = `/artworks${queryString ? `?${queryString}` : ''}`;
  
  const response = await apiRequest(endpoint);
  
  // 转换Strapi数据格式
  if (response.data && Array.isArray(response.data)) {
    return response.data.map(transformArtworkData).filter(Boolean);
  }
  
  return [];
};

// 获取单个艺术作品
export const getArtwork = async (id: string | number, populate = '*') => {
  const response = await apiRequest(`/artworks/${id}?populate=${populate}`);
  return response.data ? transformArtworkData(response.data) : null;
};

// 获取特色艺术作品
export const getFeaturedArtworks = async () => {
  const response = await apiRequest('/artworks?filters[featured][$eq]=true&populate=*');
  if (response.data && Array.isArray(response.data)) {
    return response.data.map(transformArtworkData).filter(Boolean);
  }
  return [];
};

// 按分类获取艺术作品
export const getArtworksByCategory = async (category: string) => {
  const response = await apiRequest(`/artworks?filters[category][$eq]=${category}&populate=*`);
  if (response.data && Array.isArray(response.data)) {
    return response.data.map(transformArtworkData).filter(Boolean);
  }
  return [];
};