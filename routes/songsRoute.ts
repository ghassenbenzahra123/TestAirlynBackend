import express, { Router, Request, Response } from "express";
import AuthMiddleware from "../middlewares/authMiddleware";
import Song from "../models/songModel";
import User from "../models/userModel";

const router: Router = express.Router();

router.post("/get-all-songs", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const songs = await Song.find();
    res.status(200).send({
      message: "Songs fetched successfully",
      success: true,
      data: songs,
    });
  } catch (error) {
    res.status(500).send({ message: "Error fetching songs", success: false, data: error });
  }
});

router.post("/add-playlist", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      res.status(404).send({ message: "User not found", success: false });
      return;
    }

    const existingPlaylists = user.playlists;
    existingPlaylists.push({
      name: req.body.name,
      songs: req.body.songs,
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        playlists: existingPlaylists,
      },
      { new: true }
    );

    res.status(200).send({
      message: "Playlist created successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error creating playlist",
      success: false,
      data: error,
    });
  }
});

router.post("/update-playlist", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      res.status(404).send({ message: "User not found", success: false });
      return;
    }

    let existingPlaylists = user.playlists;
    existingPlaylists = existingPlaylists.map((playlist) => {
      if (playlist.name === req.body.name) {
        playlist.songs = req.body.songs;
      }
      return playlist;
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        playlists: existingPlaylists,
      },
      { new: true }
    );

    res.status(200).send({
      message: "Playlist updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error updating playlist",
      success: false,
      data: error,
    });
  }
});

router.post("/delete-playlist", AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      res.status(404).send({ message: "User not found", success: false });
      return;
    }

    let existingPlaylists = user.playlists;
    existingPlaylists = existingPlaylists.filter((playlist) => {
      if (playlist.name === req.body.name) {
        return false;
      }
      return true;
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      {
        playlists: existingPlaylists,
      },
      { new: true }
    );

    res.status(200).send({
      message: "Playlist deleted successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error deleting playlist",
      success: false,
      data: error,
    });
  }
});

export default router;
