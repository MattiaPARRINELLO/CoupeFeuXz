const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const port = 3000;
const fs = require("fs");
const bodyParser = require("body-parser");
const morgan = require("morgan");

let accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
let storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (_req, file, cb) {
    cb(null, file.fieldName + path.extname(file.originalName));
  },
});

const upload = multer({
  storage: storage,
});
const multiple = upload.fields([
  {
    name: "withTag",
    maxCount: 1,
  },
  {
    name: "withoutTag",
    maxCount: 1,
  },
]);

app.set("view engine", "ejs");
app.set("trust proxy", true);
app.use(
  morgan("dev", {
    stream: accessLogStream,
  })
);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.render("home");
});

app.get("/admin", (_req, res) => {
  res.render("admin");
});

app.get("list", (_req, res) => {
  fs.readFile("json/prods.json", "utf8", function (err, data) {
    if (err) throw err;
    let json = JSON.parse(data);
    res.render("list", {
      name: json,
    });
  });
});

app.get("/more", (req, res) => {
  fs.readFile("json/prods.json", "utf8", function (err, data) {
    if (err) throw err;
    let json = JSON.parse(data);
    let input = req.query.t;
    for (const element of json) {
      if (element.name == input) {
        res.render("more", {
          prod: element,
        });
      }
    }
  });
});

app.get("/download", (req, res) => {
  let input = req.query.input;
  fs.readFile("json/prods.json", "utf8", function (err, data) {
    if (err) throw err;
    let json = JSON.parse(data);
    for (const element of json) {
      if (element.code == input) {
        console.log(element.name);
        const file = `./prod/` + element.name + element.extensionTag;
        res.download(file);
      }
    }
  });
});

app.get("/login", (_req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  console.log(req);
  let username = req.body.username;
  let password = req.body.password;
  if (username == "admin" && password == "CoupeFeuXz") {
    res.render("admin");
  } else {
    res.redirect("/login");
  }
});

app.post("/uploadFile", multiple, (req, res) => {
  if (req.files) {
    console.log("files uploaded");
    res.send("files uploaded");
    let title = req.body.title;
    let description = req.body.description;
    let prix = req.body.price;
    let code = req.body.code;
    let informations = {
      name: title,
      description: description,
      price: prix,
      code: code,
      extensionTag: path.extname(req.files.withTag[0].originalName),
      extensionNoTag: path.extname(req.files.withoutTag[0].originalName),
    };
    var data = fs.readFileSync("./json/prods.json");
    var json = JSON.parse(data);
    json.push(informations);
    fs.writeFile(
      "./json/prods.json",
      JSON.stringify(json),
      { encoding: "utf-8" },
      function (err) {
        if (err) throw err;
      }
    );
    fs.rename(
      "./public/uploads/withoutTag" +
        path.extname(req.files.avecTag[0].originalName),
      "./prod/" + title + path.extname(req.files.avecTag[0].originalName),
      function (err) {
        if (err) throw err;
      }
    );
    fs.rename(
      "./public/uploads/withTag" +
        path.extname(req.files.sansTag[0].originalName),
      "./prod-test/" + title + path.extname(req.files.sansTag[0].originalName),
      function (err) {
        if (err) throw err;
      }
    );
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
