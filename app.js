// Main application logic
let artworks = [];
let blogPosts = [];

// Get base path for assets (handles GitHub Pages subdirectory)
function getBasePath() {
    const path = window.location.pathname;
    // If path is like /art/index.html or /art/, return /art/
    // Otherwise return /
    if (path.includes('/art/')) {
        return '/art/';
    }
    return '/';
}

// Convert relative image path to absolute path
function getImagePath(relativePath) {
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://') || relativePath.startsWith('/')) {
        return relativePath;
    }
    const base = getBasePath();
    // Remove leading ./ or images/ if present, then add base
    const cleanPath = relativePath.replace(/^\.\//, '').replace(/^images\//, '');
    return base + 'images/' + cleanPath;
}

// Simple markdown parser (basic support)
function parseMarkdown(md) {
    // Convert headers
    md = md.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    md = md.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    md = md.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Convert bold
    md = md.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    
    // Convert italic
    md = md.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    // Convert paragraphs
    md = md.replace(/\n\n/gim, '</p><p>');
    md = '<p>' + md + '</p>';
    
    // Convert line breaks
    md = md.replace(/\n/gim, '<br>');
    
    return md;
}

// Parse frontmatter from markdown
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { data: {}, content: content };
    }
    
    const frontmatter = match[1];
    const body = match[2];
    const data = {};
    
    frontmatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            // Remove quotes
            value = value.replace(/^["']|["']$/g, '');
            data[key] = value;
        }
    });
    
    return { data, content: body };
}

// Load artworks from JSON
async function loadArtworks() {
    try {
        const basePath = getBasePath();
        const response = await fetch(basePath + 'content/images.json');
        if (!response.ok) {
            throw new Error(`Failed to load images.json: ${response.status}`);
        }
        artworks = await response.json();
        // Ensure all image paths are absolute
        artworks = artworks.map(artwork => ({
            ...artwork,
            mainImage: getImagePath(artwork.mainImage),
            angles: artwork.angles.map(angle => getImagePath(angle))
        }));
        return artworks;
    } catch (error) {
        console.error('Error loading artworks:', error);
        return [];
    }
}

// Load blog posts from JSON file
async function loadBlogPosts() {
    try {
        const basePath = getBasePath();
        const response = await fetch(basePath + 'content/posts.json');
        if (!response.ok) {
            console.warn('Could not load posts.json');
            blogPosts = [];
            return blogPosts;
        }
        const posts = await response.json();
        
        // Sort by date (newest first)
        blogPosts = posts.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        return blogPosts;
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogPosts = [];
        return blogPosts;
    }
}

// Render gallery with proper aspect ratios
function renderGallery(artworksData) {
    const grid = document.querySelector('.artwork-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    artworksData.forEach(artwork => {
        const item = document.createElement('div');
        item.className = 'artwork-item';
        item.setAttribute('data-route', `/images/${artwork.id}`);
        
        // Calculate aspect ratio
        const aspectRatio = artwork.width && artwork.height 
            ? artwork.width / artwork.height 
            : 1;
        
        const imageContainer = document.createElement('div');
        imageContainer.className = 'artwork-image';
        imageContainer.style.aspectRatio = aspectRatio;
        imageContainer.style.cursor = 'pointer';
        
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder-image';
        placeholder.innerHTML = '<span>Loading...</span>';
        
        const img = document.createElement('img');
        img.src = artwork.mainImage;
        img.alt = artwork.title;
        img.onload = () => {
            if (placeholder) placeholder.style.display = 'none';
        };
        img.onerror = (e) => {
            console.warn('Failed to load image:', artwork.mainImage);
            img.style.display = 'none';
        };
        
        imageContainer.appendChild(placeholder);
        imageContainer.appendChild(img);
        
        imageContainer.addEventListener('click', () => {
            router.navigate(`/images/${artwork.id}`);
        });
        
        const info = document.createElement('div');
        info.className = 'artwork-info';
        info.innerHTML = `
            <h3>${artwork.title}</h3>
            <p class="artwork-details">${artwork.details}</p>
            <p class="artwork-price">${artwork.price}</p>
        `;
        
        item.appendChild(imageContainer);
        item.appendChild(info);
        grid.appendChild(item);
    });
}

