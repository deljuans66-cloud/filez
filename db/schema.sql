DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS folders;

-- FOLDERS TABLE
CREATE TABLE folders (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- FILES TABLE
CREATE TABLE files (
  id        SERIAL PRIMARY KEY,
  name      TEXT    NOT NULL,
  size      INTEGER NOT NULL,
  folder_id INTEGER NOT NULL
    REFERENCES folders(id) ON DELETE CASCADE,
  CONSTRAINT files_name_folder_id_unique UNIQUE (name, folder_id)
);
