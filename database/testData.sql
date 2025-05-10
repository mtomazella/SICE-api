-- Insert into Category
INSERT INTO
    Category (name, description)
VALUES
    ('Books', 'All kinds of books'),
    ('Electronics', 'Gadgets and devices'),
    ('Clothing', 'Apparel and fashion');

-- Insert into "user"
INSERT INTO
    "user" (name, role, email, password)
VALUES
    ('Admin', 'admin', 'admin', 'admin'),
    ('Bob Smith', 'editor', 'bob@example.com', 'admin'),
    (
        'Carol White',
        'viewer',
        'carol@example.com',
        'admin'
    );

-- Insert into Tag
INSERT INTO
    Tag DEFAULT
VALUES;

INSERT INTO
    Tag DEFAULT
VALUES;

-- Insert into Label
INSERT INTO
    Label (name, description)
VALUES
    ('Color', 'Color attribute'),
    ('Size', 'Size attribute'),
    ('Material', 'Material type');

-- Insert into Package
INSERT INTO
    Package (name, description, tagId)
VALUES
    ('Starter Pack', 'Introductory items', 1),
    ('Premium Pack', 'Full-featured items', 2);

-- Insert into Item
INSERT INTO
    Item (
        name,
        description,
        tagId,
        categoryId,
        packageId,
        userId
    )
VALUES
    ('E-Reader', 'Digital book reader', 1, 1, 1, 1),
    ('Smartphone', 'High-end smartphone', 2, 2, 2, 2),
    ('T-Shirt', 'Cotton t-shirt', NULL, 3, NULL, 3);

-- Insert into Item_Label
INSERT INTO
    Item_Label (itemId, labelId, value)
VALUES
    (1, 1, 'Black'),
    (1, 2, 'Medium'),
    (2, 1, 'Silver'),
    (3, 1, 'White'),
    (3, 2, 'Large'),
    (3, 3, 'Cotton');

-- Insert into Permission
INSERT INTO
    Permission (id, description)
VALUES
    ('read_items', 'Permission to read items'),
    ('edit_items', 'Permission to edit items'),
    ('delete_items', 'Permission to delete items');

-- Insert into User_Permission
INSERT INTO
    User_Permission (userId, permissionId)
VALUES
    (1, 'read_items'),
    (1, 'edit_items'),
    (1, 'delete_items'),
    (2, 'read_items'),
    (2, 'edit_items'),
    (3, 'read_items');