// Render image detail page
function renderImageDetail(id) {
    const artwork = artworks.find(a => a.id === id);
    if (!artwork) {
        renderHome();
        return;
    }
    
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="image-detail-page">
            <a href="/" data-route="/" class="back-link">← Back to Portfolio</a>
            
            <div class="image-detail-container">
                <div class="image-viewer">
                    <div class="main-image-container" id="main-image-container">
                        <img src="${artwork.mainImage}" alt="${artwork.title}" id="main-image" class="zoomable-image">
                        <div class="zoom-controls">
                            <button id="zoom-in" class="zoom-btn">+</button>
                            <button id="zoom-out" class="zoom-btn">−</button>
                            <button id="zoom-reset" class="zoom-btn">Reset</button>
                        </div>
                    </div>
                    
                    ${artwork.angles && artwork.angles.length > 1 ? `
                        <div class="angle-thumbnails">
                            ${artwork.angles.map((angle, index) => `
                                <img src="${angle}" 
                                     alt="Angle ${index + 1}" 
                                     class="angle-thumb ${index === 0 ? 'active' : ''}"
                                     data-angle="${index}"
                                     onclick="switchAngle(${index}, '${artwork.id}')">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <div class="image-metadata">
                    <h1>${artwork.title}</h1>
                    <p class="artwork-details">${artwork.details}</p>
                    <p class="artwork-price">${artwork.price}</p>
                </div>
            </div>
        </div>
    `;
    
    // Initialize zoom
    initZoom();
    
    // Update navigation
    updateNavigation();
}

// Switch between angles
window.switchAngle = function(index, artworkId) {
    const artwork = artworks.find(a => a.id === artworkId);
    if (!artwork || !artwork.angles) return;
    
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.angle-thumb');
    
    if (mainImage && artwork.angles[index]) {
        mainImage.src = artwork.angles[index];
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
};

// Initialize zoom functionality
function initZoom() {
    const container = document.getElementById('main-image-container');
    const image = document.getElementById('main-image');
    if (!container || !image) return;
    
    let scale = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let startX, startY;
    
    // Zoom buttons
    document.getElementById('zoom-in')?.addEventListener('click', () => {
        scale = Math.min(scale * 1.5, 5);
        updateTransform();
    });
    
    document.getElementById('zoom-out')?.addEventListener('click', () => {
        scale = Math.max(scale / 1.5, 1);
        updateTransform();
    });
    
    document.getElementById('zoom-reset')?.addEventListener('click', () => {
        scale = 1;
        panX = 0;
        panY = 0;
        updateTransform();
    });
    
    // Click to zoom
    image.addEventListener('click', (e) => {
        if (scale === 1) {
            scale = 2;
        } else {
            scale = 1;
            panX = 0;
            panY = 0;
        }
        updateTransform();
    });
    
    // Pan on drag
    image.addEventListener('mousedown', (e) => {
        if (scale > 1) {
            isDragging = true;
            startX = e.clientX - panX;
            startY = e.clientY - panY;
        }
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging && scale > 1) {
            panX = e.clientX - startX;
            panY = e.clientY - startY;
            updateTransform();
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Touch support
    let lastTouchDistance = 0;
    
    image.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            lastTouchDistance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
        }
    });
    
    image.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            if (lastTouchDistance > 0) {
                scale *= distance / lastTouchDistance;
                scale = Math.max(1, Math.min(scale, 5));
                updateTransform();
            }
            lastTouchDistance = distance;
        }
    });
    
    function updateTransform() {
        image.style.transform = `scale(${scale}) translate(${panX / scale}px, ${panY / scale}px)`;
        image.style.cursor = scale > 1 ? 'move' : 'zoom-in';
    }
}

// Render blog index
async function renderBlogIndex() {
    await loadBlogPosts();
    
    // Filter to show only blog posts (not announcements)
    const blogOnlyPosts = blogPosts.filter(post => post.type === 'blog');
    
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="blog-page">
            <h1>Blog</h1>
            <div class="blog-posts-list">
                ${blogOnlyPosts.length > 0 ? blogOnlyPosts.map(post => `
                    <article class="blog-post-preview">
                        <h2><a href="/blog/${post.slug}" data-route="/blog/${post.slug}">${post.title}</a></h2>
                        <div class="post-meta">
                            <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                            <span class="post-type">Blog</span>
                        </div>
                        <p class="post-excerpt">${post.excerpt || ''}</p>
                        <a href="/blog/${post.slug}" data-route="/blog/${post.slug}" class="read-more">Read more →</a>
                    </article>
                `).join('') : '<p>No blog posts yet.</p>'}
            </div>
        </div>
    `;
    
    updateNavigation();
}

// Render blog post
async function renderBlogPost(slug) {
    await loadBlogPosts();
    const post = blogPosts.find(p => p.slug === slug);
    
    if (!post) {
        renderBlogIndex();
        return;
    }
    
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="blog-post-page">
            <a href="/blog" data-route="/blog" class="back-link">← Back to Blog</a>
            <article class="blog-post">
                <h1>${post.title}</h1>
                <div class="post-meta">
                    <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                    <span class="post-type">${post.type === 'announcement' ? 'Announcement' : 'Blog'}</span>
                </div>
                <div class="post-content">
                    ${post.content}
                </div>
            </article>
        </div>
    `;
    
    updateNavigation();
}

// Render homepage
async function renderHome() {
    await loadArtworks();
    
    const main = document.querySelector('main');
    main.innerHTML = `
        <section id="announcements" class="announcements-section">
            <h2>Latest Announcements</h2>
            <div class="announcements-list" id="announcements-list">
                <p>Loading announcements...</p>
            </div>
        </section>
        
        <section id="portfolio" class="portfolio-section">
            <h2>Portfolio</h2>
            <div class="artwork-grid"></div>
        </section>

        <section id="about" class="about-section">
            <div class="about-content">
                <h2>About</h2>
                <p>
                    Melina is a 21-year-old resident of Arlington, Virginia, with a deep love of painting. Her passion comes from
                    her late grandmother, Florence-ann, an exceptional multimedia artist who supported Melina in her creative 
                    endeavors.
                </p>
                <p>
                    Her work primarily explores lighting and shapes in landscapes, using oil paint to achieve rich color saturation
                    and blending. She explores landscapes that range from her backyard to faraway mountains and oceansides. 
                </p>
            </div>
        </section>

        <section id="contact" class="contact-section">
            <div class="contact-content">
                <h2>Contact</h2>
                <p>For inquiries about available work, commissions, or exhibitions, please reach out:</p>
                <div class="contact-info">
                    <p><strong>Email:</strong> <a href="mailto:melinaaxelrad@gmail.com">melinaaxelrad@gmail.com</a></p>
                    <p><strong>Phone:</strong> (703) 577-8805</p>
                </div>
                <form class="contact-form">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="5" required></textarea>
                    </div>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </section>
    `;
    
    renderGallery(artworks);
    loadAnnouncements();
    initContactForm();
    updateNavigation();
}

// Load and render announcements
async function loadAnnouncements() {
    await loadBlogPosts();
    const announcements = blogPosts
        .filter(p => p.type === 'announcement')
        .slice(0, 3);
    
    const container = document.getElementById('announcements-list');
    if (!container) return;
    
    if (announcements.length === 0) {
        container.innerHTML = '<p>No announcements at this time.</p>';
        return;
    }
    
    container.innerHTML = announcements.map(announcement => `
        <div class="announcement-item">
            <h3><a href="/blog/${announcement.slug}" data-route="/blog/${announcement.slug}">${announcement.title}</a></h3>
            <p class="announcement-date">${new Date(announcement.date).toLocaleDateString()}</p>
            <p class="announcement-excerpt">${announcement.excerpt}</p>
        </div>
    `).join('');
}

// Initialize contact form
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! This form is currently a placeholder. Please contact Melina directly using the email address provided.');
            this.reset();
        });
    }
}

// Update navigation active state
function updateNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href') || link.getAttribute('data-route');
        if (href === currentPath || (currentPath === '/' && href === '#portfolio')) {
            link.classList.add('active');
        }
    });
}

// Register routes
router.register('/', renderHome);
router.register('/images/:id', renderImageDetail);
router.register('/blog', renderBlogIndex);
router.register('/blog/:slug', renderBlogPost);

// Initialize on load - ensure it always runs even if Firebase fails
document.addEventListener('DOMContentLoaded', () => {
    try {
        router.handleRoute();
    } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback: try to render home page
        try {
            renderHome();
        } catch (e) {
            console.error('Failed to render home page:', e);
        }
    }
});

