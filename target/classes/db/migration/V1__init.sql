CREATE TABLE businesses (
    id BIGINT PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT,
    phone TEXT,
    created_at TEXT
);

CREATE TABLE procedures (
    id BIGINT PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price REAL NOT NULL,
    active INTEGER NOT NULL,
    business_id BIGINT,
    FOREIGN KEY (business_id) REFERENCES businesses (id)
);

CREATE TABLE customers (
    id BIGINT PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    notes TEXT,
    business_id BIGINT,
    FOREIGN KEY (business_id) REFERENCES businesses (id)
);

CREATE TABLE appointments (
    id BIGINT PRIMARY KEY AUTOINCREMENT,
    start_date_time TEXT NOT NULL,
    end_date_time TEXT NOT NULL,
    status TEXT NOT NULL,
    customer_id BIGINT,
    procedure_id BIGINT,
    business_id BIGINT,
    notes TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers (id),
    FOREIGN KEY (procedure_id) REFERENCES procedures (id),
    FOREIGN KEY (business_id) REFERENCES businesses (id)
);

INSERT INTO businesses (name, slug, created_at)
VALUES ('Demo Studio de Estética', 'demo-studio', datetime('now'));
