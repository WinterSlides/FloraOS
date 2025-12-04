/**
 * FloraOS - Main Application Logic
 * Handles Routing, UI Interaction, and Module Loading.
 */

const App = {
    currentPage: null,

    init: () => {
        console.log("FloraOS: System Booting...");
        
        // 1. Check Auth
        if (Auth.init()) {
            App.unlockSystem();
        } else {
            // Show Login Overlay (Default state in HTML)
        }

        // 2. Setup Global Listeners
        App.setupListeners();
    },

    setupListeners: () => {
        // Login Form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('login-user-type').value;
            const pass = document.getElementById('login-password').value;
            
            const result = Auth.login(type, pass);
            if (result.success) {
                App.unlockSystem();
            } else {
                document.getElementById('login-message').textContent = result.message || "Login Failed";
                document.getElementById('login-message').style.color = 'red';
            }
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', Auth.logout);

        // Sidebar Navigation
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Remove active class from all
                document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
                // Add to clicked
                e.currentTarget.classList.add('active');
                
                const page = e.currentTarget.getAttribute('data-page');
                App.loadPage(page);
                
                // Mobile: Close sidebar after click
                if (window.innerWidth < 768) {
                    document.getElementById('sidebar').classList.remove('open');
                }
            });
        });

        // Sidebar Toggle (Mobile)
        document.getElementById('sidebar-toggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });

        // Theme Toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            // Save preference
            const settings = DataManager.getItems('settings')[0];
            if (settings) {
                settings.theme = next;
                DataManager.saveItem('settings', settings);
            }
        });
    },

    unlockSystem: () => {
        document.getElementById('login-overlay').classList.add('hidden');
        document.getElementById('app-layout').classList.remove('hidden');
        
        // Load default page (Dashboard)
        App.loadPage('dashboard');
        
        // Load Settings (Theme)
        const settings = DataManager.getItems('settings')[0];
        if (settings && settings.theme) {
            document.documentElement.setAttribute('data-theme', settings.theme);
        }
    },

    loadPage: async (pageName) => {
        console.log(`Navigating to: ${pageName}`);
        const container = document.getElementById('view-container');
        const titleEl = document.getElementById('page-title');
        
        // Set Title
        const titleMap = {
            'dashboard': 'Command Dashboard',
            'media-kitchen': 'Media Kitchen',
            'inventory': 'Inventory ERP',
            'stock-plants': 'Mother Plant Registry',
            'batch-management': 'Batch LIMS',
            'analytics': 'Analytics & Reports'
        };
        titleEl.textContent = titleMap[pageName] || pageName.replace('-', ' ').toUpperCase();
        
        // Show Loading
        container.innerHTML = `<div class="loading-spinner"><i class="ph ph-spinner ph-spin"></i> Loading ${pageName}...</div>`;

        try {
            // 1. Fetch HTML content
            // In a real server, we fetch `${pageName}.html`. 
            // In this generated file setup, we assume the file exists relative to index.
            const response = await fetch(`${pageName}.html`);
            
            if (!response.ok) throw new Error(`Module ${pageName} not found.`);
            
            const html = await response.text();
            container.innerHTML = html;

            // 2. Load associated JS Module dynamically
            await Utils.loadScript(`js/${pageName}.js`);
            
            // 3. Initialize Module if it exists
            // We expect every module JS to expose a global object: e.g., MediaKitchen, Inventory, Dashboard
            // Convention: camelCase name of the module
            const moduleName = pageName.split('-').map((word, index) => {
                if (index === 0) return word; // first word lowercase? No, usually Objects are Uppercase.
                // Let's standardise: dashboard -> Dashboard, media-kitchen -> MediaKitchen
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join('');
            
            // Fix first letter for first word
            const moduleObjName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
            
            if (window[moduleObjName] && typeof window[moduleObjName].init === 'function') {
                console.log(`Initializing Module: ${moduleObjName}`);
                window[moduleObjName].init();
            }

        } catch (err) {
            console.warn(`Failed to load module ${pageName}:`, err);
            container.innerHTML = `
                <div style="text-align:center; padding: 2rem; color: var(--text-muted);">
                    <h2>Module Under Construction</h2>
                    <p>The file <code>${pageName}.html</code> has not been generated yet.</p>
                    <p>Please proceed to the next prompt step to generate this module.</p>
                </div>
            `;
        }
    }
};

// Start the engine
document.addEventListener('DOMContentLoaded', App.init);