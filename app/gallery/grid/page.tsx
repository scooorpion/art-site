'use client';

import { useState, useEffect } from 'react';
import GridGallery from '../../components/GridGallery';
import Navigation from '../../components/Navigation';
import { Artwork } from '../../data/artworks';
import { useRouter } from 'next/navigation';
import { getArtworks } from '../../services/api';

export default function GridGalleryPage() {
  const router = useRouter();
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await getArtworks();
        setArtworks(data);
      } catch (error) {
        console.error('Failed to fetch artworks:', error);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleArtworkClick = (artwork: Artwork) => {
    try {
      router.push(`/gallery/story?artwork=${artwork.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleToggleSearchFilter = () => {
    setShowSearchFilter(!showSearchFilter);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation 
        currentView="grid" 
        showSearchFilter={showSearchFilter}
        onToggleSearchFilter={handleToggleSearchFilter}
      />
      <GridGallery
        artworks={artworks}
        onArtworkClick={handleArtworkClick}
        showSearchFilter={showSearchFilter}
        onToggleSearchFilter={handleToggleSearchFilter}
      />
    </div>
  );
}