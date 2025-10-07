import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const uri = process.env.MONGO_DB_URI as string;

async function main() {
    mongoose.connection.on("connected", () => {
        console.log("✅ MongoDB Driver connected to MongoDB TCP Server", mongoose.connection.name);
    });

    mongoose.connection.on("error", (err) => {
        console.error("❌ Error while connecting to MongoDB Server:", err);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("⚠️ MongoDB Server disconnected from MongoDB Driver");
    });

    try {
        // Connect to MongoDb Database
        const res = await mongoose.connect(uri);
        console.log("Database connection ready", res.connection.name, res.connection.host, res.connection.port);

    } catch (err) {
        console.error("❌ Failed to connect to MongoDB:", err);
    }
}

main().catch((err) => {
    console.error("Unhandled exception in main():", err);
});
