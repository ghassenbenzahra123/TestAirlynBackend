import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISong extends Document {
  title: string;
  artist: string;
  album: string;
  year: number;
  duration: string;
  src: string;
}

const songSchema: Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    album: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Song: Model<ISong> = mongoose.model<ISong>("Song", songSchema);

export default Song;
