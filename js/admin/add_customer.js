// B. HANDLE ADD CUSTOMER FORM
const customerForm = document.getElementById('customerForm');

if (customerForm) {
    customerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            join_date: document.getElementById('join_date').value,
            password: document.getElementById('password').value
        };

        fetch('../api/admin/add_customer.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if(result.status === 'success') { 
                alert("New Customer Registered!");
                customerForm.reset();
            } else {
                alert("Error: " + result.message);
            }
        });
    });
}