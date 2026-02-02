// A. HANDLE ADD ENTRY FORM
const entryForm = document.getElementById('entryForm');

if (entryForm) {
    entryForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop page refresh

        // 1. Gather data
        // LEFT SIDE: Keys sent to PHP. RIGHT SIDE: IDs from HTML
        const data = {
            reg_no:       document.getElementById('reg_no').value,       // PHP expects 'reg_no'
            tally:        document.getElementById('tally').value,
            snf:          document.getElementById('snf').value,
            milk_type:    document.getElementById('milk_type').value,        // HTML ID is 'type', sending as 'milk_type'
            date:         document.getElementById('date').value,
            total_amount: document.getElementById('total_amount').value, // HTML ID is 'totalAmount'
            status:       document.querySelector('input[name="status"]:checked').value
        };

        // 2. Send to PHP
        fetch('../api/admin/add_entry.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) // Convert object to JSON string
        })
        .then(response => response.json())
        .then(result => {
            console.log("Server Response:", result); // Debugging helper
            if(result.status === 'success') {
                alert("Entry Saved Successfully!");
                entryForm.reset(); 
            } else {
                alert("Error: " + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Request failed. Check console for details.");
        });
    });
}