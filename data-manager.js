/**
 * FloraOS - Data Manager
 * Handles all offline storage interactions (LocalStorage wrapper).
 * Designed to be swappable with IndexedDB in future versions.
 */

const DataManager = {
    prefix: 'floraos_',

    // Initialize default data if empty
    init: () => {
        console.log("DataManager: Initializing...");
        // Ensure critical collections exist
        const collections = ['users', 'settings', 'stockPlants', 'batches', 'inventory', 'orders'];
        collections.forEach(col => {
            if (!localStorage.getItem(DataManager.prefix + col)) {
                localStorage.setItem(DataManager.prefix + col, JSON.stringify([]));
            }
        });
        
        // Default Settings
        if (JSON.parse(localStorage.getItem(DataManager.prefix + 'settings')).length === 0) {
            DataManager.saveItem('settings', {
                id: 'global_settings',
                theme: 'light',
                currency: 'AUD',
                labName: 'My Tissue Culture Lab'
            });
        }
    },

    // Create or Update an item
    saveItem: (collection, item) => {
        try {
            const key = DataManager.prefix + collection;
            let data = JSON.parse(localStorage.getItem(key)) || [];
            
            if (!item.id) {
                item.id = Utils.generateId();
                item.createdAt = new Date().toISOString();
            }
            item.updatedAt = new Date().toISOString();

            const index = data.findIndex(i => i.id === item.id);
            if (index >= 0) {
                data[index] = { ...data[index], ...item }; // Merge updates
            } else {
                data.push(item);
            }

            localStorage.setItem(key, JSON.stringify(data));
            return item;
        } catch (e) {
            console.error(`Save failed for ${collection}:`, e);
            return null;
        }
    },

    // Read a single item by ID
    getItem: (collection, id) => {
        const key = DataManager.prefix + collection;
        const data = JSON.parse(localStorage.getItem(key)) || [];
        return data.find(i => i.id === id);
    },

    // Read all items (optional filter function)
    getItems: (collection, filterFn = null) => {
        const key = DataManager.prefix + collection;
        const data = JSON.parse(localStorage.getItem(key)) || [];
        return filterFn ? data.filter(filterFn) : data;
    },

    // Delete an item
    deleteItem: (collection, id) => {
        const key = DataManager.prefix + collection;
        let data = JSON.parse(localStorage.getItem(key)) || [];
        const newData = data.filter(i => i.id !== id);
        localStorage.setItem(key, JSON.stringify(newData));
    },

    // Full System Export (Backup)
    exportAll: () => {
        const backup = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(DataManager.prefix)) {
                backup[key] = JSON.parse(localStorage.getItem(key));
            }
        }
        return JSON.stringify(backup);
    },

    // Import Backup
    importAll: (jsonString) => {
        try {
            const backup = JSON.parse(jsonString);
            Object.keys(backup).forEach(key => {
                if (key.startsWith(DataManager.prefix)) {
                    localStorage.setItem(key, JSON.stringify(backup[key]));
                }
            });
            return true;
        } catch (e) {
            console.error("Import failed", e);
            return false;
        }
    }
};

// Initialize on load
DataManager.init();