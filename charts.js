/**
 * FloraOS - Charts Module
 * Wrapper for Chart.js or similar libraries.
 * Currently simulates charts using CSS/SVG for offline simplicity without heavy libraries.
 */

const Charts = {
    // Render a simple bar chart into a container
    renderBarChart: (containerId, data, labels, title) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Mock visualization using CSS bars
        let html = `<div style="display:flex; flex-direction:column; gap:0.5rem; height:100%; justify-content:flex-end;">`;
        html += `<h4 style="margin-bottom:1rem; font-size:0.9rem; color:#6b7280;">${title}</h4>`;
        html += `<div style="display:flex; align-items:flex-end; gap:10px; height:150px; border-bottom:1px solid #e5e7eb; padding-bottom:5px;">`;
        
        const max = Math.max(...data, 10);
        
        data.forEach((val, index) => {
            const height = (val / max) * 100;
            html += `
                <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:5px;">
                    <div style="width:100%; background:var(--primary-color); height:${height}%; border-radius:4px 4px 0 0; min-height:4px; opacity:0.8; transition: height 0.5s;"></div>
                    <span style="font-size:0.7rem; color:#6b7280;">${labels[index]}</span>
                </div>
            `;
        });
        
        html += `</div></div>`;
        container.innerHTML = html;
    },

    // Render a donut/pie chart (Simulated with CSS conic-gradient)
    renderPieChart: (containerId, percent, label) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div style="display:flex; align-items:center; gap:1rem;">
                <div style="
                    width: 60px; height: 60px; border-radius: 50%;
                    background: conic-gradient(var(--primary-color) ${percent}%, #e5e7eb 0);
                    display:flex; align-items:center; justify-content:center;
                ">
                    <div style="width:45px; height:45px; background:var(--bg-card); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:bold;">
                        ${percent}%
                    </div>
                </div>
                <div>
                    <div style="font-weight:bold; font-size:1.2rem;">${percent}%</div>
                    <div style="font-size:0.8rem; color:#6b7280;">${label}</div>
                </div>
            </div>
        `;
    }
};