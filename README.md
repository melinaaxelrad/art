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

## Firebase Setup (Required for Admin Panel)

The site uses Firebase for secure admin authentication and blog post storage.

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard (disable Google Analytics if you don't need it)

### Step 2: Enable Email/Password Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Email/Password**
3. Enable "Email/Password" and click **Save**

### Step 3: Create Admin User

1. Go to **Authentication** > **Users**
2. Click **Add user**
3. Enter email: `melinaaxelrad@gmail.com`
4. Set a password (you'll use this to log in)
5. Click **Add user**

**Important:** The password is set in Firebase Console, NOT in the code. This keeps it secure.

### Step 4: Create Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click **Create database**
3. Start in **production mode** (we'll add security rules)
4. Choose a location (select closest to your users)
5. Click **Enable**

### Step 5: Apply Security Rules

1. Go to **Firestore Database** > **Rules**
2. Copy the contents of `firestore.rules` from this repository
3. Paste into the rules editor
4. Click **Publish**

The rules allow:
- **Public read** access to all posts
- **Write access** only for `melinaaxelrad@gmail.com`

### Step 6: Get Firebase Configuration

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register app with a nickname (e.g., "Melina Art Website")
5. Copy the `firebaseConfig` object

### Step 7: Add Configuration to Site

1. Open `firebase-config.js` in this repository
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

3. Save the file

**Security Note:** These keys are safe to expose in client-side code. Firebase security rules protect your data.

## Adding Blog Posts or Announcements (Admin Panel)

Once Firebase is set up:

1. Navigate to `/admin` on your website
2. Log in with `melinaaxelrad@gmail.com` and your password
3. Fill out the "Create New Post" form:
   - **Type**: Select "blog" or "announcement"
   - **Title**: Post title
   - **Slug**: Auto-generated from title (or enter custom)
   - **Date**: Select date
   - **Excerpt**: Short description (optional)
   - **Content**: Full post content (Markdown supported)
4. Click "Create Post"

Posts are stored in Firestore and appear immediately on the site.

**Note:** Blog posts are stored in Firestore and must be created through the admin panel. There is no markdown fallback.

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
- Check that Firebase is configured correctly
- Verify posts were created via the admin panel
- Check Firestore security rules allow public read access
- Check browser console for errors

**Routing not working locally:**
- Use a proper HTTP server (not `file://` protocol)
- Configure server to serve `index.html` for all routes

## Support

For questions or issues, contact: melinaaxelrad@gmail.com

