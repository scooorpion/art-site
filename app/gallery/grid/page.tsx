'use client';

import GridGallery from '../../components/GridGallery';
import Navigation from '../../components/Navigation';
import { artworks } from '../../data/artworks';
import { Artwork } from '../../data/artworks';
import { useRouter } from 'next/navigation';

export default function GridGalleryPage() {
  const router = useRouter();

  const handleArtworkClick = (artwork: Artwork) => {
    try {
      router.push(`/gallery/story?artwork=${artwork.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation currentView="grid" />
      <GridGallery
        artworks={artworks}
        onArtworkClick={handleArtworkClick}
      />
    </div>
  );
}