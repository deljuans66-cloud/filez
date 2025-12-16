// seed.js
import db from "#db/client";

async function seed() {
  try {
    console.log("Clearing existing data...");
    await db.query("DELETE FROM files;");
    await db.query("DELETE FROM folders;");

    console.log("Inserting folders...");

    const folderNames = ["Documents", "Pictures", "Music"];

    const folderResults = await Promise.all(
      folderNames.map((name) =>
        db.query(
          `
          INSERT INTO folders (name)
          VALUES ($1)
          RETURNING id;
        `,
          [name]
        )
      )
    );

    const folderIds = folderResults.map((result) => result.rows[0].id);

    console.log("Inserting files...");

    const filesByFolder = [
      [
        "resume.pdf",
        "cover_letter.docx",
        "notes.txt",
        "budget.xlsx",
        "todo.md",
      ],
      [
        "vacation.jpg",
        "family.png",
        "cat.png",
        "screenshot1.png",
        "wallpaper.jpg",
      ],
      [
        "song1.mp3",
        "song2.mp3",
        "playlist.m3u",
        "podcast1.mp3",
        "audiobook.mp3",
      ],
    ];

    const fileInserts = [];

    folderIds.forEach((folderId, index) => {
      const files = filesByFolder[index];
      files.forEach((fileName, fileIndex) => {
        const size = 1000 + fileIndex * 100; // any non-null integer
        fileInserts.push(
          db.query(
            `
            INSERT INTO files (name, size, folder_id)
            VALUES ($1, $2, $3);
          `,
            [fileName, size, folderId]
          )
        );
      });
    });

    await Promise.all(fileInserts);

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await db.end?.();
  }
}

seed();
