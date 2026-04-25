import mongoose from "mongoose";
const ConnectDB=async()=>{
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("MongoDB connected successfully Hacks DB");
  } catch (error) {
    console.log("MongoDB connection failed", error);
    
  }
}
export default ConnectDB;