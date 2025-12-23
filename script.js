// ================================
// 0. DOM ELEMENTS
// ================================
// Grab references to HTML elements used in the app
const balance = document.getElementById('balance');       // Shows total balance
const money_plus = document.getElementById('money-plus'); // Shows total income
const money_minus = document.getElementById('money-minus'); // Shows total expenses
const list = document.getElementById('list');            // Dashboard recent transactions list
const fullList = document.getElementById('full-list');   // Transactions page full list
const form = document.getElementById('form');            // Add transaction form
const text = document.getElementById('text');            // Input for description
const amount = document.getElementById('amount');        // Input for amount
const typeSelect = document.getElementById('type');      // Dropdown for type (income/expense)
const recurringCheck = document.getElementById('recurring'); // Checkbox for recurring transactions
const searchInput = document.getElementById('search');   // Search input for filtering transactions
const loader = document.getElementById('loader');        // Loader animation for UX

// Edit mode helpers
const editIdInput = document.getElementById('edit-id');  // Hidden input to store ID of transaction being edited
const submitBtn = document.querySelector('.btn');        // Submit button
let isEditMode = false;                                   // Flag for edit mode

// Navigation elements
const navItems = document.querySelectorAll('.nav-links li'); // Sidebar navigation items
const views = document.querySelectorAll('.view-section');   // All page sections
const pageTitle = document.getElementById('page-title');    // Page title in header

// Global state for transactions
let globalTransactions = []; // Array to store all transactions in-memory

// ================================
// 1. LOCAL STORAGE HANDLERS
// ================================

// Save current transactions to browser localStorage
function saveToLocalStorage() {
    localStorage.setItem('budgetBuddyData', JSON.stringify(globalTransactions));
    updateDashboard(); // Refresh UI after saving
}

// Load transactions from localStorage (acts like a "database")
function loadFromLocalStorage() {
    loader.classList.add('show'); // Show loading animation

    // Simulate a short delay for better UX
    setTimeout(() => {
        const storedData = localStorage.getItem('budgetBuddyData');

        if (storedData) {
            globalTransactions = JSON.parse(storedData); // Load existing data
        } else {
            globalTransactions = []; // Initialize empty array if none
        }

        updateDashboard();           // Refresh dashboard stats
        loader.classList.remove('show'); // Hide loader
    }, 500);
}

// ================================
// 2. NAVIGATION LOGIC
// ================================
// Handles sidebar navigation clicks
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove 'active' class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active'); // Add 'active' to clicked nav

        // Hide all views first
        views.forEach(view => view.classList.add('hidden'));

        // Show selected view
        if (item.id === 'nav-dashboard') {
            document.getElementById('view-dashboard').classList.remove('hidden');
            pageTitle.innerText = 'Overview';
            updateDashboard();
        } else if (item.id === 'nav-transactions') {
            document.getElementById('view-transactions').classList.remove('hidden');
            pageTitle.innerText = 'All Transactions';
            renderFullList(globalTransactions); // Show all transactions
        } else if (item.id === 'nav-settings') {
            document.getElementById('view-settings').classList.remove('hidden');
            pageTitle.innerText = 'Settings';
        }
    });
});

// ================================
// 3. FORMATTING HELPERS
// ================================

// Format numbers as USD currency
function formatMoney(number) {
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// Format date string into readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// ================================
// 4. DASHBOARD UPDATE LOGIC
// ================================

// Updates the dashboard stats and recent transactions
function updateDashboard() {
    // Convert transactions into amounts (+/-)
    const amounts = globalTransactions.map(t => t.type === 'expense' ? -Math.abs(t.amount) : Math.abs(t.amount));

    // Calculate totals
    const total = amounts.reduce((acc, item) => acc + item, 0);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1);

    // Update dashboard DOM
    balance.innerText = formatMoney(total);
    money_plus.innerText = `+${formatMoney(income)}`;
    money_minus.innerText = `-${formatMoney(expense)}`;

    // Update chart
    updateChart(income, expense);

    // Update top 5 recent transactions
    list.innerHTML = '';
    const recent = globalTransactions.slice().reverse().slice(0, 5);
    recent.forEach(t => addTransactionDOM(t, list));
}

