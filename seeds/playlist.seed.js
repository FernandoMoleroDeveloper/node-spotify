const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Playlist } = require("../models/Playlist.js");
const { Song } = require("../models/Song.js");
const { User } = require("../models/User.js");

const playlistSeed = async () => {
  try {
    // CONEXION
    const database = await connect();

    // BORRADO

    await Playlist.collection.drop();
    console.log("Borrado playlist");

    // CREACION DOCUMENTOS

    const songList = await Song.find({});
    const userList = await User.find({});

    let playlistList = [
      {
        name: "Pops",
        song: [songList[0], songList[2], songList[3], songList[15]],
        user: userList[0],
      },
      {
        name: "Rocks",
        song: [songList[25], songList[30], songList[27], songList[41]],
        user: userList[1],
      },
      {
        name: "Mierder",
        song: [songList[35], songList[34], songList[33], songList[32]],
        user: userList[2],
      },
      {
        name: "Happy",
        song: [songList[30], songList[44], songList[43], songList[31]],
        user: userList[3],
      },
      {
        name: "Sad",
        song: [songList[49], songList[48], songList[24], songList[22]],
        user: userList[4],
      },
    ];

    // CREACION DE LOS OTROS DOCUMENTOS
    playlistList = playlistList.map((elem) => new Playlist(elem));
    await Playlist.insertMany(playlistList);
    console.log("Creados samples correctamente");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

playlistSeed();
