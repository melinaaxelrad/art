# Melina Axelrad Fine Art Website

A static-first website for displaying artwork, built for GitHub Pages deployment.

## Features

- **Portfolio Gallery**: Dynamic gallery with proper aspect ratio preservation
- **Image Detail Pages**: Click any artwork to view it with zoom and pan functionality
- **Multi-Angle Support**: Each artwork can have multiple images (angles)
- **Blog & Announcements**: Markdown-based blog system
- **Homepage Announcements**: Latest 3 announcements displayed on homepage
- **Mobile-Friendly**: Responsive design that works on all devices

## File Structure

```
/
├── index.html          # Main HTML file (SPA container)
├── router.js           # Client-side routing
├── app.js              # Main application logic
├── styles.css          # All styles
├── images/              # Artwork images directory
├── content/
│   ├── images.json     # Artwork data (titles, prices, angles, etc.)
│   ├── posts/          # Markdown blog posts
│   └── posts-manifest.json  # List of blog post files
└── README.md           # This file
```

## Adding New Artwork

### Step 1: Add Image Files
1. Place your image files in the `images/` directory
2. Use descriptive filenames (e.g., `hydrangeas-main.jpg`, `hydrangeas-angle-1.jpg`)

### Step 2: Update `content/images.json`
Open `content/images.json` and add a new entry:

```json
{
  "id": "7",
  "title": "Your Artwork Title",
  "details": "20 x 24, oil on canvas",
  "price": "$1,500",
  "mainImage": "images/your-image.jpg",
  "angles": [
    "images/your-image.jpg",
    "images/your-image-angle-1.jpg",
    "images/your-image-angle-2.jpg"
  ],
  "width": 20,
  "height": 24
}
```

**Fields:**
- `id`: Unique identifier (use next number in sequence)
- `title`: Artwork title
- `details`: Dimensions and medium
- `price`: Price or status (e.g., "SOLD", "on exhibition")
- `mainImage`: Path to the main/thumbnail image
- `angles`: Array of image paths (can be just one image, or multiple for different angles)
- `width` & `height`: Dimensions in inches (used to calculate aspect ratio)

**Note:** The `angles` array should always include at least the `mainImage`. If you only have one image, just include it once.

## Adding Blog Posts or Announcements

### Step 1: Create Markdown File
Create a new `.md` file in `content/posts/` with frontmatter:

```markdown
---
title: "Your Post Title"
date: "2025-01-20"
type: "blog"
excerpt: "Short excerpt that appears in listings"
slug: "your-post-slug"
---

Your post content here. Use **markdown** formatting.

## Headers

- Lists
- Work too

More content...
```

**Frontmatter Fields:**
- `title`: Post title
- `date`: Date in YYYY-MM-DD format
- `type`: Either `"blog"` or `"announcement"`
- `excerpt`: Short description (shown in listings)
- `slug`: URL-friendly identifier (used in `/blog/your-post-slug`)

### Step 2: Update Manifest
Add your new filename to `content/posts-manifest.json`:

```json
[
  "example-announcement.md",
  "welcome-blog.md",
  "your-new-post.md"
]
```

**Important:** The order in the manifest doesn't matter - posts are sorted by date automatically.

## Testing Locally

Since this is a static site, you can test it locally:

1. **Simple HTTP Server** (Python):
   ```bash
   python3 -m http.server 8000
   ```
   Then open http://localhost:8000

2. **Node.js http-server**:
   ```bash
   npx http-server
   ```

3. **VS Code Live Server**: Use the Live Server extension

**Note:** The site uses client-side routing, so you may need to configure your server to serve `index.html` for all routes (GitHub Pages does this automatically).

## Deployment to GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select your branch (usually `main`)
4. Select `/ (root)` as the source
5. Your site will be available at `https://yourusername.github.io/repository-name`

## Manual Testing Checklist

### Gallery
- [ ] All images load and display correctly
- [ ] Images maintain proper aspect ratios (not cropped awkwardly)
- [ ] Clicking an image navigates to detail page
- [ ] Gallery is responsive on mobile

### Image Detail Page
- [ ] Main image displays correctly
- [ ] Zoom in/out buttons work
- [ ] Click to zoom works
- [ ] Pan works when zoomed in
- [ ] Touch pinch-to-zoom works on mobile
- [ ] Angle thumbnails appear if multiple angles exist
- [ ] Clicking angle thumbnails switches the main image
- [ ] Back link returns to portfolio

### Blog
- [ ] Blog index page shows all posts
- [ ] Posts are sorted by date (newest first)
- [ ] Clicking a post opens the detail page
- [ ] Markdown formatting renders correctly
- [ ] Back link works

### Announcements
- [ ] Homepage shows latest 3 announcements
- [ ] Announcements link to full post pages
- [ ] Only announcements (not blog posts) appear

### Navigation
- [ ] All navigation links work
- [ ] Browser back/forward buttons work
- [ ] Direct URLs work (e.g., `/images/1`, `/blog/welcome-blog`)

## Troubleshooting

**Images not showing:**
- Check that image paths in `images.json` match actual filenames
- Ensure images are in the `images/` directory
- Check browser console for 404 errors

**Blog posts not appearing:**
- Verify the filename is in `posts-manifest.json`
- Check that frontmatter is correctly formatted (YAML syntax)
- Ensure the markdown file is in `content/posts/`

**Routing not working locally:**
- Use a proper HTTP server (not `file://` protocol)
- Configure server to serve `index.html` for all routes

## Support

For questions or issues, contact: melinaaxelrad@gmail.com

