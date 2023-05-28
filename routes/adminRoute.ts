import express, { Router, Request, Response } from "express";
import multer from "multer";
import AuthMiddleware from "../middlewares/authMiddleware";
import { cloudinary } from "../cloudinary";
import Song, { ISong } from "../models/songModel";

const router: Router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/add-song",
  AuthMiddleware,
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        throw new Error("File not found");
      }

      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "test-aero",
        use_filename: true,
        resource_type: "raw",
      });

      const newsong: ISong = new Song({
        title: req.body.title,
        artist: req.body.artist,
        src: result.url,
        album: req.body.album,
        duration: req.body.duration,
        year: req.body.year,
      });

      await newsong.save();
      const allSongs = await Song.find();

      res.status(200).send({
        message: "Song added successfully",
        success: true,
        data: allSongs,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error adding song",
        success: false,
        data: error,
      });
    }
  }
);

router.post(
  "/edit-song",
  AuthMiddleware,
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      let response: cloudinary.UploadApiResponse | null = null;
      if (req.file) {
        response = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "test-aero",
          use_filename: true,
          resource_type: "raw",
        });
      }

      await Song.findByIdAndUpdate(req.body._id, {
        title: req.body.title,
        artist: req.body.artist,
        src: response ? response.url : req.body.src,
        album: req.body.album,
        duration: req.body.duration,
        year: req.body.year,
      });

      const allSongs = await Song.find();

      res.status(200).send({
        message: "Song edited successfully",
        success: true,
        data: allSongs,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error adding song",
        success: false,
        data: error,
      });
    }
  }
);

export default router;
