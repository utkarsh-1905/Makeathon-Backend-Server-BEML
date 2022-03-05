if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const fs = require("fs");
const crypto = require("crypto");
const dbUrl = process.env.DB_URL;

const connectDB = async () => {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
connectDB()
  .then(() => console.log("Connected to Database"))
  .catch((e) => console.log(e));

const private = fs.readFileSync("./private.pem", "utf8");
const public = fs.readFileSync("./public.pem", "utf8");

const data = fs.readFileSync("./data.json", "utf8");

const encryptData = crypto.publicEncrypt(
  {
    key: public,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  Buffer.from(JSON.stringify(data))
);

console.log("Encrypted Data: ", encryptData.toString("base64"));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3005, () => console.log("Starting server on port 3005"));
