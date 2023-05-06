const express = require("express");

// Modelos
const { Playlist } = require("../models/Playlist.js");

// Router propio de usuarios
const router = express.Router();

// EJEMPLO DE REQ: http://localhost:3000/user?page=1&limit=10
router.get("/", async (req, res) => {
  try {
    // Así leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const playlists = await Playlist.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate(["song", "user"]);

    // Num total de elementos
    const totalElements = await Playlist.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: playlists,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const playlist = await Playlist.findById(id).populate(["user", "song"]);
    if (playlist) {
      res.json(playlist);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/title/:title", async (req, res) => {
  const title = req.params.title;

  try {
    const playlist = await Playlist.find({ title: new RegExp("^" + title.toLowerCase(), "i") }).populate(["song", "user"]);
    if (playlist?.length) {
      res.json(playlist);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Endpoint de creación

router.post("/", async (req, res) => {
  try {
    const playlist = new Playlist(req.body);
    const createdPlaylist = await playlist.save();
    return res.status(201).json(createdPlaylist);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Endpoint para eliminar

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const playlistDeleted = await Playlist.findByIdAndDelete(id);
    if (playlistDeleted) {
      res.json(playlistDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Endpoint update

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const playlistUpdated = await Playlist.findByIdAndUpdate(id, req.body, { new: true });
    if (playlistUpdated) {
      res.json(playlistUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = { playlistRouter: router };
