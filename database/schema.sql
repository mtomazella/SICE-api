CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE Category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(15) NOT NULL UNIQUE,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
);

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(35) NOT NULL UNIQUE,
    role VARCHAR(20),
    email VARCHAR(254) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
);

CREATE TABLE Tag (
    id SERIAL PRIMARY KEY,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
);

CREATE TABLE Label (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
);

CREATE TABLE Package (
    id SERIAL PRIMARY KEY,
    description TEXT,
    tagId INTEGER REFERENCES Tag(id) ON DELETE SET NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
);

CREATE TABLE Item (
    id SERIAL PRIMARY KEY,
    description TEXT,
    tagId INTEGER REFERENCES Tag(id) ON DELETE SET NULL,
    categoryId INTEGER REFERENCES Category(id) ON DELETE SET NULL,
    packageId INTEGER REFERENCES Package(id) ON DELETE SET NULL,
    packageInsertByUserId INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
);

CREATE TABLE Item_Label (
    itemId INTEGER REFERENCES Item(id) ON DELETE SET NULL,
    labelId INTEGER REFERENCES Label(id) ON DELETE SET NULL,
    value VARCHAR(30),
    PRIMARY KEY (itemId, labelId),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
);

CREATE TABLE Permission (
    id VARCHAR(30) PRIMARY KEY,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
);

CREATE TABLE User_Permission (
    userId INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
    permissionId VARCHAR(30) REFERENCES Permission(id) ON DELETE SET NULL,
    PRIMARY KEY (userId, permissionId),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
);

CREATE TABLE Item_Log (
    id SERIAL PRIMARY KEY,
    categoryId INTEGER REFERENCES Category(id) ON DELETE SET NULL,
    packageId INTEGER REFERENCES Package(id) ON DELETE SET NULL,
    packageInsertByUserId INTEGER REFERENCES "user"(id) ON DELETE SET NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL
);

-- Trigger creations for updating updatedAt column
CREATE TRIGGER set_category_updated_at
BEFORE UPDATE ON Category
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_label_updated_at
BEFORE UPDATE ON Label
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_item_label_updated_at
BEFORE UPDATE ON Item_Label
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_item_updated_at
BEFORE UPDATE ON Item
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_package_updated_at
BEFORE UPDATE ON Package
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_user_updated_at
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_permission_updated_at
BEFORE UPDATE ON Permission
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_user_permission_updated_at
BEFORE UPDATE ON User_Permission
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_item_log_updated_at
BEFORE UPDATE ON Item_Log
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- create item_log record when item changes
CREATE OR REPLACE FUNCTION log_item_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO Item_Log (categoryId, packageId, packageInsertByUserId, createdAt, updatedAt)
  VALUES (NEW.categoryId, NEW.packageId, NEW.packageInsertByUserId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER item_changes_trigger
AFTER UPDATE ON Item
FOR EACH ROW
EXECUTE FUNCTION log_item_changes();

CREATE TRIGGER item_log_trigger
AFTER INSERT ON Item
FOR EACH ROW
EXECUTE FUNCTION log_item_changes();
