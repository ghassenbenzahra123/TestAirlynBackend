import mongoose from "mongoose";

export const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URL as string);
    console.log("MongoDB is connected");
  } catch (error) {
    console.log(error);
  }
};
