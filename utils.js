/**
 * FloraOS - Shared Utility Functions
 * Handles ID generation, date formatting, and common helpers.
 */

const Utils = {
    // Generate a unique ID (UUID v4 style-ish)
    generateId: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // Format date for display (DD/MM/YYYY)
    formatDate: (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    },

    // Format date with time
    formatDateTime: (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    },

    // Format currency (AUD)
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency', currency: 'AUD'
        }).format(amount || 0);
    },

    // Simple debounce to prevent rapid firing events
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Generate CSV from array of objects
    exportToCSV: (data, filename) => {
        if (!data || !data.length) {
            alert("No data to export.");
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','), // Header row
            ...data.map(row => headers.map(fieldName => {
                let cell = row[fieldName] === null || row[fieldName] === undefined ? '' : row[fieldName];
                cell = cell.toString().replace(/"/g, '""'); // Escape quotes
                if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`; // Quote complex cells
                return cell;
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },

    // Dynamic Script Loader (for modularity)
    loadScript: (src) => {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve(); // Already loaded
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    },

    // Show a temporary toast notification
    showToast: (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            padding: 1rem 1.5rem; background: #333; color: white;
            border-radius: 8px; z-index: 10000; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease-out;
        `;
        if (type === 'success') toast.style.background = '#10b981';
        if (type === 'error') toast.style.background = '#ef4444';
        
        toast.innerText = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Simple Hash for passwords (client-side only/demo purposes)
    // In production, use Web Crypto API
    hashString: (str) => {
        let hash = 0, i, chr;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString();
    }
};