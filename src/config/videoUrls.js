const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const videoUrls = {
  intro: '1773592378673-a052n43319v.mp4',
  cycle: '1773592833285-ax2boy14rg.mp4',
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
