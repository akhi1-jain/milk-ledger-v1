// js/user/ledger.js

// 1. Run immediately when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchLedger(); // Load default (30 days)
});

// 2. Main Function to Fetch Data
function fetchLedger() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const tableBody = document.getElementById('ledgerTableBody');

    // Prepare payload (empty object means "use defaults" in PHP)
    const payload = {};
    if (startDate && endDate) {
        payload.start_date = startDate;
        payload.end_date = endDate;
    }

    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Fetching data...</td></tr>';

    fetch('../api/user/get_ledger.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            renderTable(result.data);
            
            // Optional: Update inputs to show what range was actually fetched
            if (!startDate) {
                document.getElementById('startDate').value = result.range.start;
                document.getElementById('endDate').value = result.range.end;
            }
        } else {
            tableBody.innerHTML = `<tr><td colspan="6" style="color:red; text-align:center;">Error: ${result.message}</td></tr>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        tableBody.innerHTML = '<tr><td colspan="6" style="color:red; text-align:center;">Failed to load data</td></tr>';
    });
}

// 3. Helper to draw the table rows
function renderTable(entries) {
    const tableBody = document.getElementById('ledgerTableBody');
    tableBody.innerHTML = ''; // Clear "Loading..."

    if (entries.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No records found for this period.</td></tr>';
        return;
    }

    entries.forEach(entry => {
        const row = `
            <tr>
                <td>${formatDate(entry.log_date)}</td>
                <td>${entry.milk_type}</td>
                <td>${entry.tally} L</td>
                <td>${entry.snf}</td>
                <td>₹${entry.total_amount}</td>
                <td class="${entry.status === 'Accepted' ? 'status-accepted' : 'status-rejected'}">
                    ${entry.status}
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// 4. Helper to reset view
function resetFilters() {
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    fetchLedger();
}

// 5. Helper to format date nicely (DD-MM-YYYY)
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // en-GB gives DD/MM/YYYY
}