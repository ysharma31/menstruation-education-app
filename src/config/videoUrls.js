const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const videoUrls = {
  intro: 'Puberty_ Your Amazing Journey.mp4',
  cycle: null,
  products: null,
  myths: null,
  hygiene: null,
  support: null
};

export const getVideoUrl = (videoId) => {
  const url = videoUrls[videoId];
  if (!url) return null;

  if (url.startsWith('http')) {
    return url;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/videos/${url}`;
};
