// db/queries/folders.js
import db from "#db/client";

export async function getFolders() {
  const sql = `
    SELECT *
    FROM folders
    ORDER BY id;
  `;
  const { rows } = await db.query(sql);
  return rows;
}

export async function getFolderWithFiles(id) {
  const sql = `
    SELECT
      folders.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', files.id,
            'name', files.name,
            'size', files.size,
            'folder_id', files.folder_id
          )
        ) FILTER (WHERE files.id IS NOT NULL),
        '[]'::json
      ) AS files
    FROM folders
    LEFT JOIN files
      ON files.folder_id = folders.id
    WHERE folders.id = $1
    GROUP BY folders.id;
  `;
  const {
    rows: [folder],
  } = await db.query(sql, [id]);
  return folder;
}

export async function getFolderById(id) {
  const sql = `
    SELECT *
    FROM folders
    WHERE id = $1;
  `;
  const {
    rows: [folder],
  } = await db.query(sql, [id]);
  return folder;
}
