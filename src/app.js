import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import { APIResponse } from "./utils/APIResponse.js";
import { APIError } from "./utils/APIError.js";
import connectDB from "./db/db.js";


dotenv.config();


const app = express();


app.use(
  cors({
    origin: process.env.CLIENT,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route imports
import FAQRouter from "./routes/faq.js";

// route declaration
app.use("/api/v1/faqs", FAQRouter);

// catch-all route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "The requested route does not exist.",
    data: null,
  });
});

// error middleware
app.use((err, req, res,) => {
  if (err instanceof APIError) {
    const response = new APIResponse(err.statusCode, null, err.message);
    return res.status(err.statusCode).json(response);
  }
  console.error("Unexpected Error:", err); // Log the error for debugging
  const response = new APIResponse(500, null, "Internal Server Error");
  return res.status(500).json(response);
});


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error, couldn't start the server", error);
  });

