const express = require("express");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const ShortURL = require("./models/shorturl");

const connection = require("./config/db.config");
connection.once("open", () => console.log("DB Connected"));
connection.on("error", () => console.log("DB Error"));

const app = express();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL;

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("short"));

app.use(express.static(path.resolve(__dirname, "static")));

app.use(express.json());

app.post("/shorten", async (req, res) => {
    let url = await ShortURL.findOne({ origUrl: req.body.url });
    if (url) {
        res.json(url);
    } else {
        const { nanoid } = await import("nanoid");
        let urlId = nanoid(10);
        url = new ShortURL({
            urlId,
            origUrl: req.body.url,
            shortUrl: `${BASE_URL}/` + urlId,
        });
        await url.save();
        res.json(url);
    }
});

app.get("(/:urlId|/)", async (req, res) => {
    if (req.params.urlId) {
        let url = await ShortURL.findOne({ urlId: req.params.urlId });
        if (url) {
            res.redirect(url.origUrl);
        } else {
            res.redirect("/");
        }
    } else {
        res.render("index");
    }
});

app.listen(PORT, () => console.log(`Express app listening on port ${PORT}`));