// Add transaction item to the DOM (list)
function addTransactionDOM(transaction, listElement) {
    const isExpense = transaction.type === 'expense';
    const sign = isExpense ? '-' : '+';
    const itemClass = isExpense ? 'expense' : 'income';
    const displayDate = transaction.date ? formatDate(transaction.date) : formatDate(new Date());

    const recurringBadge = transaction.recurring ? '<span class="recurring-icon"><i class="fa-solid fa-rotate"></i></span>' : '';

    const item = document.createElement('li');
    item.classList.add(itemClass);

    item.innerHTML = `
        <div class="list-info">
            <span>${transaction.description} ${recurringBadge}</span>
            <small class="list-date">${displayDate}</small>
        </div>
        <span class="amount-text">${sign}${formatMoney(Math.abs(transaction.amount))}</span>
        <div class="action-btn-container">
            <button class="edit-btn" onclick="editTransaction('${transaction.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn" onclick="removeTransaction('${transaction.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;

    listElement.appendChild(item);
}

// ================================
// 5. ADD / EDIT TRANSACTIONS
// ================================

// Generate random ID for new transactions
function generateID() {
    return Math.floor(Math.random() * 100000000).toString();
}

// Add or update transaction
function addTransaction(e) {
    e.preventDefault(); // Prevent page reload

    if (text.value.trim() === '' || amount.value.trim() === '') return; // Validate

    const transactionData = {
        id: isEditMode ? editIdInput.value : generateID(),
        description: text.value,
        amount: +amount.value,
        type: typeSelect.value,
        date: new Date().toISOString(),
        recurring: recurringCheck.checked
    };

    if (isEditMode) {
        // Update existing transaction
        const index = globalTransactions.findIndex(t => t.id === transactionData.id);
        if (index !== -1) {
            globalTransactions[index] = transactionData;
        }
        isEditMode = false;
        submitBtn.innerText = 'Add Transaction';
    } else {
        // Add new transaction
        globalTransactions.push(transactionData);
    }

    saveToLocalStorage(); // Persist

    // Reset form
    text.value = '';
    amount.value = '';
    recurringCheck.checked = false;
    editIdInput.value = '';
}

// Edit transaction (populate form with existing data)
function editTransaction(id) {
    document.getElementById('nav-dashboard').click(); // Switch to dashboard

    const transaction = globalTransactions.find(t => t.id === id);
    if (!transaction) return;

    text.value = transaction.description;
    amount.value = transaction.amount;
    typeSelect.value = transaction.type;
    recurringCheck.checked = transaction.recurring || false;
    editIdInput.value = transaction.id;

    isEditMode = true;
    submitBtn.innerText = 'Update Transaction';
}

// Remove transaction
function removeTransaction(id) {
    if (confirm('Delete this transaction?')) {
        globalTransactions = globalTransactions.filter(t => t.id !== id);
        saveToLocalStorage();
    }
}

// ================================
// 6. RESET ALL DATA
// ================================

const resetBtn = document.getElementById('reset-btn');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if(confirm('WARNING: This will permanently delete ALL data. Are you sure?')) {
            globalTransactions = [];
            saveToLocalStorage();
            alert('All data has been reset.');
        }
    });
}

// ================================
// 7. SEARCH FUNCTIONALITY
// ================================

// Render all transactions
function renderFullList(data) {
    fullList.innerHTML = '';
    data.slice().reverse().forEach(t => addTransactionDOM(t, fullList));
}

// Filter transactions based on search input
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = globalTransactions.filter(t =>
        t.description.toLowerCase().includes(term) ||
        t.amount.toString().includes(term)
    );
    renderFullList(filtered);
});

// ================================
// 8. CHART LOGIC (DOUGHNUT CHART)
// ================================

let expenseChart = null;

function updateChart(income, expense) {
    const canvas = document.getElementById('expenseChart');
    const ctx = canvas.getContext('2d');

    if (expenseChart instanceof Chart) expenseChart.destroy(); // Reset previous chart

    // Gradient colors for chart slices
    const incomeGradient = ctx.createLinearGradient(0, 0, 0, 400);
    incomeGradient.addColorStop(0, '#818cf8');
    incomeGradient.addColorStop(1, '#312e81');

    const expenseGradient = ctx.createLinearGradient(0, 0, 0, 400);
    expenseGradient.addColorStop(0, '#f87171');
    expenseGradient.addColorStop(1, '#991b1b');

    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [income, expense],
                backgroundColor: [incomeGradient, expenseGradient],
                borderWidth: 0,
                hoverOffset: 20,
                borderRadius: 20,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { backgroundColor: '#1e293b' }
            }
        }
    });
}

// ================================
// 9. INIT
// ================================

form.addEventListener('submit', addTransaction); // Attach form submit listener
loadFromLocalStorage();                          // Load stored data on app start
