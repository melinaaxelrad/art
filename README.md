# Melina Axelrad Fine Art Website

A static-first website for displaying artwork, built for GitHub Pages deployment.

## Features

- **Portfolio Gallery**: Dynamic gallery with proper aspect ratio preservation
- **Image Detail Pages**: Click any artwork to view it with zoom and pan functionality
- **Multi-Angle Support**: Each artwork can have multiple images (angles)
- **Blog & Announcements**: Firebase-powered blog system with admin panel
- **Admin Panel**: Secure login for creating blog posts and announcements
- **Homepage Announcements**: Latest 3 announcements displayed on homepage
- **Mobile-Friendly**: Responsive design that works on all devices

## File Structure

```
/
├── index.html          # Main HTML file (SPA container)
├── router.js           # Client-side routing
├── app.js              # Main application logic
├── admin.js            # Admin panel functionality
├── firebase-config.js  # Firebase configuration (you add your keys)
├── firestore.rules     # Firestore security rules
├── styles.css          # All styles
├── images/              # Artwork images directory
├── content/
│   └── images.json     # Artwork data (titles, prices, angles, etc.)
└── README.md           # This file
```

## Adding New Artwork

### Step 1: Add Image Files
1. Place your image files in the `images/` directory
2. Use descriptive filenames with `.JPG` extension (e.g., `hydrangeas-main.JPG`, `hydrangeas-angle-1.JPG`)
3. **Important:** Use uppercase `.JPG` extension (not `.jpg`) - only capitalized extensions work on the website

### Step 2: Update `content/images.json`
Open `content/images.json` and add a new entry:

```json
{
  "id": "7",
  "title": "Your Artwork Title",
  "details": "20 x 24, oil on canvas",
  "price": "$1,500",
  "mainImage": "images/your-image.JPG",
  "angles": [
    "images/your-image.JPG",
    "images/your-image-angle-1.JPG",
    "images/your-image-angle-2.JPG"
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

## Login System

The site uses a simple login system (no Firebase required):
- **Anyone can log in** with any email and password
- **Only `melinaaxelrad@gmail.com` gets admin access**
- Login state is stored in browser session (cleared when browser closes)
- Admin access allows generating JSON for blog posts

## Adding Blog Posts or Announcements

Blog posts are stored in `content/posts.json` (hardcoded JSON file, similar to `images.json`).

### Method 1: Using Admin Panel (Recommended)

1. Navigate to `/admin` on your website (or click "Login" in the navbar)
2. Log in with email `melinaaxelrad@gmail.com` and any password
3. Fill out the "Create New Post" form:
   - **Type**: Select "blog" or "announcement"
   - **Title**: Post title
   - **Slug**: Auto-generated from title (or enter custom)
   - **Date**: Select date
   - **Excerpt**: Short description (optional)
   - **Content**: Full post content (Markdown supported)
4. Click "Generate JSON"
5. Copy the generated JSON
6. Open `content/posts.json` and add the new entry to the array (make sure to add a comma between entries)
7. Save and commit the file

### Method 2: Manual JSON Entry

Edit `content/posts.json` directly and add a new entry:

```json
{
  "id": "3",
  "title": "Your Post Title",
  "slug": "your-post-slug",
  "date": "2025-01-20",
  "type": "blog",
  "excerpt": "Short excerpt",
  "content": "<p>Your HTML content here. Use <strong>HTML</strong> tags.</p>"
}
```

**Note:** 
- `id` should be unique (use timestamp or incrementing number)
- `content` should be HTML (not markdown) - the admin panel converts markdown to HTML automatically
- `date` format: YYYY-MM-DD
- `type` should be either "blog" or "announcement"

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
- Check that `content/posts.json` exists and is valid JSON
- Verify posts have correct date format (YYYY-MM-DD)
- Check browser console for errors loading posts.json

**Routing not working locally:**
- Use a proper HTTP server (not `file://` protocol)
- Configure server to serve `index.html` for all routes

## Support

For questions or issues, contact: melinaaxelrad@gmail.com

