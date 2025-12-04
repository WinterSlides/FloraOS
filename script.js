// ============================================================================
// FLORAOS - SCRIPT.JS
// Core Application Logic for Plant Tissue Culture Management System
// ============================================================================

// Default Application State
const defaultState = {
  batches: [
    {
      id: 'B001',
      species: 'Orchid',
      clone: 'Purple Dream',
      mediaRecipe: 'MS-001',
      stage: 'II',
      dateInitiated: '2024-01-15',
      lastSubcultured: '2024-11-01',
      location: 'Shelf A-3',
      status: 'active',
      parentBatchID: null,
      generation: 0,
      explantType: 'shoot tip',
      genotype: 'Purple Dream Cultivar',
      physiologicalStatus: 'juvenile',
      collectionDate: '2024-01-15',
      collectionSeason: 'Winter',
      measurements: [],
      qualitativeObs: [],
      photoDocumentation: []
    }
  ],
  equipment: [
    {
      id: 'EQ001',
      name: 'Autoclave',
      type: 'Sterilization',
      location: 'Media Prep Area',
      lastMaintenance: '2024-11-01',
      nextMaintenance: '2024-12-01',
      status: 'operational',
      maintenanceInterval: 30
    },
    {
      id: 'EQ002',
      name: 'Laminar Flow Hood',
      type: 'Aseptic Transfer',
      location: 'Transfer Area',
      lastMaintenance: '2024-10-15',
      nextMaintenance: '2024-11-15',
      status: 'operational',
      maintenanceInterval: 30
    }
  ],
  autoclaveLog: [],
  sanitationLog: [],
  mediaRecipes: [
    {
      id: 'MS-001',
      name: 'MS Basic Multiplication',
      base: 'MS',
      macronutrients: {
        NH4NO3: 1650,
        KNO3: 1900,
        CaCl2: 440,
        MgSO4: 370,
        KH2PO4: 170
      },
      micronutrients: {
        MnSO4: 22.3,
        ZnSO4: 8.6,
        H3BO3: 6.2,
        KI: 0.83,
        Na2MoO4: 0.25,
        CuSO4: 0.025,
        CoCl2: 0.025
      },
      ironSource: 'Fe-EDTA 43 mg/L',
      vitamins: {
        myoInositol: 100,
        thiamineHCl: 0.4,
        pyridoxineHCl: 0.5,
        nicotinicAcid: 0.5
      },
      carbon: { type: 'Sucrose', amount: 30 },
      gellingAgent: { type: 'Agar', amount: 7 },
      pgrs: [
        { name: 'BAP', mgL: 1.0, uM: 4.44, type: 'Cytokinin' },
        { name: 'NAA', mgL: 0.1, uM: 0.54, type: 'Auxin' }
      ],
      additives: [],
      pH: 5.7,
      linkedStage: 'II',
      preparationNotes: '',
      componentChecklog: []
    }
  ],
  chemicalInventory: [],
  stockSolutions: [],
  lightingConfig: {
    spectralQuality: 'Cool White Fluorescent',
    intensity: 3000,
    intensityUnit: 'lux',
    photoperiod: '16:8',
    lightType: 'LED'
  },
  bioreactorData: [],
  contaminationLog: [],
  disorderLog: [],
  geneticFidelityLog: [],
  acclimatizationLog: [],
  laboratoryNotebook: [],
  mediaPreparationLog: [],
  inventory: [
    {
      id: 'INV001',
      name: 'Agar',
      category: 'Gelling Agents',
      supplier: 'Sigma',
      currentStock: 2,
      reorderLevel: 5,
      unit: 'kg',
      costPerUnit: 45,
      location: 'Cabinet B'
    }
  ],
  expenses: [],
  income: [],
  orders: [
    {
      id: 'ORD001',
      orderNumber: 101,
      customer: 'Green Nursery',
      items: '100x Orchid Stage III',
      totalValue: 500,
      status: 'Packed',
      orderDate: '2024-11-10',
      deadline: '2024-12-15',
      trackingNumber: null,
      shipmentId: null
    }
  ],
  shipments: [],
  customers: [],
  environmentLogs: [],
  tasks: [
    {
      id: 'TASK001',
      title: 'Subculture Batch B001',
      description: 'Transfer to fresh media',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-12-05',
      assignedTo: 'Lab Tech',
      relatedTo: 'B001'
    }
  ],
  settings: {
    subcultureCycleDays: 30,
    stageICycleDays: 14,
    stageIICycleDays: 21,
    stageIIICycleDays: 28,
    stageIVCycleDays: 14,
    tempRangeMin: 22,
    tempRangeMax: 27,
    humidityRangeMin: 50,
    humidityRangeMax: 70,
    optimalTempMin: 25,
    optimalTempMax: 27,
    mediaCostPerLiter: 5,
    laborCostPerHour: 25,
    taxRate: 10,
    defaultShippingRate: 25,
    companyName: 'FloraLab',
    companyLogo: '',
    companyAddress: '',
    companyEmail: 'info@floralab.com',
    theme: 'dark',
    ship24ApiKey: 'apik_MDr4Plo16OfVS3q2Bq3s5hvo51ELUA',
    shipmentRefreshInterval: 30,
    enableShipmentNotifications: true,
    requireCountersignature: true,
    enableIPProtection: true,
    autoBackupDays: 30
  }
};

// Application State
let appState = {};

// Initialize Application
function initApp() {
  const saved = localStorage.getItem('floraos_state');
  if (saved) {
    try {
      appState = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved state:', e);
      appState = { ...defaultState };
    }
  } else {
    appState = { ...defaultState };
  }

  // Ensure all required arrays exist
  appState.batches = appState.batches || [];
  appState.inventory = appState.inventory || [];
  appState.expenses = appState.expenses || [];
  appState.income = appState.income || [];
  appState.orders = appState.orders || [];
  appState.shipments = appState.shipments || [];
  appState.customers = appState.customers || [];
  appState.environmentLogs = appState.environmentLogs || [];
  appState.tasks = appState.tasks || [];
  appState.equipment = appState.equipment || [];
  appState.autoclaveLog = appState.autoclaveLog || [];
  appState.sanitationLog = appState.sanitationLog || [];
  appState.mediaRecipes = appState.mediaRecipes || [];
  appState.chemicalInventory = appState.chemicalInventory || [];
  appState.stockSolutions = appState.stockSolutions || [];
  appState.contaminationLog = appState.contaminationLog || [];
  appState.disorderLog = appState.disorderLog || [];
  appState.geneticFidelityLog = appState.geneticFidelityLog || [];
  appState.acclimatizationLog = appState.acclimatizationLog || [];
  appState.laboratoryNotebook = appState.laboratoryNotebook || [];
  appState.mediaPreparationLog = appState.mediaPreparationLog || [];
  appState.bioreactorData = appState.bioreactorData || [];
  appState.lightingConfig = appState.lightingConfig || defaultState.lightingConfig;
  appState.settings = appState.settings || defaultState.settings;

  saveState();
  requestNotificationPermission();
  renderDashboard();
  setupNavigation();
  setupSearch();
  loadSettings();
  startAutoRefresh();
}

