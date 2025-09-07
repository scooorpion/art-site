'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import StoryGallery from '../../components/StoryGallery';
import Navigation from '../../components/Navigation';
import { Artwork } from '../../data/artworks';
import { getArtworks } from '../../services/api';

function StoryGalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const artworkId = searchParams.get('artwork');
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
  
  const selectedArtwork = artworkId 
    ? artworks.find(artwork => artwork.id === artworkId)
    : undefined;

  const handleClose = () => {
    try {
      router.push('/gallery/grid');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation currentView="story" />
      <StoryGallery
        artworks={artworks}
        selectedArtwork={selectedArtwork}
        onClose={handleClose}
      />
    </div>
  );
}

export default function StoryGalleryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StoryGalleryContent />
    </Suspense>
  );
}