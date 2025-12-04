/**
 * FloraOS - Media Kitchen Module
 * Handles recipe management, scaling calculations, and media batch logging.
 */

const MediaKitchen = {
    // Default recipes to populate if empty
    defaultRecipes: [
        {
            id: 'ms-full',
            name: 'MS Full Strength',
            base: 'Murashige & Skoog',
            ingredients: [
                { name: 'MS Basal Salts', amount: 4.43, unit: 'g/L' },
                { name: 'Sucrose', amount: 30, unit: 'g/L' },
                { name: 'Agar', amount: 7, unit: 'g/L' },
                { name: 'Myo-Inositol', amount: 0.1, unit: 'g/L' }
            ]
        },
        {
            id: 'ms-half-rooting',
            name: '1/2 MS Rooting',
            base: 'Murashige & Skoog',
            ingredients: [
                { name: 'MS Basal Salts', amount: 2.215, unit: 'g/L' },
                { name: 'Sucrose', amount: 20, unit: 'g/L' },
                { name: 'IBA (Hormone)', amount: 0.5, unit: 'mg/L' },
                { name: 'Agar', amount: 7, unit: 'g/L' }
            ]
        }
    ],

    currentRecipe: null,

    init: () => {
        console.log("Media Kitchen Loaded");
        
        // Ensure recipes exist in DB
        let recipes = DataManager.getItems('mediaRecipes');
        if (recipes.length === 0) {
            MediaKitchen.defaultRecipes.forEach(r => DataManager.saveItem('mediaRecipes', r));
            recipes = MediaKitchen.defaultRecipes;
        }

        MediaKitchen.populateSelect(recipes);
        MediaKitchen.renderRecipeGrid(recipes);
        MediaKitchen.renderHistory();
    },

    populateSelect: (recipes) => {
        const select = document.getElementById('calc-recipe-select');
        select.innerHTML = '<option value="">-- Choose Base Medium --</option>';
        recipes.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.id;
            opt.textContent = r.name;
            select.appendChild(opt);
        });
    },

    switchTab: (tabName) => {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        
        // Show target
        document.getElementById(`tab-${tabName}`).classList.remove('hidden');
        
        // Highlight button (hacky selector for demo)
        const buttons = document.querySelectorAll('.tab-btn');
        if (tabName === 'calculator') buttons[0].classList.add('active');
        if (tabName === 'recipes') buttons[1].classList.add('active');
        if (tabName === 'history') buttons[2].classList.add('active');
    },

    loadRecipeToCalc: () => {
        const id = document.getElementById('calc-recipe-select').value;
        if (!id) {
            MediaKitchen.currentRecipe = null;
            document.getElementById('calc-ingredients-list').innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;">Select a recipe to begin.</div>';
            return;
        }

        MediaKitchen.currentRecipe = DataManager.getItem('mediaRecipes', id);
        MediaKitchen.calculate();
    },

    calculate: () => {
        if (!MediaKitchen.currentRecipe) return;

        const volume = parseFloat(document.getElementById('calc-volume').value) || 0;
        document.getElementById('disp-volume').innerText = volume.toFixed(1);

        const list = document.getElementById('calc-ingredients-list');
        let html = '';

        MediaKitchen.currentRecipe.ingredients.forEach(ing => {
            const total = (ing.amount * volume).toLocaleString(undefined, { maximumFractionDigits: 3 });
            html += `
                <div class="ingredient-row">
                    <span style="font-weight: 600;">${ing.name}</span>
                    <span style="font-family: monospace; font-size: 1.1rem; color: var(--primary-dark);">
                        ${total} <span style="font-size: 0.8rem; color: var(--text-muted);">${ing.unit.split('/')[0]}</span>
                    </span>
                </div>
            `;
        });

        list.innerHTML = html;
    },

    saveBatch: () => {
        if (!MediaKitchen.currentRecipe) {
            Utils.showToast("Please select a recipe first.", "error");
            return;
        }

        const vol = document.getElementById('calc-volume').value;
        const vessels = document.getElementById('calc-vessels').value || 0;
        const vesselType = document.getElementById('calc-vessel-type').value;

        // Create Batch Log
        const batchId = 'MED-' + Date.now().toString().slice(-6);
        const log = {
            id: batchId,
            recipeName: MediaKitchen.currentRecipe.name,
            volume: vol,
            vessels: vessels,
            vesselType: vesselType,
            createdBy: Auth.currentUser ? Auth.currentUser.name : 'Unknown',
            createdAt: new Date().toISOString()
        };

        DataManager.saveItem('mediaLogs', log);
        Utils.showToast(`Media Batch ${batchId} Saved! Printing labels...`, "success");
        
        // Refresh history if open
        MediaKitchen.renderHistory();

        // Simulate Print PDF (future expansion)
        console.log("Simulating Label Print for", log);
    },

    renderRecipeGrid: (recipes) => {
        const grid = document.getElementById('recipe-grid');
        grid.innerHTML = recipes.map(r => `
            <div class="recipe-card" onclick="MediaKitchen.selectRecipeFromGrid('${r.id}')">
                <div style="font-weight: 700; color: var(--primary-dark);">${r.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">${r.base}</div>
                <div style="font-size: 0.8rem;">${r.ingredients.length} Ingredients</div>
            </div>
        `).join('');
    },

    selectRecipeFromGrid: (id) => {
        MediaKitchen.switchTab('calculator');
        const select = document.getElementById('calc-recipe-select');
        select.value = id;
        MediaKitchen.loadRecipeToCalc();
    },

    renderHistory: () => {
        const logs = DataManager.getItems('mediaLogs').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        const tbody = document.querySelector('#media-history-table tbody');
        
        if (logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:1rem;">No media produced yet.</td></tr>';
            return;
        }

        tbody.innerHTML = logs.map(log => `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 1rem;">${Utils.formatDate(log.createdAt)}</td>
                <td>${log.recipeName}</td>
                <td>${log.volume} L</td>
                <td><span style="background: #e5e7eb; padding: 2px 6px; borderRadius: 4px; font-family: monospace;">${log.id}</span></td>
                <td>${log.createdBy}</td>
            </tr>
        `).join('');
    }
};