/**
 * FloraOS - Dashboard Module
 * Handles KPI calculations, charts, and activity feeds.
 */

const Dashboard = {
    init: () => {
        console.log("Dashboard Module Loaded");
        Dashboard.loadKPIs();
        Dashboard.loadActivity();
        Dashboard.renderCharts();
        Dashboard.checkAlerts();
    },

    loadKPIs: () => {
        // Fetch data from DataManager
        const batches = DataManager.getItems('batches');
        const orders = DataManager.getItems('orders');
        
        // 1. Active Batches
        const activeBatches = batches.filter(b => b.status !== 'archived' && b.status !== 'contaminated').length;
        document.getElementById('kpi-batches').innerText = activeBatches;

        // 2. Estimated Plants (Mock calculation logic)
        let plantCount = 0;
        batches.forEach(b => {
            if(b.quantity) plantCount += parseInt(b.quantity);
        });
        document.getElementById('kpi-plants').innerText = plantCount.toLocaleString();

        // 3. Contam Rate (Mock)
        const contamBatches = batches.filter(b => b.status === 'contaminated').length;
        const total = batches.length || 1;
        const rate = ((contamBatches / total) * 100).toFixed(1);
        document.getElementById('kpi-contam').innerText = rate + "%";
        
        // 4. Pending Orders
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        document.getElementById('kpi-orders').innerText = pendingOrders;
    },

    loadActivity: () => {
        const list = document.getElementById('recent-activity-list');
        // In a real app, we'd have a specific 'activity_log' collection.
        // For now, let's look at recent Batches created.
        const batches = DataManager.getItems('batches')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        if (batches.length === 0) return;

        list.innerHTML = batches.map(b => `
            <div class="list-item">
                <div class="item-left">
                    <div class="item-icon"><i class="ph ph-flask"></i></div>
                    <div>
                        <div style="font-weight: 600;">Batch Created: ${b.name || 'Untitled'}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${Utils.formatDateTime(b.createdAt)}</div>
                    </div>
                </div>
                <div class="badge" style="position:static; background:var(--primary-light); color:var(--primary-dark); border:none;">
                    ${b.species || 'General'}
                </div>
            </div>
        `).join('');
    },

    renderCharts: () => {
        // Mock Data for Production Chart
        Charts.renderBarChart(
            'production-chart', 
            [12, 19, 3, 5, 2, 3, 15], 
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            'New Explants Initiated'
        );

        // Mock Data for Storage Pie
        Charts.renderPieChart('storage-chart', 75, 'Capacity Used');
    },

    checkAlerts: () => {
        const container = document.getElementById('alerts-list');
        const inventory = DataManager.getItems('inventory');
        const lowStock = inventory.filter(i => i.quantity <= i.minLevel);
        
        let html = '';
        
        if (lowStock.length > 0) {
            lowStock.forEach(item => {
                html += `
                    <div style="padding: 0.8rem; background: #fee2e2; color: #b91c1c; border-radius: 6px; font-size: 0.9rem; display:flex; align-items:center; gap:0.5rem;">
                        <i class="ph ph-warning"></i>
                        <span>Low Stock: <strong>${item.name}</strong> (${item.quantity} left)</span>
                    </div>
                `;
            });
        } else {
            html = `<div style="text-align:center; color:var(--text-muted); font-size:0.9rem;">No active alerts. System healthy.</div>`;
        }
        
        container.innerHTML = html;
    }
};