INSERT INTO suppliers (id, name, contact_email, phone, address)
VALUES ('50991100-0000-0000-0000-000000000001', 'TechSource Distributors', 'sales@techsource.example.com',
        '+40 264 100 100', 'Strada Fabricii 20, Cluj-Napoca, Romania'),
       ('50991100-0000-0000-0000-000000000002', 'Urban Apparel Supply Co.', 'orders@urbanapparel.example.com',
        '+40 21 200 200', 'Calea Victoriei 50, Bucharest, Romania'),
       ('50991100-0000-0000-0000-000000000003', 'GreenYard Wholesale', 'contact@greenyard.example.com',
        '+40 264 300 300', 'Strada Horticultorilor 7, Cluj-Napoca, Romania'),
       ('50991100-0000-0000-0000-000000000004', 'Active Gear Imports', 'info@activegear.example.com',
        '+40 21 400 400', 'Bulevardul Unirii 30, Bucharest, Romania');

-- Backfill supplier_id on products seeded by V1.1__populate_mock_data.sql, matching by product category.
UPDATE products
SET supplier_id = '50991100-0000-0000-0000-000000000001'
WHERE id IN ('fade0001-0000-0000-0000-000000000001',
             'fade0002-0000-0000-0000-000000000002',
             'fade0003-0000-0000-0000-000000000003');

UPDATE products
SET supplier_id = '50991100-0000-0000-0000-000000000002'
WHERE id IN ('fade0004-0000-0000-0000-000000000004',
             'fade0005-0000-0000-0000-000000000005');

UPDATE products
SET supplier_id = '50991100-0000-0000-0000-000000000003'
WHERE id IN ('fade0006-0000-0000-0000-000000000006',
             'fade0007-0000-0000-0000-000000000007');

UPDATE products
SET supplier_id = '50991100-0000-0000-0000-000000000004'
WHERE id IN ('fade0008-0000-0000-0000-000000000008',
             'fade0009-0000-0000-0000-000000000009',
             'fade000a-0000-0000-0000-00000000000a');
