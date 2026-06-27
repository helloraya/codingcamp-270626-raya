// Ambil data dari Local Storage atau set array kosong kalau belum ada
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let expenseChart = null;

// Tangkap elemen-elemen dari HTML
const form = document.getElementById('expense-form');
const transactionList = document.getElementById('transaction-list');
const totalBalanceEl = document.getElementById('total-balance');
const ctx = document.getElementById('expense-chart').getContext('2d');

// --- OPTIONAL CHALLENGE 1: Dark Mode Toggle ---
// Bikin tombolnya langsung dari JS biar praktis
const themeBtn = document.createElement('button');
themeBtn.textContent = 'Toggle Dark Mode 🌙';
themeBtn.style.marginBottom = '20px';
document.querySelector('header').prepend(themeBtn);

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = document.body.classList.contains('dark-mode') 
        ? 'Toggle Light Mode ☀️' 
        : 'Toggle Dark Mode 🌙';
});

// Handle Form Submit
form.addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah page reload
    
    const name = document.getElementById('item-name').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    if (name.trim() === '' || isNaN(amount)) {
        alert('Tolong isi datanya dengan bener ya!');
        return;
    }

    const transaction = {
        id: Date.now(),
        name,
        amount,
        category
    };

    transactions.push(transaction);
    updateLocalStorage();
    init();
    form.reset();
});

// Delete Transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
}

// Update Local Storage (Biar data gak hilang pas di-refresh)
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Render UI (List dan Total Balance)
function updateUI() {
    transactionList.innerHTML = '';
    let total = 0;

    // --- OPTIONAL CHALLENGE 2: Sort Transactions ---
    // Diurutkan berdasarkan amount dari yang terbesar
    const sortedTransactions = [...transactions].sort((a, b) => b.amount - a.amount);

    sortedTransactions.forEach(t => {
        total += t.amount;
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${t.name}</strong> <small>(${t.category})</small><br>
                $${t.amount.toFixed(2)}
            </div>
            <button class="delete-btn" onclick="deleteTransaction(${t.id})">Delete</button>
        `;
        transactionList.appendChild(li);
    });

    totalBalanceEl.innerText = `$${total.toFixed(2)}`;

    // --- OPTIONAL CHALLENGE 3: Highlight Over Limit ---
    // Kalau pengeluaran lebih dari $100, warnanya jadi merah
    if (total > 100) {
        totalBalanceEl.classList.add('over-limit');
    } else {
        totalBalanceEl.classList.remove('over-limit');
    }
}

// Render Chart pakai Chart.js
function updateChart() {
    const categoryTotals = { Food: 0, Transport: 0, Fun: 0 };
    
    // Hitung total per kategori
    transactions.forEach(t => {
        if (categoryTotals[t.category] !== undefined) {
            categoryTotals[t.category] += t.amount;
        }
    });

    const data = [categoryTotals.Food, categoryTotals.Transport, categoryTotals.Fun];

    // Hapus chart lama kalau ada sebelum bikin yang baru
    if (expenseChart) {
        expenseChart.destroy();
    }

    // Bikin chart baru
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Food', 'Transport', 'Fun'],
            datasets: [{
                data: data,
                backgroundColor: ['#8C7A6B', '#A39182', '#D96C6C'], // Warna earth tones
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Jalanin fungsi init pas pertama kali load
function init() {
    updateUI();
    updateChart();
}

init();
