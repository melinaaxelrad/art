// Simple login system (no Firebase)
const ADMIN_EMAIL = 'melinaaxelrad@gmail.com';
const ADMIN_PASSWORD = '2337';

// Check if user is logged in
function isLoggedIn() {
    return sessionStorage.getItem('loggedIn') === 'true';
}

// Get logged in user email
function getLoggedInUser() {
    return sessionStorage.getItem('userEmail');
}

// Check if logged in user is admin
function isAdmin() {
    const userEmail = getLoggedInUser();
    return userEmail === ADMIN_EMAIL;
}

// Render login page
function renderAdminPage() {
    const main = document.querySelector('main');
    
    // Check if already logged in
    if (isLoggedIn()) {
        if (isAdmin()) {
            // Admin logged in - show admin UI
            renderAdminUI();
        } else {
            // Regular user logged in - show limited access message
            renderUserLoggedIn();
        }
        return;
    }

    // Not logged in - show login form
    renderLoginForm();
}

// Render login form
function renderLoginForm() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="admin-page">
            <h1>Login</h1>
            <form id="login-form" class="admin-form">
                <div class="form-group">
                    <label for="admin-email">Email</label>
                    <input type="email" id="admin-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="admin-password">Password</label>
                    <input type="password" id="admin-password" name="password" required>
                </div>
                <button type="submit">Login</button>
                <div id="login-error" class="error-message" style="display: none;"></div>
            </form>
        </div>
    `;

    const form = document.getElementById('login-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        const errorDiv = document.getElementById('login-error');

        // Simple login check - anyone can log in
        if (email && password) {
            // Store login state
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('userEmail', email);
            
            // Re-render page to show appropriate UI
            renderAdminPage();
        } else {
            errorDiv.textContent = 'Please enter both email and password.';
            errorDiv.style.display = 'block';
        }
    });

    if (typeof updateNavigation === 'function') {
        updateNavigation();
    }
}

// Render user logged in (non-admin)
function renderUserLoggedIn() {
    const main = document.querySelector('main');
    const userEmail = getLoggedInUser();
    main.innerHTML = `
        <div class="admin-page">
            <h1>Welcome</h1>
            <p>You are logged in as: <strong>${userEmail}</strong></p>
            <p>You do not have admin access. Only ${ADMIN_EMAIL} can create posts.</p>
            <button id="logout-btn" class="logout-btn">Logout</button>
        </div>
    `;

    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    if (typeof updateNavigation === 'function') {
        updateNavigation();
    }
}

// Render admin UI
function renderAdminUI() {
    const main = document.querySelector('main');
    const userEmail = getLoggedInUser();
    
    main.innerHTML = `
        <div class="admin-page">
            <div class="admin-header">
                <h1>Admin Panel</h1>
                <div class="admin-user-info">
                    <span>Logged in as: ${userEmail}</span>
                    <button id="logout-btn" class="logout-btn">Logout</button>
                </div>
            </div>

            ${isAdmin() ? `
            <div class="admin-section">
                <h2>Create New Post</h2>
                <p style="margin-bottom: 1.5rem; color: #666;">
                    Fill out the form below to generate a JSON entry. Copy the generated JSON and add it to <code>content/posts.json</code>.
                </p>
                <form id="post-form" class="admin-form">
                    <div class="form-group">
                        <label for="post-type">Type</label>
                        <select id="post-type" name="type" required>
                            <option value="blog">Blog</option>
                            <option value="announcement">Announcement</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="post-title">Title</label>
                        <input type="text" id="post-title" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="post-slug">Slug (auto-generated if empty)</label>
                        <input type="text" id="post-slug" name="slug" placeholder="Will be generated from title">
                    </div>
                    <div class="form-group">
                        <label for="post-date">Date</label>
                        <input type="date" id="post-date" name="date" required>
                    </div>
                    <div class="form-group">
                        <label for="post-excerpt">Excerpt</label>
                        <textarea id="post-excerpt" name="excerpt" rows="2"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="post-content">Content (Markdown supported)</label>
                        <textarea id="post-content" name="content" rows="10" required></textarea>
                    </div>
                    <button type="submit">Generate JSON</button>
                    <div id="post-message" class="success-message" style="display: none;"></div>
                </form>
                <div id="json-output" style="display: none; margin-top: 2rem;">
                    <h3>Generated JSON Entry</h3>
                    <p style="margin-bottom: 1rem; color: #666;">Copy this and add it to <code>content/posts.json</code>:</p>
                    <textarea id="json-textarea" readonly style="width: 100%; min-height: 200px; font-family: monospace; padding: 1rem; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                    <button id="copy-json-btn" class="logout-btn" style="margin-top: 1rem; background-color: #2C3E50;">Copy JSON</button>
                </div>
            </div>
            ` : `
            <div class="admin-section">
                <p>You do not have admin access. Only ${ADMIN_EMAIL} can create posts.</p>
            </div>
            `}
        </div>
    `;

    // Only set up form if user is admin and form exists
    if (isAdmin()) {
        const postTitleInput = document.getElementById('post-title');
        const postForm = document.getElementById('post-form');
        
        if (postTitleInput) {
            // Auto-generate slug from title
            postTitleInput.addEventListener('input', (e) => {
                const slugInput = document.getElementById('post-slug');
                if (!slugInput.value) {
                    const slug = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '');
                    slugInput.value = slug;
                }
            });
        }

        // Set default date to today
        const postDateInput = document.getElementById('post-date');
        if (postDateInput) {
            postDateInput.valueAsDate = new Date();
        }

        // Handle form submission
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                generatePostJSON();
            });
        }
    }

    // Handle logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    if (typeof updateNavigation === 'function') {
        updateNavigation();
    }
}

// Generate JSON for new post
function generatePostJSON() {
    // Check if user is admin
    if (!isAdmin()) {
        alert('Only admin users can create posts.');
        return;
    }

    const title = document.getElementById('post-title').value;
    let slug = document.getElementById('post-slug').value;
    const date = document.getElementById('post-date').value;
    const excerpt = document.getElementById('post-excerpt').value;
    const content = document.getElementById('post-content').value;
    const type = document.getElementById('post-type').value;

    // Auto-generate slug if empty
    if (!slug) {
        slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Parse markdown content to HTML
    const htmlContent = parseMarkdown(content);

    // Generate unique ID (timestamp-based)
    const id = Date.now().toString();

    // Create JSON entry
    const postEntry = {
        id: id,
        title: title,
        slug: slug,
        date: date,
        type: type,
        excerpt: excerpt || content.substring(0, 200),
        content: htmlContent
    };

    // Format JSON nicely
    const jsonString = JSON.stringify(postEntry, null, 2);

    // Show JSON output
    const jsonOutput = document.getElementById('json-output');
    const jsonTextarea = document.getElementById('json-textarea');
    const messageDiv = document.getElementById('post-message');

    jsonTextarea.value = jsonString;
    jsonOutput.style.display = 'block';
    messageDiv.textContent = 'JSON generated! Copy it and add to content/posts.json';
    messageDiv.style.display = 'block';
    messageDiv.className = 'success-message';

    // Scroll to JSON output
    jsonOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Copy button functionality
    document.getElementById('copy-json-btn').onclick = () => {
        jsonTextarea.select();
        document.execCommand('copy');
        alert('JSON copied to clipboard!');
    };

    // Reset form
    document.getElementById('post-form').reset();
    document.getElementById('post-date').valueAsDate = new Date();
}

// Simple markdown parser (same as in app.js)
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

// Handle logout
function handleLogout() {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('userEmail');
    // Re-render to show login form
    renderAdminPage();
}

// Register admin route
if (typeof router !== 'undefined') {
    router.register('/admin', renderAdminPage);
}