// Save State to LocalStorage
function saveState() {
  try {
    localStorage.setItem('floraos_state', JSON.stringify(appState));
  } catch (e) {
    console.error('Failed to save state:', e);
    showToast('⚠️ Storage quota exceeded', 'error');
  }
}
// ============================================================================
// NAVIGATION SYSTEM
// ============================================================================

function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const module = link.getAttribute('data-module');
      switchModule(module);
    });
  });
}

function switchModule(moduleName) {
  // Hide all modules
  document.querySelectorAll('.module').forEach(m => {
    m.classList.remove('active');
  });

  // Show selected module
  const targetModule = document.getElementById(moduleName);
  if (targetModule) {
    targetModule.classList.add('active');
  }

  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  const activeLink = document.querySelector(`[data-module="${moduleName}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }

  // Render module content
  switch (moduleName) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'lab':
      showLabSection('batches');
      break;
    case 'analytics':
      renderAnalytics();
      break;
    case 'quality':
      showQualitySection('contamination');
      break;
    case 'equipment':
      showEquipmentSection('inventory');
      break;
    case 'business':
      showBusinessSection('inventory');
      break;
    case 'shipments':
      renderShipments();
      break;
    case 'environment':
      renderEnvironment();
      break;
    case 'productivity':
      renderTasks();
      break;
    case 'settings':
      loadSettings();
      break;
  }
}

// ============================================================================
// DASHBOARD RENDERING
// ============================================================================

function renderDashboard() {
  // Net Profit
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const netProfit = calcNetProfit(currentMonth, currentYear);
  const lastMonthProfit = calcNetProfit(currentMonth - 1, currentYear);
  const profitChange = lastMonthProfit !== 0 ? ((netProfit - lastMonthProfit) / Math.abs(lastMonthProfit) * 100).toFixed(1) : 0;

  document.getElementById('netProfitValue').textContent = `$${netProfit.toLocaleString()}`;
  const trendHtml = profitChange >= 0
    ? `<span class="trend-up">↑ ${Math.abs(profitChange)}%</span>`
    : `<span class="trend-down">↓ ${Math.abs(profitChange)}%</span>`;
  document.getElementById('netProfitTrend').innerHTML = trendHtml + ' <span class="text-secondary">vs last month</span>';

  // Active Batches
  const activeBatches = appState.batches.filter(b => b.status === 'active').length;
  document.getElementById('activeBatchesValue').textContent = activeBatches;

  // Contamination Rate
  const contaminationRate = calcContaminationRate();
  document.getElementById('contaminationValue').textContent = `${contaminationRate}%`;
  const contaminationBadge = contaminationRate < 5
    ? '<span class="badge badge-green">Excellent</span>'
    : contaminationRate < 10
      ? '<span class="badge badge-orange">Monitor</span>'
      : '<span class="badge badge-red">Critical</span>';
  document.getElementById('contaminationBadge').innerHTML = contaminationBadge;

  // Pending Orders
  const pendingOrders = appState.orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;
  document.getElementById('pendingOrdersValue').textContent = pendingOrders;

  // Active Shipments
  const activeShipments = appState.shipments.filter(s => !['Delivered', 'Exception'].includes(s.status)).length;
  document.getElementById('activeShipmentsValue').textContent = activeShipments;

  // Urgent Tasks
  renderUrgentTasks();
}

function renderUrgentTasks() {
  const urgentList = document.getElementById('urgentTasksList');
  const tasks = [];

  // Overdue batches
  const overdueBatches = checkOverdueBatches();
  if (overdueBatches.length > 0) {
    tasks.push({
      text: `${overdueBatches.length} batch${overdueBatches.length > 1 ? 'es' : ''} need subculturing TODAY`,
      color: 'red'
    });
  }

  // Ready to ship orders
  const readyOrders = appState.orders.filter(o => o.status === 'Packed').length;
  if (readyOrders > 0) {
    tasks.push({
      text: `${readyOrders} order${readyOrders > 1 ? 's' : ''} ready to ship`,
      color: 'blue'
    });
  }

  // Out for delivery shipments
  const deliveryShipments = appState.shipments.filter(s => s.status === 'OutForDelivery').length;
  if (deliveryShipments > 0) {
    tasks.push({
      text: `${deliveryShipments} shipment${deliveryShipments > 1 ? 's' : ''} out for delivery`,
      color: 'green'
    });
  }

  // Low stock items
  const lowStock = appState.inventory.filter(i => i.currentStock < i.reorderLevel);
  if (lowStock.length > 0) {
    lowStock.forEach(item => {
      tasks.push({
        text: `Low stock: ${item.name} (${item.currentStock} ${item.unit || 'units'} left)`,
        color: 'orange'
      });
    });
  }

  // High priority tasks
  const highPriorityTasks = appState.tasks.filter(t => t.priority === 'high' && t.status === 'todo').slice(0, 3);
  highPriorityTasks.forEach(task => {
    tasks.push({
      text: task.title,
      color: 'red'
    });
  });

  if (tasks.length === 0) {
    urgentList.innerHTML = '<li class="urgent-item" style="justify-content: center; color: var(--text-secondary);">All clear! No urgent tasks.</li>';
  } else {
    urgentList.innerHTML = tasks.map(task => `
      <li class="urgent-item">
        <span class="urgent-dot dot-${task.color}"></span>
        <span>${task.text}</span>
      </li>
    `).join('');
  }
}

function calcNetProfit(month, year) {
  const income = appState.income
    .filter(i => matchesMonthYear(i.date, month, year))
    .reduce((sum, i) => sum + parseFloat(i.amount), 0);

  const expenses = appState.expenses
    .filter(e => matchesMonthYear(e.date, month, year))
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return income - expenses;
}

function matchesMonthYear(dateStr, month, year) {
  const date = new Date(dateStr);
  return date.getMonth() === month && date.getFullYear() === year;
}

function calcContaminationRate() {
  const total = appState.batches.length;
  if (total === 0) return 0;
  const contaminated = appState.batches.filter(b => b.status === 'contaminated').length;
  return ((contaminated / total) * 100).toFixed(1);
}

function checkOverdueBatches() {
  const today = new Date();
  const threshold = appState.settings.subcultureCycleDays;

  return appState.batches.filter(batch => {
    if (batch.status !== 'active') return false;
    const lastDate = new Date(batch.lastSubcultured);
    const daysSince = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    return daysSince > threshold;
  });
}
// ============================================================================
// NAVIGATION SYSTEM
// ============================================================================

function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const module = link.getAttribute('data-module');
      switchModule(module);
    });
  });
}

function switchModule(moduleName) {
  // Hide all modules
  document.querySelectorAll('.module').forEach(m => {
    m.classList.remove('active');
  });

  // Show selected module
  const targetModule = document.getElementById(moduleName);
  if (targetModule) {
    targetModule.classList.add('active');
  }

  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  const activeLink = document.querySelector(`[data-module="${moduleName}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }

  // Render module content
  switch (moduleName) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'lab':
      showLabSection('batches');
      break;
    case 'analytics':
      renderAnalytics();
      break;
    case 'quality':
      showQualitySection('contamination');
      break;
    case 'equipment':
      showEquipmentSection('inventory');
      break;
    case 'business':
      showBusinessSection('inventory');
      break;
    case 'shipments':
      renderShipments();
      break;
    case 'environment':
      renderEnvironment();
      break;
    case 'productivity':
      renderTasks();
      break;
    case 'settings':
      loadSettings();
      break;
  }
}

// ============================================================================
// DASHBOARD RENDERING
// ============================================================================

function renderDashboard() {
  // Net Profit
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const netProfit = calcNetProfit(currentMonth, currentYear);
  const lastMonthProfit = calcNetProfit(currentMonth - 1, currentYear);
  const profitChange = lastMonthProfit !== 0 ? ((netProfit - lastMonthProfit) / Math.abs(lastMonthProfit) * 100).toFixed(1) : 0;

  document.getElementById('netProfitValue').textContent = `$${netProfit.toLocaleString()}`;
  const trendHtml = profitChange >= 0
    ? `<span class="trend-up">↑ ${Math.abs(profitChange)}%</span>`
    : `<span class="trend-down">↓ ${Math.abs(profitChange)}%</span>`;
  document.getElementById('netProfitTrend').innerHTML = trendHtml + ' <span class="text-secondary">vs last month</span>';

  // Active Batches
  const activeBatches = appState.batches.filter(b => b.status === 'active').length;
  document.getElementById('activeBatchesValue').textContent = activeBatches;

  // Contamination Rate
  const contaminationRate = calcContaminationRate();
  document.getElementById('contaminationValue').textContent = `${contaminationRate}%`;
  const contaminationBadge = contaminationRate < 5
    ? '<span class="badge badge-green">Excellent</span>'
    : contaminationRate < 10
      ? '<span class="badge badge-orange">Monitor</span>'
      : '<span class="badge badge-red">Critical</span>';
  document.getElementById('contaminationBadge').innerHTML = contaminationBadge;

  // Pending Orders
  const pendingOrders = appState.orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;
  document.getElementById('pendingOrdersValue').textContent = pendingOrders;

  // Active Shipments
  const activeShipments = appState.shipments.filter(s => !['Delivered', 'Exception'].includes(s.status)).length;
  document.getElementById('activeShipmentsValue').textContent = activeShipments;

  // Urgent Tasks
  renderUrgentTasks();
}

function renderUrgentTasks() {
  const urgentList = document.getElementById('urgentTasksList');
  const tasks = [];

  // Overdue batches
  const overdueBatches = checkOverdueBatches();
  if (overdueBatches.length > 0) {
    tasks.push({
      text: `${overdueBatches.length} batch${overdueBatches.length > 1 ? 'es' : ''} need subculturing TODAY`,
      color: 'red'
    });
  }

  // Ready to ship orders
  const readyOrders = appState.orders.filter(o => o.status === 'Packed').length;
  if (readyOrders > 0) {
    tasks.push({
      text: `${readyOrders} order${readyOrders > 1 ? 's' : ''} ready to ship`,
      color: 'blue'
    });
  }

  // Out for delivery shipments
  const deliveryShipments = appState.shipments.filter(s => s.status === 'OutForDelivery').length;
  if (deliveryShipments > 0) {
    tasks.push({
      text: `${deliveryShipments} shipment${deliveryShipments > 1 ? 's' : ''} out for delivery`,
      color: 'green'
    });
  }

  // Low stock items
  const lowStock = appState.inventory.filter(i => i.currentStock < i.reorderLevel);
  if (lowStock.length > 0) {
    lowStock.forEach(item => {
      tasks.push({
        text: `Low stock: ${item.name} (${item.currentStock} ${item.unit || 'units'} left)`,
        color: 'orange'
      });
    });
  }

  // High priority tasks
  const highPriorityTasks = appState.tasks.filter(t => t.priority === 'high' && t.status === 'todo').slice(0, 3);
  highPriorityTasks.forEach(task => {
    tasks.push({
      text: task.title,
      color: 'red'
    });
  });

  if (tasks.length === 0) {
    urgentList.innerHTML = '<li class="urgent-item" style="justify-content: center; color: var(--text-secondary);">All clear! No urgent tasks.</li>';
  } else {
    urgentList.innerHTML = tasks.map(task => `
      <li class="urgent-item">
        <span class="urgent-dot dot-${task.color}"></span>
        <span>${task.text}</span>
      </li>
    `).join('');
  }
}

function calcNetProfit(month, year) {
  const income = appState.income
    .filter(i => matchesMonthYear(i.date, month, year))
    .reduce((sum, i) => sum + parseFloat(i.amount), 0);

  const expenses = appState.expenses
    .filter(e => matchesMonthYear(e.date, month, year))
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  return income - expenses;
}

function matchesMonthYear(dateStr, month, year) {
  const date = new Date(dateStr);
  return date.getMonth() === month && date.getFullYear() === year;
}

function calcContaminationRate() {
  const total = appState.batches.length;
  if (total === 0) return 0;
  const contaminated = appState.batches.filter(b => b.status === 'contaminated').length;
  return ((contaminated / total) * 100).toFixed(1);
}

function checkOverdueBatches() {
  const today = new Date();
  const threshold = appState.settings.subcultureCycleDays;

  return appState.batches.filter(batch => {
    if (batch.status !== 'active') return false;
    const lastDate = new Date(batch.lastSubcultured);
    const daysSince = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    return daysSince > threshold;
  });
}
// ============================================================================
// BUSINESS ERP - INVENTORY, FINANCE, ORDERS
// ============================================================================

function showBusinessSection(section) {
  document.getElementById('inventorySection').style.display = 'none';
  document.getElementById('financeSection').style.display = 'none';
  document.getElementById('ordersSection').style.display = 'none';

  if (section === 'inventory') {
    document.getElementById('inventorySection').style.display = 'block';
    renderInventory();
  } else if (section === 'finance') {
    document.getElementById('financeSection').style.display = 'block';
    renderTransactions();
  } else if (section === 'orders') {
    document.getElementById('ordersSection').style.display = 'block';
    renderOrders();
  }
}

function renderInventory() {
  const tbody = document.getElementById('inventoryTableBody');
  const items = appState.inventory;

  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 48px;"><div class="empty-state"><div class="empty-icon">📦</div><div class="empty-title">No inventory items</div></div></td></tr>';
    return;
  }

  tbody.innerHTML = items.map(item => {
    const isLow = item.currentStock < item.reorderLevel;
    const statusBadge = isLow
      ? '<span class="badge badge-red">Low Stock</span>'
      : '<span class="badge badge-green">In Stock</span>';

    return `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td>${item.category}</td>
        <td>${item.currentStock} ${item.unit || ''}</td>
        <td>${item.reorderLevel}</td>
        <td>$${item.costPerUnit}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="action-btn" onclick="deleteInventoryItem('${item.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function addInventoryItem(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const newItem = {
    id: 'INV' + String(appState.inventory.length + 1).padStart(3, '0'),
    name: formData.get('name'),
    category: formData.get('category'),
    currentStock: parseInt(formData.get('currentStock')),
    reorderLevel: parseInt(formData.get('reorderLevel')),
    costPerUnit: parseFloat(formData.get('costPerUnit')),
    location: formData.get('location'),
    unit: 'units'
  };

  appState.inventory.push(newItem);
  saveState();
  renderInventory();
  renderDashboard();
  closeModal('addInventoryModal');
  form.reset();
  showToast('✅ Inventory item added');
}

function deleteInventoryItem(itemId) {
  if (confirm('Delete this item?')) {
    appState.inventory = appState.inventory.filter(i => i.id !== itemId);
    saveState();
    renderInventory();
    showToast('🗑️ Item deleted');
  }
}

function renderTransactions() {
  const tbody = document.getElementById('transactionsTableBody');
  const allTransactions = [
    ...appState.income.map(i => ({ ...i, type: 'Income' })),
    ...appState.expenses.map(e => ({ ...e, type: 'Expense' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (allTransactions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 48px;"><div class="empty-state"><div class="empty-icon">💰</div><div class="empty-title">No transactions</div></div></td></tr>';
    return;
  }

  tbody.innerHTML = allTransactions.slice(0, 50).map(t => {
    const amountClass = t.type === 'Income' ? 'trend-up' : 'trend-down';
    const amountPrefix = t.type === 'Income' ? '+' : '-';

    return `
      <tr>
        <td>${formatDate(t.date)}</td>
        <td><span class="badge ${t.type === 'Income' ? 'badge-green' : 'badge-red'}">${t.type}</span></td>
        <td>${t.category}</td>
        <td>${t.description || t.source || '-'}</td>
        <td class="${amountClass}">${amountPrefix}$${parseFloat(t.amount).toFixed(2)}</td>
      </tr>
    `;
  }).join('');
}

function addExpense(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const newExpense = {
    id: 'EXP' + String(appState.expenses.length + 1).padStart(3, '0'),
    date: formData.get('date'),
    category: formData.get('category'),
    description: formData.get('description'),
    amount: parseFloat(formData.get('amount'))
  };

  appState.expenses.push(newExpense);
  saveState();
  renderTransactions();
  renderDashboard();
  closeModal('addExpenseModal');
  form.reset();
  showToast('✅ Expense added');
}

function addIncome(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const newIncome = {
    id: 'INC' + String(appState.income.length + 1).padStart(3, '0'),
    date: formData.get('date'),
    source: formData.get('source'),
    category: formData.get('category'),
    amount: parseFloat(formData.get('amount'))
  };

  appState.income.push(newIncome);
  saveState();
  renderTransactions();
  renderDashboard();
  closeModal('addIncomeModal');
  form.reset();
  showToast('✅ Income added');
}

function renderOrders() {
  const tbody = document.getElementById('ordersTableBody');
  const orders = appState.orders;

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 48px;"><div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">No orders</div></div></td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(order => {
    const statusColors = {
      'Quote Sent': 'gray',
      'Order Received': 'blue',
      'In Production': 'orange',
      'Quality Check': 'orange',
      'Packed': 'blue',
      'Shipped': 'green',
      'Delivered': 'green'
    };
    const statusBadge = `<span class="badge badge-${statusColors[order.status] || 'gray'}">${order.status}</span>`;

    const trackingHtml = order.trackingNumber
      ? `<button class="action-btn" onclick="viewShipmentDetail('${order.shipmentId}')">${order.trackingNumber}</button>`
      : '<span class="text-secondary">-</span>';

    return `
      <tr>
        <td><strong>#${order.orderNumber}</strong></td>
        <td>${order.customer}</td>
        <td>${order.items}</td>
        <td>$${order.totalValue}</td>
        <td>${statusBadge}</td>
        <td>${trackingHtml}</td>
        <td>
          <button class="action-btn" onclick="updateOrderStatus('${order.id}')">Update</button>
          <button class="action-btn" onclick="deleteOrder('${order.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function addOrder(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const newOrder = {
    id: 'ORD' + String(appState.orders.length + 1).padStart(3, '0'),
    orderNumber: appState.orders.length + 101,
    customer: formData.get('customer'),
    items: formData.get('items'),
    totalValue: parseFloat(formData.get('totalValue')),
    status: 'Order Received',
    orderDate: new Date().toISOString().split('T')[0],
    deadline: formData.get('deadline'),
    trackingNumber: null,
    shipmentId: null
  };

  appState.orders.push(newOrder);
  saveState();
  renderOrders();
  renderDashboard();
  closeModal('addOrderModal');
  form.reset();
  showToast('✅ Order created');
}

function updateOrderStatus(orderId) {
  const order = appState.orders.find(o => o.id === orderId);
  if (!order) return;

  const statuses = ['Order Received', 'In Production', 'Quality Check', 'Packed', 'Shipped', 'Delivered'];
  const currentIndex = statuses.indexOf(order.status);
  if (currentIndex < statuses.length - 1) {
    order.status = statuses[currentIndex + 1];
    saveState();
    renderOrders();
    renderDashboard();
    showToast(`✅ Order #${order.orderNumber} → ${order.status}`);
  }
}

function deleteOrder(orderId) {
  if (confirm('Delete this order?')) {
    appState.orders = appState.orders.filter(o => o.id !== orderId);
    saveState();
    renderOrders();
    renderDashboard();
    showToast('🗑️ Order deleted');
  }
}
// ============================================================================
// SHIPMENT TRACKING - SHIP24 INTEGRATION
// ============================================================================

async function registerTracking(trackingNumber) {
  try {
    const response = await fetch('https://api.ship24.com/public/v1/trackers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${appState.settings.ship24ApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trackingNumber: trackingNumber
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ship24 registration error:', error);
    throw error;
  }
}

async function getTrackingUpdate(trackerId) {
  try {
    const response = await fetch(`https://api.ship24.com/public/v1/trackers/${trackerId}`, {
      headers: {
        'Authorization': `Bearer ${appState.settings.ship24ApiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ship24 update error:', error);
    throw error;
  }
}

function addShipment(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const orderNumber = parseInt(formData.get('orderNumber'));
  const trackingNumber = formData.get('trackingNumber');
  const carrier = formData.get('carrier');
  const shippingCost = parseFloat(formData.get('shippingCost'));

  // Add shipping cost as expense
  const shippingExpense = {
    id: 'EXP' + String(appState.expenses.length + 1).padStart(3, '0'),
    date: new Date().toISOString().split('T')[0],
    category: 'Shipping',
    description: `Shipping for Order #${orderNumber}`,
    amount: shippingCost
  };
  appState.expenses.push(shippingExpense);

  // Create shipment record
  const newShipment = {
    id: 'SHIP' + String(appState.shipments.length + 1).padStart(3, '0'),
    orderNumber: orderNumber,
    trackingNumber: trackingNumber,
    carrier: carrier,
    trackerId: null,
    status: 'Pending',
    createdDate: new Date().toISOString(),
    lastUpdate: new Date().toISOString(),
    estimatedDelivery: null,
    shippingCost: shippingCost,
    events: []
  };

  // Register with Ship24
  showToast('🔄 Registering tracking...');
  registerTracking(trackingNumber)
    .then(data => {
      if (data && data.data && data.data.tracker) {
        newShipment.trackerId = data.data.tracker.trackerId;
        newShipment.status = 'InfoReceived';
      }

      appState.shipments.push(newShipment);

      // Update order
      const order = appState.orders.find(o => o.orderNumber === orderNumber);
      if (order) {
        order.status = 'Shipped';
        order.trackingNumber = trackingNumber;
        order.shipmentId = newShipment.id;
      }

      saveState();
      renderShipments();
      renderOrders();
      renderDashboard();
      closeModal('addShipmentModal');
      form.reset();
      showToast('✅ Shipment tracking started');

      // Fetch initial update
      setTimeout(() => {
        refreshShipment(newShipment.id);
      }, 2000);
    })
    .catch(error => {
      // Still create shipment even if API fails
      appState.shipments.push(newShipment);

      const order = appState.orders.find(o => o.orderNumber === orderNumber);
      if (order) {
        order.status = 'Shipped';
        order.trackingNumber = trackingNumber;
        order.shipmentId = newShipment.id;
      }

      saveState();
      renderShipments();
      renderOrders();
      closeModal('addShipmentModal');
      form.reset();
      showToast('⚠️ Shipment created (API unavailable)', 'warning');
    });
}

function renderShipments() {
  const tbody = document.getElementById('shipmentsTableBody');
  const shipments = appState.shipments;

  // Populate order select in add shipment modal
  const orderSelect = document.getElementById('shipmentOrderSelect');
  if (orderSelect) {
    const packedOrders = appState.orders.filter(o => o.status === 'Packed');
    orderSelect.innerHTML = packedOrders.length > 0
      ? packedOrders.map(o => `<option value="${o.orderNumber}">#${o.orderNumber} - ${o.customer}</option>`).join('')
      : '<option value="">No packed orders available</option>';
  }

  if (shipments.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 48px;"><div class="empty-state"><div class="empty-icon">📦</div><div class="empty-title">No shipments</div><p>Start tracking your first shipment</p></div></td></tr>';
    return;
  }

  tbody.innerHTML = shipments.map(shipment => {
    const statusColors = {
      'InfoReceived': 'gray',
      'InTransit': 'blue',
      'OutForDelivery': 'orange',
      'Delivered': 'green',
      'Exception': 'red',
      'Pending': 'gray'
    };

    const isPulse = ['InTransit', 'OutForDelivery'].includes(shipment.status);
    const statusBadge = `<span class="badge badge-${statusColors[shipment.status] || 'gray'} ${isPulse ? 'badge-pulse' : ''}">${formatStatus(shipment.status)}</span>`;

    const order = appState.orders.find(o => o.orderNumber === shipment.orderNumber);
    const customerName = order ? order.customer : '-';

    return `
      <tr>
        <td><strong>#${shipment.orderNumber}</strong></td>
        <td>${customerName}</td>
        <td><code>${shipment.trackingNumber}</code></td>
        <td>${shipment.carrier}</td>
        <td>${statusBadge}</td>
        <td>${formatDateTime(shipment.lastUpdate)}</td>
        <td>${shipment.estimatedDelivery ? formatDate(shipment.estimatedDelivery) : '-'}</td>
        <td>
          <button class="action-btn" onclick="viewShipmentDetail('${shipment.id}')">View</button>
          <button class="action-btn" onclick="refreshShipment('${shipment.id}')">Refresh</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function refreshShipment(shipmentId) {
  const shipment = appState.shipments.find(s => s.id === shipmentId);
  if (!shipment || !shipment.trackerId) {
    showToast('⚠️ Cannot refresh: No tracker ID', 'warning');
    return;
  }

  try {
    const data = await getTrackingUpdate(shipment.trackerId);

    if (data && data.data && data.data.tracker) {
      const tracker = data.data.tracker;
      const oldStatus = shipment.status;

      // Update shipment data
      if (tracker.shipment && tracker.shipment.statusMilestone) {
        shipment.status = tracker.shipment.statusMilestone;
      }

      if (tracker.shipment && tracker.shipment.delivery && tracker.shipment.delivery.estimatedDeliveryDate) {
        shipment.estimatedDelivery = tracker.shipment.delivery.estimatedDeliveryDate;
      }

      if (tracker.events) {
        shipment.events = tracker.events.map(e => ({
          timestamp: e.datetime,
          location: e.location || 'Unknown',
          status: e.status || 'Update',
          message: e.statusDescription || 'Status update'
        }));
      }

      shipment.lastUpdate = new Date().toISOString();

      // Check for status change
      if (oldStatus !== shipment.status) {
        // Send notification
        if (appState.settings.enableShipmentNotifications && Notification.permission === 'granted') {
          new Notification('Shipment Update', {
            body: `Order #${shipment.orderNumber}: ${formatStatus(shipment.status)}`,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌱</text></svg>'
          });
        }

        // Update order status if delivered
        if (shipment.status === 'Delivered') {
          const order = appState.orders.find(o => o.shipmentId === shipment.id);
          if (order) {
            order.status = 'Delivered';
          }
        }
      }

      saveState();
      renderShipments();
      renderOrders();
      renderDashboard();
      showToast('✅ Tracking updated');
    }
  } catch (error) {
    showToast('⚠️ Failed to update tracking', 'error');
  }
}

async function refreshAllShipments() {
  const activeShipments = appState.shipments.filter(s =>
    !['Delivered', 'Exception'].includes(s.status) && s.trackerId
  );

  if (activeShipments.length === 0) {
    showToast('ℹ️ No active shipments to refresh');
    return;
  }

  showToast(`🔄 Refreshing ${activeShipments.length} shipment(s)...`);

  for (const shipment of activeShipments) {
    await refreshShipment(shipment.id);
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

function formatStatus(status) {
  const statusMap = {
    'InfoReceived': 'Info Received',
    'InTransit': 'In Transit',
    'OutForDelivery': 'Out for Delivery',
    'Delivered': 'Delivered',
    'Exception': 'Exception',
    'Pending': 'Pending'
  };
  return statusMap[status] || status;
}
function viewShipmentDetail(shipmentId) {
  const shipment = appState.shipments.find(s => s.id === shipmentId);
  if (!shipment) return;

  const order = appState.orders.find(o => o.shipmentId === shipmentId);
  const customerName = order ? order.customer : 'Unknown';

  const statusColors = {
    'InfoReceived': 'gray',
    'InTransit': 'blue',
    'OutForDelivery': 'orange',
    'Delivered': 'green',
    'Exception': 'red',
    'Pending': 'gray'
  };

  const content = `
    <div style="margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h4 style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">Order #${shipment.orderNumber}</h4>
          <p class="text-secondary">${customerName}</p>
        </div>
        <span class="badge badge-${statusColors[shipment.status] || 'gray'}" style="font-size: 14px; padding: 8px 16px;">
          ${formatStatus(shipment.status)}
        </span>
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 12px; margin-bottom: 16px;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
          <div>
            <p class="text-secondary" style="font-size: 13px; margin-bottom: 4px;">Tracking Number</p>
            <p style="font-weight: 600;"><code>${shipment.trackingNumber}</code></p>
          </div>
          <div>
            <p class="text-secondary" style="font-size: 13px; margin-bottom: 4px;">Carrier</p>
            <p style="font-weight: 600;">${shipment.carrier}</p>
          </div>
          <div>
            <p class="text-secondary" style="font-size: 13px; margin-bottom: 4px;">Shipping Cost</p>
            <p style="font-weight: 600;">$${shipment.shippingCost.toFixed(2)}</p>
          </div>
          <div>
            <p class="text-secondary" style="font-size: 13px; margin-bottom: 4px;">Est. Delivery</p>
            <p style="font-weight: 600;">${shipment.estimatedDelivery ? formatDate(shipment.estimatedDelivery) : 'TBD'}</p>
          </div>
        </div>
      </div>

      <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">Tracking Timeline</h4>
      ${shipment.events && shipment.events.length > 0 ? `
        <div class="timeline">
          ${shipment.events.map(event => `
            <div class="timeline-event">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-time">${formatDateTime(event.timestamp)}</div>
                <div class="timeline-location">${event.location}</div>
                <div class="timeline-message">${event.message}</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <p class="text-secondary" style="text-align: center; padding: 24px;">No tracking events yet</p>
      `}
    </div>

    <div style="display: flex; gap: 12px; margin-top: 24px;">
      <button class="btn btn-secondary" onclick="copyTrackingNumber('${shipment.trackingNumber}')">📋 Copy Tracking</button>
      <button class="btn btn-primary" onclick="refreshShipment('${shipment.id}'); closeModal('shipmentDetailModal'); setTimeout(() => viewShipmentDetail('${shipment.id}'), 1000);">🔄 Refresh</button>
    </div>
  `;

  document.getElementById('shipmentDetailTitle').textContent = `Shipment ${shipment.trackingNumber}`;
  document.getElementById('shipmentDetailContent').innerHTML = content;
  openModal('shipmentDetailModal');
}

function copyTrackingNumber(trackingNumber) {
  navigator.clipboard.writeText(trackingNumber).then(() => {
    showToast('📋 Tracking number copied');
  });
}

function startAutoRefresh() {
  const intervalMinutes = appState.settings.shipmentRefreshInterval || 30;
  setInterval(() => {
    const activeShipments = appState.shipments.filter(s =>
      !['Delivered', 'Exception'].includes(s.status) && s.trackerId
    );
    if (activeShipments.length > 0) {
      console.log('Auto-refreshing shipments...');
      refreshAllShipments();
    }
  }, intervalMinutes * 60000);
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// ============================================================================
// QUALITY CONTROL
// ============================================================================

function showQualitySection(section) {
  document.getElementById('contaminationSection').style.display = 'none';
  document.getElementById('disordersSection').style.display = 'none';
  document.getElementById('fidelitySection').style.display = 'none';

  if (section === 'contamination') {
    document.getElementById('contaminationSection').style.display = 'block';
    renderContamination();
  } else if (section === 'disorders') {
    document.getElementById('disordersSection').style.display = 'block';
    renderDisorders();
  } else if (section === 'fidelity') {
    document.getElementById('fidelitySection').style.display = 'block';
    renderFidelity();
  }
}

function renderContamination() {
  const tbody = document.getElementById('contaminationTableBody');
  const logs = appState.contaminationLog;

  if (logs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 48px;"><div class="empty-state"><div class="empty-icon">🦠</div><div class="empty-title">No contamination incidents</div></div></td></tr>';
    return;
  }

  tbody.innerHTML = logs.map(log => `
    <tr>
      <td>${formatDate(log.date)}</td>
      <td>${log.batchId}</td>
      <td><span class="badge badge-red">${log.type}</span></td>
      <td>${log.description}</td>
      <td>${log.cause}</td>
      <td>${log.action}</td>
      <td>-</td>
    </tr>
  `).join('');
}

function renderDisorders() {
  const tbody = document.getElementById('disordersTableBody');
  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 48px;"><div class="empty-state"><div class="empty-icon">🔬</div><div class="empty-title">No disorders logged</div></div></td></tr>';
}

function renderFidelity() {
  const tbody = document.getElementById('fidelityTableBody');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 48px;"><div class="empty-state"><div class="empty-icon">🧬</div><div class="empty-title">No fidelity assessments</div></div></td></tr>';
}

function addContamination(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const newLog = {
    id: 'CONT' + String(appState.contaminationLog.length + 1).padStart(3, '0'),
    date: formData.get('date'),
    batchId: formData.get('batchId'),
    type: formData.get('type'),
    description: formData.get('description'),
    cause: formData.get('cause'),
    action: formData.get('action')
  };

  appState.contaminationLog.push(newLog);

  // Update batch status if it exists
  const batch = appState.batches.find(b => b.id === newLog.batchId);
  if (batch) {
    batch.status = 'contaminated';
  }

  saveState();
  renderContamination();
  renderBatches();
  renderDashboard();
  closeModal('addContaminationModal');
  form.reset();
  showToast('✅ Contamination incident logged');
}

// ============================================================================
// EQUIPMENT MANAGEMENT
// ============================================================================

function showEquipmentSection(section) {
  document.getElementById('equipmentInventorySection').style.display = 'none';
  document.getElementById('autoclaveSection').style.display = 'none';
  document.getElementById('sanitationSection').style.display = 'none';

  if (section === 'inventory') {
    document.getElementById('equipmentInventorySection').style.display = 'block';
    renderEquipment();
  } else if (section === 'autoclave') {
    document.getElementById('autoclaveSection').style.display = 'block';
    renderAutoclaveLog();
  } else if (section === 'sanitation') {
    document.getElementById('sanitationSection').style.display = 'block';
    renderSanitationLog();
  }
}

function renderEquipment() {
  const tbody = document.getElementById('equipmentTableBody');
  const equipment = appState.equipment;

  if (equipment.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 48px;"><div class="empty-state"><div class="empty-icon">⚙️</div><div class="empty-title">No equipment</div></div></td></tr>';
    return;
  }

  tbody.innerHTML = equipment.map(eq => {
    const statusBadge = eq.status === 'operational'
      ? '<span class="badge badge-green">Operational</span>'
      : '<span class="badge badge-red">Maintenance Required</span>';

    return `
      <tr>
        <td><strong>${eq.id}</strong></td>
        <td>${eq.name}</td>
        <td>${eq.type}</td>
        <td>${eq.location}</td>
        <td>${formatDate(eq.lastMaintenance)}</td>
        <td>${formatDate(eq.nextMaintenance)}</td>
        <td>${statusBadge}</td>
        <td>
          <button class="action-btn" onclick="deleteEquipment('${eq.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAutoclaveLog() {
  const tbody = document.getElementById('autoclaveTableBody');
  tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 48px;"><div class="empty-state"><div class="empty-icon">🔥</div><div class="empty-title">No autoclave cycles logged</div></div></td></tr>';
}

function renderSanitationLog() {
  const tbody = document.getElementById('sanitationTableBody');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 48px;"><div class="empty-state"><div class="empty-icon">🧼</div><div class="empty-title">No sanitation checks logged</div></div></td></tr>';
}

function addEquipment(event) {
  event.preventDefault();
  showToast('Equipment added');
  closeModal('addEquipmentModal');
}

function addAutoclaveCycle(event) {
  event.preventDefault();
  showToast('Autoclave cycle logged');
  closeModal('addAutoclaveModal');
}

function saveEnvironmentalConfig() {
  appState.lightingConfig.spectralQuality = document.getElementById('lightSpectralQuality').value;
  appState.lightingConfig.intensity = parseInt(document.getElementById('lightIntensity').value);
  appState.lightingConfig.intensityUnit = document.getElementById('lightIntensityUnit').value;
  appState.lightingConfig.photoperiod = document.getElementById('photoperiod').value;
  appState.lightingConfig.lightType = document.getElementById('lightType').value;

  saveState();
  showToast('✅ Environmental configuration saved');
}
// ============================================================================
// ENVIRONMENT MONITORING
// ============================================================================

function renderEnvironment() {
  renderEnvLogs();
  renderEnvChart();
}

function renderEnvLogs() {
  const tbody = document.getElementById('envLogsTableBody');
  const logs = appState.environmentLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (logs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 48px;"><div class="empty-state"><div class="empty-icon">🌡️</div><div class="empty-title">No environment logs</div></div></td></tr>';
    return;
  }

  tbody.innerHTML = logs.map(log => {
    const tempAvg = (log.tempMorning + log.tempEvening) / 2;
    const tempOk = tempAvg >= appState.settings.tempRangeMin && tempAvg <= appState.settings.tempRangeMax;
    const humidityOk = log.humidity >= appState.settings.humidityRangeMin && log.humidity <= appState.settings.humidityRangeMax;
    const allOk = tempOk && humidityOk;

    const statusBadge = allOk
      ? '<span class="badge badge-green">Optimal</span>'
      : '<span class="badge badge-orange">Check</span>';

    return `
      <tr>
        <td>${formatDate(log.date)}</td>
        <td>${log.tempMorning}°C</td>
        <td>${log.tempEvening}°C</td>
        <td>${log.humidity}%</td>
        <td>${log.photoperiod}</td>
        <td>${log.lightIntensity || '-'}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  }).join('');
}

function renderEnvChart() {
  const chartDiv = document.getElementById('envChart');
  const logs = appState.environmentLogs
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7);

  if (logs.length === 0) {
    chartDiv.innerHTML = '<p class="text-secondary" style="text-align: center; padding: 48px;">No data to display</p>';
    return;
  }

  const maxTemp = Math.max(...logs.map(l => Math.max(l.tempMorning, l.tempEvening)));
  const maxHumidity = Math.max(...logs.map(l => l.humidity));

  chartDiv.innerHTML = logs.map(log => {
    const tempAvg = (log.tempMorning + log.tempEvening) / 2;
    const tempHeight = (tempAvg / maxTemp) * 150;
    const humidityHeight = (log.humidity / maxHumidity) * 150;

    return `
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <div style="display: flex; gap: 4px; align-items: flex-end; height: 150px;">
          <div style="width: 20px; height: ${tempHeight}px; background: var(--accent-orange); border-radius: 4px;" title="Temp: ${tempAvg}°C"></div>
          <div style="width: 20px; height: ${humidityHeight}px; background: var(--accent-blue); border-radius: 4px;" title="Humidity: ${log.humidity}%"></div>
        </div>
        <span style="font-size: 11px; color: var(--text-secondary);">${new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
    `;
  }).join('');
}

function addEnvLog(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const newLog = {
    date: formData.get('date'),
    tempMorning: parseFloat(formData.get('tempMorning')),
    tempEvening: parseFloat(formData.get('tempEvening')),
    humidity: parseInt(formData.get('humidity')),
    photoperiod: formData.get('photoperiod'),
    lightIntensity: formData.get('lightIntensity') ? parseInt(formData.get('lightIntensity')) : null,
    notes: formData.get('notes')
  };

  appState.environmentLogs.push(newLog);
  saveState();
  renderEnvironment();
  closeModal('addEnvLogModal');
  form.reset();
  showToast('✅ Environment log saved');
}

// ============================================================================
// PRODUCTIVITY - TASK MANAGEMENT
// ============================================================================

function renderTasks() {
  const todoDiv = document.getElementById('todoTasks');
  const inProgressDiv = document.getElementById('inProgressTasks');
  const doneDiv = document.getElementById('doneTasks');

  const todoTasks = appState.tasks.filter(t => t.status === 'todo');
  const inProgressTasks = appState.tasks.filter(t => t.status === 'inprogress');
  const doneTasks = appState.tasks.filter(t => t.status === 'done');

  document.getElementById('todoCount').textContent = todoTasks.length;
  document.getElementById('inProgressCount').textContent = inProgressTasks.length;
  document.getElementById('doneCount').textContent = doneTasks.length;

  todoDiv.innerHTML = renderTaskCards(todoTasks);
  inProgressDiv.innerHTML = renderTaskCards(inProgressTasks);
  doneDiv.innerHTML = renderTaskCards(doneTasks);
}

function renderTaskCards(tasks) {
  if (tasks.length === 0) {
    return '<p class="text-secondary" style="text-align: center; padding: 24px; font-size: 14px;">No tasks</p>';
  }

  return tasks.map(task => {
    const priorityClass = `priority-${task.priority}`;
    const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    const dueText = daysUntilDue < 0 ? 'Overdue' : daysUntilDue === 0 ? 'Today' : `${daysUntilDue}d`;

    return `
      <div class="task-card" onclick="moveTask('${task.id}')">
        <span class="task-priority ${priorityClass}">${task.priority}</span>
        <div class="task-title">${task.title}</div>
        ${task.description ? `<p class="text-secondary" style="font-size: 13px; margin-top: 4px;">${task.description}</p>` : ''}
        <div class="task-due">
          <span>📅</span>
          <span>${dueText}</span>
        </div>
      </div>
    `;
  }).join('');
}

function addTask(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const newTask = {
    id: 'TASK' + String(appState.tasks.length + 1).padStart(3, '0'),
    title: formData.get('title'),
    description: formData.get('description'),
    status: 'todo',
    priority: formData.get('priority'),
    dueDate: formData.get('dueDate'),
    assignedTo: 'User',
    relatedTo: formData.get('relatedTo')
  };

  appState.tasks.push(newTask);
  saveState();
  renderTasks();
  renderDashboard();
  closeModal('addTaskModal');
  form.reset();
  showToast('✅ Task created');
}

function moveTask(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;

  const statusFlow = {
    'todo': 'inprogress',
    'inprogress': 'done',
    'done': 'todo'
  };

  task.status = statusFlow[task.status];
  saveState();
  renderTasks();
  showToast(`✅ Task moved to ${task.status === 'inprogress' ? 'In Progress' : task.status === 'done' ? 'Done' : 'To Do'}`);
}

// ============================================================================
// ANALYTICS
// ============================================================================

function renderAnalytics() {
  // Simple placeholders for charts
  document.getElementById('expenseBreakdownChart').innerHTML = '<p class="text-secondary" style="text-align: center; padding: 48px;">Chart data coming soon</p>';
  document.getElementById('revenueExpenseChart').innerHTML = '<p class="text-secondary" style="text-align: center; padding: 48px;">Chart data coming soon</p>';
  document.getElementById('laborCostChart').innerHTML = '<p class="text-secondary" style="text-align: center; padding: 48px;">Chart data coming soon</p>';
  document.getElementById('contaminationTrendChart').innerHTML = '<p class="text-secondary" style="text-align: center; padding: 48px;">Chart data coming soon</p>';

  // Calculate metrics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const batchesThisMonth = appState.batches.filter(b => {
    const date = new Date(b.dateInitiated);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const successRate = appState.batches.length > 0
    ? ((appState.batches.filter(b => b.status === 'active').length / appState.batches.length) * 100).toFixed(1)
    : 0;

  const monthlyExpenses = appState.expenses
    .filter(e => matchesMonthYear(e.date, currentMonth, currentYear))
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  document.getElementById('batchesThisMonth').textContent = batchesThisMonth;
  document.getElementById('successRate').textContent = `${successRate}%`;
  document.getElementById('burnRate').textContent = `$${monthlyExpenses.toFixed(2)}`;

  // Labor analysis
  const laborExpenses = appState.expenses.filter(e => e.category === 'Labor');
  const totalExpenses = appState.expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const laborTotal = laborExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const laborPercentage = totalExpenses > 0 ? ((laborTotal / totalExpenses) * 100).toFixed(1) : 0;
  const costPerBatch = appState.batches.length > 0 ? (totalExpenses / appState.batches.length).toFixed(2) : 0;

  document.getElementById('laborPercentage').textContent = `${laborPercentage}%`;
  document.getElementById('costPerBatch').textContent = costPerBatch;
}

// ============================================================================
// CUSTOM TOOLS
// ============================================================================

function showCustomTool(toolName) {
  document.getElementById('customToolA').style.display = 'none';
  document.getElementById('customToolB').style.display = 'none';
  document.getElementById('customToolC').style.display = 'none';

  if (toolName === 'toolA') {
    document.getElementById('customToolA').style.display = 'block';
  } else if (toolName === 'toolB') {
    document.getElementById('customToolB').style.display = 'block';
  } else if (toolName === 'toolC') {
    document.getElementById('customToolC').style.display = 'block';
  }
}
// ============================================================================
// SETTINGS
// ============================================================================

function loadSettings() {
  document.getElementById('settingSubcultureDays').value = appState.settings.subcultureCycleDays;
  document.getElementById('settingCompanyName').value = appState.settings.companyName;
  document.getElementById('settingCompanyEmail').value = appState.settings.companyEmail;
  document.getElementById('settingApiKey').value = appState.settings.ship24ApiKey;
  document.getElementById('settingRefreshInterval').value = appState.settings.shipmentRefreshInterval;
  document.getElementById('settingNotifications').value = appState.settings.enableShipmentNotifications.toString();

  // Database stats
  const stateJSON = JSON.stringify(appState);
  const sizeKB = (new Blob([stateJSON]).size / 1024).toFixed(2);
  document.getElementById('dbSize').textContent = `${sizeKB} KB`;
  document.getElementById('totalBatches').textContent = appState.batches.length;
  document.getElementById('totalOrders').textContent = appState.orders.length;
  document.getElementById('totalShipments').textContent = appState.shipments.length;
}

function saveSettings() {
  appState.settings.subcultureCycleDays = parseInt(document.getElementById('settingSubcultureDays').value);
  appState.settings.companyName = document.getElementById('settingCompanyName').value;
  appState.settings.companyEmail = document.getElementById('settingCompanyEmail').value;
  appState.settings.ship24ApiKey = document.getElementById('settingApiKey').value;
  appState.settings.shipmentRefreshInterval = parseInt(document.getElementById('settingRefreshInterval').value);
  appState.settings.enableShipmentNotifications = document.getElementById('settingNotifications').value === 'true';

  saveState();
  showToast('✅ Settings saved');
}

function exportData() {
  const dataStr = JSON.stringify(appState, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `floraos_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Backup downloaded');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      appState = imported;
      saveState();
      location.reload();
      showToast('✅ Data imported successfully');
    } catch (error) {
      showToast('⚠️ Invalid backup file', 'error');
    }
  };
  reader.readAsText(file);
}

function resetApp() {
  if (confirm('⚠️ This will DELETE ALL DATA. Are you absolutely sure?')) {
    if (confirm('Final confirmation: Delete everything?')) {
      localStorage.removeItem('floraos_state');
      location.reload();
    }
  }
}

// ============================================================================
// MODAL SYSTEM
// ============================================================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    // Set today's date as default for date inputs
    modal.querySelectorAll('input[type="date"]').forEach(input => {
      if (!input.value) {
        input.value = new Date().toISOString().split('T')[0];
      }
    });
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast';

  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `
    <span style="font-size: 20px;">${icon}</span>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function sortTable(entity, column) {
  // Simple sort implementation
  appState[entity].sort((a, b) => {
    const aVal = a[column];
    const bVal = b[column];
    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal);
    }
    return aVal - bVal;
  });
  saveState();

  // Re-render appropriate view
  if (entity === 'batches') renderBatches();
}

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

document.addEventListener('keydown', (e) => {
  // Cmd/Ctrl + K for search
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.getElementById('batchSearch');
    if (searchInput) searchInput.focus();
  }

  // Cmd/Ctrl + N for new item (context-dependent)
  if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
    e.preventDefault();
    const activeModule = document.querySelector('.module.active');
    if (activeModule) {
      const moduleId = activeModule.id;
      if (moduleId === 'lab') openModal('addBatchModal');
      else if (moduleId === 'shipments') openModal('addShipmentModal');
      else if (moduleId === 'business') openModal('addOrderModal');
      else if (moduleId === 'productivity') openModal('addTaskModal');
    }
  }

  // Escape to close modals
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });
  }
});

// ============================================================================
// OFFLINE DETECTION
// ============================================================================

window.addEventListener('online', () => {
  showToast('🟢 Back online');
});

window.addEventListener('offline', () => {
  showToast('🔴 You are offline', 'warning');
});

// ============================================================================
// INITIALIZE APPLICATION ON LOAD
// ============================================================================

document.addEventListener('DOMContentLoaded', initApp);