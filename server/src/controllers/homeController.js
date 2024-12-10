const express = require("express");
const router = express.Router();
const perfumeManager = require("../managers/perfumeManager");

router.get("/", (req, res) => {
    res.send("Hello world!");
});

router.get("/home", async (req, res) => {
    let perfumes = await perfumeManager.getPerfumes().lean();
    res.send(perfumes);
    return perfumes;
});

router.get("/:perfumeId", async (req, res) => {
    const id = req.params.perfumeId;
    const perfume = await perfumeManager.getOnePerfume(id).lean();
    res.send(perfume);
    return perfume;
});

router.get("/search/:brand", async (req, res) => {
    const brand = req.params.brand;

    const perfumes = await perfumeManager.search(brand);

    res.send(perfumes);
    return perfumes;
});

module.exports = router;
