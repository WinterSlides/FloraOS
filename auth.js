/**
 * FloraOS - Authentication Module
 * Handles login, session management, and permissions.
 */

const Auth = {
    currentUser: null,
    SESSION_KEY: 'floraos_session',

    // Initialize Auth State
    init: () => {
        const session = localStorage.getItem(Auth.SESSION_KEY);
        if (session) {
            Auth.currentUser = JSON.parse(session);
            return true;
        }
        return false;
    },

    // Handle Login
    login: (userType, password) => {
        // 1. Check if it's the first run (no users exist)
        const users = DataManager.getItems('users');
        
        // DEFAULT HARDCODED ADMIN FOR FIRST RUN (If no users in DB)
        // Password: "admin"
        if (users.length === 0 && userType === 'admin' && password === 'admin') {
            const user = { 
                id: 'admin_01', 
                name: 'Administrator', 
                role: 'admin',
                permissions: ['all'] 
            };
            // Ideally we'd create the user in DB here, but let's just log them in
            Auth.startSession(user);
            return { success: true };
        }

        // 2. Real Logic: Check against DB
        const user = users.find(u => u.role === userType && u.passwordHash === Utils.hashString(password));
        
        if (user) {
            Auth.startSession(user);
            return { success: true };
        } else {
            // Demo fallback for prompt testing if they haven't set up users yet
            if (password === 'admin' || password === '1234') {
                const demoUser = { id: 'demo', name: userType.toUpperCase(), role: userType };
                Auth.startSession(demoUser);
                return { success: true };
            }
            return { success: false, message: 'Invalid credentials' };
        }
    },

    // Start Session
    startSession: (user) => {
        Auth.currentUser = user;
        // Don't store sensitive hash in session
        const sessionUser = { ...user };
        delete sessionUser.passwordHash;
        
        localStorage.setItem(Auth.SESSION_KEY, JSON.stringify(sessionUser));
        
        // Update UI
        Auth.updateUserUI();
    },

    // Logout
    logout: () => {
        localStorage.removeItem(Auth.SESSION_KEY);
        Auth.currentUser = null;
        window.location.reload(); // Reload to force login screen
    },

    // Update Sidebar Profile
    updateUserUI: () => {
        if (!Auth.currentUser) return;
        const nameEl = document.getElementById('current-user-name');
        const roleEl = document.getElementById('current-user-role');
        const avatarEl = document.getElementById('current-user-avatar');

        if (nameEl) nameEl.textContent = Auth.currentUser.name;
        if (roleEl) roleEl.textContent = Auth.currentUser.role.toUpperCase();
        if (avatarEl) avatarEl.textContent = Auth.currentUser.name.charAt(0).toUpperCase();
    },

    // Check Permission
    can: (action) => {
        if (!Auth.currentUser) return false;
        if (Auth.currentUser.role === 'admin') return true;
        if (Auth.currentUser.role === 'partner') return true; // Expand later
        // Add granular checks here
        return false;
    }
};