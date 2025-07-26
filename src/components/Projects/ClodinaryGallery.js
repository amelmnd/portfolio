'use client';

import { useEffect, useState } from 'react';

export default function CloudinaryGallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch('/api/cloudinary?folder=home'); // remplace "home" par ton chemin Cloudinary
      const data = await res.json();
      setImages(data);
    };

    fetchImages();
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {images.map((img) => (
        <img
          key={img.asset_id}
          src={img.secure_url}
          alt={img.public_id}
          width={200}
        />
      ))}
    </div>
  );
}
