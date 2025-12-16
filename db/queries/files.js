import db from "#db/client";

export async function getAllFilesWithFolderName() {
  const sql = `
    SELECT
      files.*,
      folders.name AS folder_name
    FROM files
    JOIN folders ON folders.id = files.folder_id
    ORDER BY files.id;
  `;
  const { rows } = await db.query(sql);
  return rows;
}

export async function createFile({ name, size, folderId }) {
  const sql = `
    WITH new_file AS (
      INSERT INTO files (name, size, folder_id)
      VALUES ($1, $2, $3)
      RETURNING *
    )
    SELECT
      new_file.*,
      folders.name AS folder_name
    FROM new_file
    JOIN folders ON folders.id = new_file.folder_id;
  `;
  const {
    rows: [file],
  } = await db.query(sql, [name, size, folderId]);
  return file;
}
