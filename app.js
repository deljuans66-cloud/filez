import express from "express";
const app = express();
export default app;

import { getAllFilesWithFolderName, createFile } from "./db/queries/files.js";
import {
  getFolders,
  getFolderWithFiles,
  getFolderById,
} from "./db/queries/folders.js";

app.use(express.json());

app.get("/files", async (req, res, next) => {
  try {
    const files = await getAllFilesWithFolderName();
    res.send(files);
  } catch (err) {
    next(err);
  }
});

app.get("/folders", async (req, res, next) => {
  try {
    const folders = await getFolders();
    res.send(folders);
  } catch (err) {
    next(err);
  }
});

app.get("/folders/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(404).send({ error: "Folder not found" });
    }

    const folder = await getFolderWithFiles(id);

    if (!folder) {
      return res.status(404).send({ error: "Folder not found" });
    }

    res.send(folder);
  } catch (err) {
    next(err);
  }
});

app.post("/folders/:id/files", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(404).send({ error: "Folder not found" });
    }

    const folder = await getFolderById(id);
    if (!folder) {
      return res.status(404).send({ error: "Folder not found" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "Request body required" });
    }

    const { name, size } = req.body;

    if (!name || size == null) {
      return res
        .status(400)
        .send({ error: "Request body must have: name, size" });
    }

    const file = await createFile({
      name,
      size,
      folderId: id,
    });

    res.status(201).send(file);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send({ error: "Internal server error" });
});
