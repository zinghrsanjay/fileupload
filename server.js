const { json } = require("express");
const express = require("express");
const fileUpload = require("express-fileupload");
// const bodyParser = require("body-parser");
// const cors = require("cors");
//var route = express.Router();
var fs = require("fs");

const app = express();

app.use(fileUpload());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/api/test", (req, res) => {
  res.send("hello");
});
// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  const file = req.files.file;
  console.log(req.files);
  file.mv(`${__dirname}/client/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json({
      fileName: file.name,
      filePath: `/uploads/${file.name}`,
    });
  });
});

app.get("/api/updateJson", (req, res) => {
  const _Name = req.query.filename;
  const _country = req.query.country;

  console.log(_Name);
  console.log(_country);

  fs.readFile(`${__dirname}/client/src/data/data.json`, function (err, data) {
    // console.log(JSON.parse(data));
    var countryCount = JSON.parse(data).countries.length;

    var arrayOfObjects = JSON.parse(data);
    arrayOfObjects.countries.push({
      name: _country,
      continent: "Asia",
      flag: "uploads/" + _Name,
      rank: (countryCount += 1),
    });

    fs.writeFileSync(
      `${__dirname}/client/src/data/data.json`,
      JSON.stringify(arrayOfObjects, null, 2),
      "utf-8",
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    res.json({
      fileName: "success",
    });
  });
});

app.listen(5000, () => console.log("Server Started..."));
