const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const port = 80;
const fs = require("fs");
const bodyParser = require("body-parser");

const print = (msg) => {
  console.log(format(msg));
};
const format = (msg) => {
  //date format
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  let time = `[${hour}:${minute}:${second}]`;
  return time + msg.toString().replace(/\n/g, "\\n");
};
let storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (_req, file, cb) {
    cb(null, file.fieldname + path.extname(file.originalname));
  },
});

let upload = multer({
  storage: storage,
});

let multiple = upload.fields([
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

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.render("home");
});

app.get("/liste", (_req, res) => {
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
    res.send("files uploaded");

    fs.readFile("json/prods.json", "utf8", function (err, data) {
      if (err) throw err;

      let title = req.body.title;
      let description = req.body.description;
      let prix = req.body.price;
      let code = req.body.code;

      let infos = {
        name: title,
        description: description,
        price: prix,
        code: code,
        extensionTag: path.extname(req.files.withTag[0].originalname),
        extensionNoTag: path.extname(req.files.withoutTag[0].originalname),
      };

      let json = JSON.parse(data);
      json.push(infos, (err) => {
        if (err) throw err;
      });
      fs.writeFile(
        "json/prods.json",
        JSON.stringify(json, "\t"),
        { encoding: "utf-8" },
        (err) => {
          if (err) throw err;
        }
      );

      fs.rename(
        "public/uploads/withoutTag" +
          path.extname(req.files.withoutTag[0].originalname),
        "prod/" + title + path.extname(req.files.withoutTag[0].originalname),
        function (err) {
          if (err) throw err;
        },

        fs.rename(
          "public/uploads/withTag" +
            path.extname(req.files.withTag[0].originalname),
          "prod-test/" +
            title +
            path.extname(req.files.withTag[0].originalname),
          function (err) {
            if (err) throw err;
          }
        )
      );
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
