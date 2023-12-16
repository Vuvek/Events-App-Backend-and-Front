import dotenv from 'dotenv';
import mongoose from "mongoose";

if(process.env.NODE_ENV !== "production") {
  dotenv.config()
}

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("Database Connected Successfully");
});

mongoose.set('strictQuery', false);

mongoose.connection.on("error", (error) => {
  console.log("Error Occured while connecting to Mongodb", error);
});
