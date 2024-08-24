document.addEventListener('DOMContentLoaded', () => {
    fetchCustomers();
    fetchDashboardMetrics();

    const customerForm = document.getElementById('customer-form');
    customerForm.addEventListener('submit', addCustomer);

    const interactionForm = document.getElementById('interaction-form');
    interactionForm.addEventListener('submit', logInteraction);
});

async function fetchCustomers() {
    
    fetch('http://localhost:3000/customers')
        .then(response => response.json())
        .then(customers => {
            const customerList = document.getElementById('customer-list');
            const customerSelect = document.getElementById('customer-id');
            customerList.innerHTML = '';
            customerSelect.innerHTML = '';

            customers.forEach(customer => {
                const li = document.createElement('li');
                li.textContent = `${customer.name} (${customer.email})`;
                customerList.appendChild(li);

                const option = document.createElement('option');
                option.value = customer.customer_id;
                option.textContent = customer.name;
                customerSelect.appendChild(option);
            });
        });
}

function fetchDashboardMetrics() {
    fetch('http://localhost:3000/dashboard-metrics')
        .then(response => response.json())
        .then(metrics => {
            document.getElementById('total-customers').textContent = metrics.totalCustomers;
            document.getElementById('total-opportunities').textContent = metrics.opportunitiesByStages;

            const opportunitiesByStage = document.getElementById('opportunities-by-stage');
            opportunitiesByStage.textContent = metrics.totalOpp;
            // metrics.opportunitiesByStage.forEach(stage => {
            //     const li = document.createElement('li');
            //     li.textContent = `${stage.stage}: ${stage.count}`;
            //     opportunitiesByStage.appendChild(li);
            // });
        });
}

function showCustomerForm() {
    document.getElementById('customer-form-modal').style.display = 'block';
}

function closeCustomerForm() {
    document.getElementById('customer-form-modal').style.display = 'none';
}

function addCustomer(event) {
    event.preventDefault();

    const customerData = {
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value,
        phone: document.getElementById('customer-phone').value,
        address: document.getElementById('customer-address').value,
    };

    fetch('http://localhost:3000/customers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
    })
    .then(response => response.json())
    .then(result => {
        fetchCustomers();
        fetchDashboardMetrics();
        closeCustomerForm();
    });
}

function logInteraction(event) {
    event.preventDefault();
    

    const interactionData = {
        type: document.getElementById('interaction-type').value,
        notes: document.getElementById('interaction-notes').value,
    };
    
    const customerId = document.getElementById('customer-id').value;
    
    fetch(`http://localhost:3000/customers/${customerId}/interactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(interactionData),
    })
    .then(response => response.json())
    .then(result => {
        fetchCustomers(); 
        fetchDashboardMetrics();
        alert("interaction is added")// Refresh customer list to include new interaction
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
}
