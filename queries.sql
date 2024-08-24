USE crm;

CREATE TABLE customers (
    customer_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);


INSERT INTO customers (name, email, phone, address, created_at, updated_at) VALUES
('Acme Corporation', 'contact@acme.com', '555-1234', '123 Elm St, Springfield, IL', NOW(), NOW()),
('Globex Corporation', 'info@globex.com', '555-5678', '456 Oak St, Shelbyville, IL', NOW(), NOW()),
('Initech', 'sales@initech.com', '555-9012', '789 Maple St, Capital City, IL', NOW(), NOW()),
('Soylent Corp', 'support@soylent.com', '555-3456', '101 Pine St, Ogdenville, IL', NOW(), NOW()),
('Umbrella Corp', 'admin@umbrella.com', '555-7890', '202 Cedar St, North Haverbrook, IL', NOW(), NOW());

SELECT * FROM customers;


CREATE TABLE contacts (
    contact_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED REFERENCES customers(customer_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    position VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);






INSERT INTO contacts (customer_id, name, email, phone, position, created_at, updated_at) VALUES
(1, 'John Doe', 'johndoe@acme.com', '555-0001', 'CEO', NOW(), NOW()),
(1, 'Jane Smith', 'janesmith@acme.com', '555-0002', 'CTO', NOW(), NOW()),
(2, 'Robert Brown', 'robertbrown@globex.com', '555-0003', 'COO', NOW(), NOW()),
(3, 'Lisa White', 'lisawhite@initech.com', '555-0004', 'CFO', NOW(), NOW()),
(4, 'Mark Black', 'markblack@soylent.com', '555-0005', 'CMO', NOW(), NOW());



CREATE TABLE opportunities (
    opportunity_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED REFERENCES customers(customer_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    stage VARCHAR(50) NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);


INSERT INTO opportunities (customer_id, title, description, stage, value, created_at, updated_at) VALUES
(1, 'Acme SaaS Integration', 'Integrate SaaS solution with existing systems', 'Proposal', 50000, NOW(), NOW()),
(2, 'Globex Cloud Migration', 'Migrate data and apps to cloud platform', 'Negotiation', 75000, NOW(), NOW()),
(3, 'Initech Software Development', 'Custom software development for internal use', 'Closed Won', 100000, NOW(), NOW()),
(4, 'Soylent Marketing Campaign', 'Digital marketing campaign for new product launch', 'Qualification', 30000, NOW(), NOW()),
(5, 'Umbrella Disaster Recovery', 'Setup disaster recovery plan and infrastructure', 'Proposal', 80000, NOW(), NOW());



CREATE TABLE interactions (
    interaction_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT UNSIGNED REFERENCES customers(customer_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    notes TEXT,
    date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);


INSERT INTO interactions (customer_id, type, notes, date, created_at, updated_at) VALUES
(1, 'Call', 'Discussed project scope and requirements', NOW(), NOW(), NOW()),
(2, 'Email', 'Sent proposal for cloud migration project', NOW(), NOW(), NOW()),
(3, 'Meeting', 'Reviewed software development progress', NOW(), NOW(), NOW()),
(4, 'Call', 'Discussed marketing strategies and budget', NOW(), NOW(), NOW()),
(5, 'Email', 'Sent disaster recovery plan proposal', NOW(), NOW(), NOW());

SELECT * FROM interactions;