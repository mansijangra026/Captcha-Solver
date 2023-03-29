const express = require("express");

const app = express();

const path = require("path");

const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({ extended: false }));

const fs = require("fs");

const decodebase64toimage = require("node-base64-url").decode;

const imageToBase64 = require("url-to-base64");

app.use(bodyparser.json());

const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage }).single("file");

app.post("/encode", (req, res) => {
  // upload the file

  output = Date.now() + "output.txt";

  upload(req, res, (err) => {
    if (err) {
      console.log("some error occured in uploading the file");
      return;
    } else {
      console.log(req.file.path);

      // encode to base64

      imageToBase64(req.file.path) // Path to the image
        .then((response) => {
          console.log(response); // "cGF0aC90by9maWxlLmpwZw=="

          fs.writeFileSync(output, response);

          res.download(output, () => {
            console.log("file is downloaded");
          });
        })
        .catch((error) => {
          console.log(error); // Logs an error if there was one
        });
    }
  });
});

app.post("/decode", async (req, res) => {
  output = Date.now() + "output";
  upload(req, res, async (err) => {
    if (err) {
      console.log("error takes place");
      return;
    } else {
      console.log(req.file.path);

      const base64code = fs.readFileSync(req.file.path, "utf8");

      console.log(base64code);

      await decodebase64toimage(base64code, { fname: output, ext: "jpg" });

      res.download(output + ".jpg", () => {
        console.log("file is downloaded");
      });
    }
  });
});

const port = 5000;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log("App is listening on port 5500");
});
