const express = require('express');
const bodyParser = require('body-parser');
const mysql=require('mysql2') // Adjust if using a different database
require('dotenv').config();
const app = express();
const port = 3000;
const cors = require('cors');
app.use(bodyParser.json());
// Use CORS middleware
app.use(cors({
    origin: '*', // Allow all origins; you can specify a specific origin like 'http://yourfrontend.com'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify which HTTP methods are allowed
    credentials: true, // Allow cookies and authentication headers
}));
const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
  });
  db.connect((err) => {
    if (err) {
      console.log(process.env.MYSQL_HOST+
        process.env.MYSQL_PORT
        +process.env.MYSQL_USER
        +process.env.MYSQL_PASSWORD
        +process.env.MYSQL_DB)
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the MySQL database!');
  });

// Routes

app.get('/customers', async (req, res) => {
    db.query('SELECT * FROM customers', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/customers/:id', async (req, res) => {
    db.query('SELECT * FROM customers WHERE customer_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

app.post('/customers', async (req, res) => {
    const { name, email, phone, address } = req.body;
    db.query(
        'INSERT INTO customers (name, email, phone, address, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [name, email, phone, address],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            db.query('SELECT * FROM customers WHERE customer_id = ?', [results.insertId], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json(results[0]);
            });
        }
    );
});

app.put('/customers/:id', async (req, res) => {
    const { name, email, phone, address } = req.body;
    db.query(
        'UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, updated_at = NOW() WHERE customer_id = ?',
        [name, email, phone, address, req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            db.query('SELECT * FROM customers WHERE customer_id = ?', [req.params.id], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(results[0]);
            });
        }
    );
});

app.delete('/customers/:id', async (req, res) => {
    db.query('DELETE FROM customers WHERE customer_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).send();
    });
});

// 2. Contacts
app.get('/customers/:customerId/contacts', async (req, res) => {
    db.query('SELECT * FROM contacts WHERE customer_id = ?', [req.params.customerId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/customers/:customerId/contacts', async (req, res) => {
    const { name, email, phone, position } = req.body;
    db.query(
        'INSERT INTO contacts (customer_id, name, email, phone, position, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [req.params.customerId, name, email, phone, position],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            db.query('SELECT * FROM contacts WHERE contact_id = ?', [results.insertId], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json(results[0]);
            });
        }
    );
});

app.put('/contacts/:id', async (req, res) => {
    const { name, email, phone, position } = req.body;
    db.query(
        'UPDATE contacts SET name = ?, email = ?, phone = ?, position = ?, updated_at = NOW() WHERE contact_id = ?',
        [name, email, phone, position, req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            db.query('SELECT * FROM contacts WHERE contact_id = ?', [req.params.id], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(results[0]);
            });
        }
    );
});

app.delete('/contacts/:id', async (req, res) => {
    db.query('DELETE FROM contacts WHERE contact_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).send();
    });
});

// 3. Opportunities
app.get('/customers/:customerId/opportunities', async (req, res) => {
    db.query('SELECT * FROM opportunities WHERE customer_id = ?', [req.params.customerId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/customers/:customerId/opportunities', async (req, res) => {
    const { title, description, stage, value } = req.body;
    db.query(
        'INSERT INTO opportunities (customer_id, title, description, stage, value, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [req.params.customerId, title, description, stage, value],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            db.query('SELECT * FROM opportunities WHERE opportunity_id = ?', [results.insertId], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json(results[0]);
            });
        }
    );
});

app.put('/opportunities/:id', async (req, res) => {
    const { title, description, stage, value } = req.body;
    db.query(
        'UPDATE opportunities SET title = ?, description = ?, stage = ?, value = ?, updated_at = NOW() WHERE opportunity_id = ?',
        [title, description, stage, value, req.params.id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            db.query('SELECT * FROM opportunities WHERE opportunity_id = ?', [req.params.id], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json(results[0]);
            });
        }
    );
});

app.delete('/opportunities/:id', async (req, res) => {
    db.query('DELETE FROM opportunities WHERE opportunity_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(204).send();
    });
});

// 4. Interactions
app.get('/customers/:customerId/interactions', async (req, res) => {
    db.query('SELECT * FROM interactions WHERE customer_id = ?', [req.params.customerId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/customers/:customerId/interactions', async (req, res) => {
    
    const { type, notes } = req.body;
    db.query(
        'INSERT INTO interactions (customer_id, type, notes, date, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW(), NOW())',
        [req.params.customerId, type, notes],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            db.query('SELECT * FROM interactions WHERE interaction_id = ?', [results.insertId], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json(results[0]);
            });
        }
    );
});
// 4. Interactions
app.put('/interactions/:id', (req, res) => {
    const { type, notes } = req.body;
    db.query(
        'UPDATE interactions SET type = ?, notes = ?, date = NOW(), updated_at = NOW() WHERE interaction_id = ?',
        [type, notes, req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            db.query('SELECT * FROM interactions WHERE interaction_id = ?', [req.params.id], (err, updatedInteraction) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json(updatedInteraction[0]);
            });
        }
    );
});

app.delete('/interactions/:id', (req, res) => {
    db.query('DELETE FROM interactions WHERE interaction_id = ?', [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send();
    });
});

// 5. Dashboard Metrics
app.get('/dashboard-metrics', (req, res) => {
    db.query('SELECT COUNT(*) as count FROM customers', (err, totalCustomers) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.query('SELECT COUNT(*) as count FROM interactions', (err, totalOpportunities) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            db.query('SELECT COUNT(*) as count FROM opportunities', (err, opportunitiesByStage) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                const a={
                    totalCustomers: totalCustomers[0].count,
                    opportunitiesByStages: opportunitiesByStage[0].count,
                    totalOpp: totalOpportunities[0].count
                }
                console.log(a)
                res.json(a);

            });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`CRM API running on http://localhost:${port}`);
});
