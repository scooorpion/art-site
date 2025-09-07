export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  story: string;
  image: string;
  thumbnail: string;
  category: 'oil' | 'sketch' | 'mixed';
  featured: boolean;
  tags: string[];
}

// 默认数据已清空，现在从API获取数据
export const artworks: Artwork[] = [];

// 获取特色作品
export const getFeaturedArtworks = () => artworks.filter(artwork => artwork.featured);

// 按类别获取作品
export const getArtworksByCategory = (category: Artwork['category']) => 
  artworks.filter(artwork => artwork.category === category);

// 按ID获取作品
export const getArtworkById = (id: string) => 
  artworks.find(artwork => artwork.id === id);

// 获取随机作品
export const getRandomArtworks = (count: number) => {
  const shuffled = [...artworks].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};