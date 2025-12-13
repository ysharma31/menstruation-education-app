# How to Add Videos to Your Educational App

## Step 1: Upload Videos to Supabase Storage

### Using the Upload Page in Your App (Recommended)

1. Navigate to `/upload-video` in your app (or click this link when running locally: http://localhost:5173/upload-video)
2. Click the upload area
3. Select your video file (MP4, WebM, or OGG)
4. Wait for upload to complete
5. Copy the **file name** that appears (you'll need this for Step 2)

### Alternative: Using Supabase Dashboard

Note: The Supabase Storage UI may not be available yet. If you see "Viewing and managing files is coming soon", use the Upload Page method above instead.

## Step 2: Add Video URLs to Your App

1. Open the file: `src/config/videoUrls.js`

2. Replace `null` with your video file name or full URL:

```javascript
export const videoUrls = {
  // Option 1: Just the filename (recommended)
  intro: 'intro-puberty.mp4',

  // Option 2: Full URL
  cycle: 'https://tnuvtylcrrnoewpxtzcb.supabase.co/storage/v1/object/public/videos/menstrual-cycle.mp4',

  // Keep as null if video not yet available
  products: null,
  myths: null,
  hygiene: null,
  support: null
};
```

3. Save the file

4. The videos will automatically appear on your "Watch & Learn" page!

## Video Mapping

Each video ID corresponds to a section on the "Watch & Learn" page:

| ID | Video Title | Description |
|---|---|---|
| `intro` | Introduction to Puberty | Basic overview for everyone |
| `cycle` | Understanding the Menstrual Cycle | Educational content about cycles |
| `products` | Hygiene & Products | Guide for girls about products |
| `myths` | Myths & Facts | Common misconceptions debunked |
| `hygiene` | Hygiene Practices | Practical hygiene tips |
| `support` | Being Supportive | Content for boys about being allies |

## Video File Requirements

- **Format**: MP4, WebM, or OGG
- **Maximum Size**: 100MB per file
- **Recommended Resolution**: 1280x720 (720p) or higher
- **Aspect Ratio**: 16:9 (standard widescreen)

## Testing Your Videos

1. After adding URLs, visit the `/animated` page in your app
2. Click on the video card you just added
3. The video should load and play in the modal

## Troubleshooting

**Video not loading?**
- Check that the URL is correct
- Make sure the video file uploaded successfully to Supabase
- Verify the bucket is set to "public"
- Check browser console for errors

**File too large?**
- Compress your video using tools like HandBrake or FFmpeg
- Reduce resolution to 720p if currently higher
- Use H.264 codec for better compression

**Wrong video showing?**
- Double-check the video ID matches the correct file
- Clear your browser cache and reload
