INSERT INTO suppliers (id, name, contact_email, phone, address)
VALUES ('50991100-0000-0000-0000-000000000099', 'Legacy Supplier', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

UPDATE products
SET supplier_id = '50991100-0000-0000-0000-000000000099'
WHERE supplier_id IS NULL;

ALTER TABLE products
    ALTER COLUMN supplier_id SET NOT NULL;
