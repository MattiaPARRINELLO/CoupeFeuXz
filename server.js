const print = (msg) => {
  console.log(msg);
};
const format = (msg) => {
  let date = new Date();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let time = `[${hour}:${minute}:${second}]`;
  return time + msg.toString().replace(/\n/g, "\\n");
};

const express = require("express");
print(format("Express loaded"));
const app = express();
print(format("Express app created"));
const multer = require("multer");
print(format("Multer loaded"));
const path = require("path");
print(format("Path loaded"));
const port = 80;
print(format("Setting up server on port " + port));
const fs = require("fs");
print(format("FS loaded"));
const bodyParser = require("body-parser");
const { Console } = require("console");
print(format("Body parser loaded"));

let storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (_req, file, cb) {
    cb(null, file.fieldname + path.extname(file.originalname));
  },
});
print(format("Storage loaded"));

let upload = multer({
  storage: storage,
});
print(format("Upload loaded"));

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
print(format("Multiple loaded"));

app.set("view engine", "ejs");
print(format("EJS loaded"));
app.set("trust proxy", true);
print(format("Trust proxy loaded"));

app.use(express.static("public"));
print(format("Static files loaded"));
app.use(bodyParser.urlencoded({ extended: false }));
print(format("Body parser loaded"));

app.get("/", (_req, res) => {
  res.render("home");
  print(format("Home page loaded"));
});

app.get("/liste", (_req, res) => {
  print(format("Loading list page"));
  fs.readFile("json/prods.json", "utf8", function (err, data) {
    if (err) throw err;
    print(format("File read"));
    let json = JSON.parse(data);
    res.render("list", {
      name: json,
    });
    print(format("List page loaded"));
  });
});

app.get("/more", (req, res) => {
  print(format("Loading more page"));
  fs.readFile("json/prods.json", "utf8", function (err, data) {
    print(format("File read"));
    if (err) throw err;
    let json = JSON.parse(data);
    let input = req.query.t;
    for (const element of json) {
      if (element.name == input) {
        res.render("more", {
          prod: element,
        });
        print(format("More page loaded"));
      }
    }
  });
});

app.get("/download", (req, res) => {
  print(format("Loading download page"));
  let input = req.query.input;
  fs.readFile("json/prods.json", "utf8", function (err, data) {
    print(format("File read"));
    if (err) throw err;
    let json = JSON.parse(data);
    for (const element of json) {
      if (element.code == input) {
        const file = `./prod/` + element.name + element.extensionTag;
        res.download(file);
        print(format("File downloaded"));
      }
    }
  });
});

app.get("/login", (_req, res) => {
  res.render("login");
  print(format("Login page loaded"));
});

app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username == "admin" && password == "CoupeFeuXz") {
    res.render("admin");
    print(format("Logged in"));
  } else {
    res.redirect("/login");
    print(
      format("Login failed. Username :" + username + " Password :" + password)
    );
  }
});

app.post("/uploadFile", multiple, (req, res) => {
  if (req.files) {
    print(format("Uploading file"));

    fs.readFile("json/prods.json", "utf8", function (err, data) {
      if (err) throw err;
      print(format("File read"));
      const title = req.body.title;
      const description = req.body.description;
      const prix = req.body.price;
      const code = req.body.code;

      const infos = {
        name: title,
        description: description,
        price: prix,
        code: code,
        extensionTag: path.extname(req.files.withTag[0].originalname),
        extensionNoTag: path.extname(req.files.withoutTag[0].originalname),
      };

      let json = JSON.parse(data);
      json.push(infos);
      fs.writeFile("json/prods.json", JSON.stringify(json), (err) => {
        if (err) throw err;
      });
      print(format("File written"));
      fs.rename(
        "public/uploads/withoutTag" +
          path.extname(req.files.withoutTag[0].originalname),
        "prod/" + title + path.extname(req.files.withoutTag[0].originalname),
        function (err) {
          if (err) throw err;
        }
      );
      print(format("File renamed"));

      fs.rename(
        "public/uploads/withTag" +
          path.extname(req.files.withTag[0].originalname),
        "prod-test/" + title + path.extname(req.files.withTag[0].originalname),
        function (err) {
          if (err) throw err;
        }
      );
      print(format("File renamed"));
      res.redirect("/");
      print(format("File uploaded"));
    });
  }
});

app.get("/downloadTest", (req, res) => {
  print(format("Loading downloadTest page"));
  let input = req.query.n;
  console.log(input);
  fs.readFile("json/prods.json", "utf8", function (err, data) {
    print(format("File read"));
    if (err) throw err;
    let json = JSON.parse(data);
    for (const element of json) {
      if (element.name == input) {
        const file = `./prod-test/` + element.name + element.extensionTag;
        res.download(file);
        print(format("File downloaded"));
      }
    }
  });
});

app.listen(port, () => {
  print(format(`Server is running on port ${port}`));
});
