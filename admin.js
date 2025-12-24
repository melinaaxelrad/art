// Admin functionality with Firebase Auth
let auth = null;
let db = null;
const ADMIN_EMAIL = 'melinaaxelrad@gmail.com';

// Check if Firebase is properly configured
function isFirebaseConfigured() {
    try {
        if (!window.firebaseModules) {
            return false;
        }
        // Check if firebaseConfig exists and is not a placeholder
        if (typeof firebaseConfig === 'undefined' || !firebaseConfig) {
            return false;
        }
        // Check if config has placeholder values
        if (firebaseConfig.apiKey === 'YOUR_API_KEY' || 
            firebaseConfig.projectId === 'YOUR_PROJECT_ID' ||
            !firebaseConfig.apiKey || 
            !firebaseConfig.projectId) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

// Initialize Firebase
function initFirebase() {
    if (!isFirebaseConfigured()) {
        console.warn('Firebase not configured. Admin features will not work.');
        return false;
    }

    try {
        if (!window.firebaseModules) {
            return false;
        }
        const app = window.firebaseModules.initializeApp(firebaseConfig);
        auth = window.firebaseModules.getAuth(app);
        db = window.firebaseModules.getFirestore(app);
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// Check if user is admin
function isAdmin(user) {
    return user && user.email === ADMIN_EMAIL;
}

// Render login page
function renderAdminPage() {
    const main = document.querySelector('main');
    
    // Check Firebase initialization
    if (!initFirebase()) {
        main.innerHTML = `
            <div class="admin-page">
                <h1>Login</h1>
                <div class="error-message" style="margin-top: 2rem;">
                    <h2>Login requires Firebase setup</h2>
                    <p>Firebase is not configured. To enable login features:</p>
                    <ol style="text-align: left; max-width: 600px; margin: 1rem auto;">
                        <li>Set up a Firebase project (see README.md)</li>
                        <li>Add your Firebase configuration to <code>firebase-config.js</code></li>
                        <li>Enable Email/Password authentication in Firebase Console</li>
                        <li>Create a user with email: <code>melinaaxelrad@gmail.com</code></li>
                    </ol>
                    <p>Once configured, you'll be able to log in and create blog posts and announcements.</p>
                </div>
            </div>
        `;
        if (typeof updateNavigation === 'function') {
            updateNavigation();
        }
        return;
    }

    // Check auth state
    try {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                // Not logged in - show login form
                renderLoginForm();
            } else if (isAdmin(user)) {
                // Admin logged in - show admin UI
                renderAdminUI(user);
            } else {
                // Logged in but not authorized
                renderNotAuthorized();
            }
        });
    } catch (error) {
        console.error('Auth state error:', error);
        renderLoginForm();
    }
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
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('admin-email').value;
        const password = document.getElementById('admin-password').value;
        const errorDiv = document.getElementById('login-error');

        try {
            const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            await signInWithEmailAndPassword(auth, email, password);
            // Auth state change will trigger re-render
        } catch (error) {
            errorDiv.textContent = error.message || 'Login failed. Please check your credentials.';
            errorDiv.style.display = 'block';
        }
    });

    if (typeof updateNavigation === 'function') {
        updateNavigation();
    }
}

// Render not authorized message
function renderNotAuthorized() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="admin-page">
            <h1>Not Authorized</h1>
            <p>You are logged in, but you do not have admin access.</p>
            <button id="logout-btn" class="logout-btn">Logout</button>
        </div>
    `;

    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    if (typeof updateNavigation === 'function') {
        updateNavigation();
    }
}

// Render admin UI
function renderAdminUI(user) {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="admin-page">
            <div class="admin-header">
                <h1>Admin Panel</h1>
                <div class="admin-user-info">
                    <span>Logged in as: ${user.email}</span>
                    <button id="logout-btn" class="logout-btn">Logout</button>
                </div>
            </div>

            <div class="admin-section">
                <h2>Create New Post</h2>
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
                    <button type="submit">Create Post</button>
                    <div id="post-message" class="success-message" style="display: none;"></div>
                </form>
            </div>
        </div>
    `;

    // Auto-generate slug from title
    document.getElementById('post-title').addEventListener('input', (e) => {
        const slugInput = document.getElementById('post-slug');
        if (!slugInput.value) {
            const slug = e.target.value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            slugInput.value = slug;
        }
    });

    // Set default date to today
    document.getElementById('post-date').valueAsDate = new Date();

    // Handle form submission
    document.getElementById('post-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await createPost();
    });

    // Handle logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    if (typeof updateNavigation === 'function') {
        updateNavigation();
    }
}

// Create new post
async function createPost() {
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

    const messageDiv = document.getElementById('post-message');

    try {
        const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        await addDoc(collection(db, 'posts'), {
            title,
            slug,
            date,
            excerpt: excerpt || content.substring(0, 200),
            content,
            type,
            published: true,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        });

        messageDiv.textContent = 'Post created successfully!';
        messageDiv.style.display = 'block';
        messageDiv.className = 'success-message';

        // Reset form
        document.getElementById('post-form').reset();
        document.getElementById('post-date').valueAsDate = new Date();

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    } catch (error) {
        messageDiv.textContent = 'Error creating post: ' + error.message;
        messageDiv.style.display = 'block';
        messageDiv.className = 'error-message';
    }
}

// Handle logout
async function handleLogout() {
    try {
        const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        await signOut(auth);
        // Auth state change will trigger re-render
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out: ' + error.message);
    }
}

// Register admin route
if (typeof router !== 'undefined') {
    router.register('/admin', renderAdminPage);
}

