import connectDB from "../lib/database";

async function checkDatabaseConnection() {
  try {
    console.log("🔄 Checking database connection...");

    const connection = await connectDB();

    if (connection.connection.readyState === 1) {
      console.log("✅ Database connected successfully!");
      console.log(
        `📍 Connected to: ${connection.connection.name || "Database"}`
      );
    } else {
      console.log("❌ Database connection failed");
    }

    // Close the connection
    await connection.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Database connection error:",
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

checkDatabaseConnection();
