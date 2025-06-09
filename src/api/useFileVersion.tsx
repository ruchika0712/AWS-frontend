const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const versionDir = path.join(__dirname, "versions");

// Create version directory if not exists
if (!fs.existsSync(versionDir)) {
    fs.mkdirSync(versionDir, { recursive: true });
}

// Fetch version history
router.get("/versions/:fileId", (req, res) => {
    const { fileId } = req.params;
    const dirPath = path.join(versionDir, fileId);

    if (!fs.existsSync(dirPath)) {
        return res.json([]);
    }

    const versions = fs.readdirSync(dirPath)
        .filter(file => file.endsWith(".json"))
        .map(file => {
            const filePath = path.join(dirPath, file);
            return JSON.parse(fs.readFileSync(filePath, "utf8"));
        });

    res.json(versions);
});

// Add a new version
router.post("/versions/:fileId", (req, res) => {
    const { fileId } = req.params;
    const versionData = req.body;

    const dirPath = path.join(versionDir, fileId);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const versionNumber = fs.readdirSync(dirPath).length + 1;
    const filePath = path.join(dirPath, `version${versionNumber}.json`);
    versionData.versionNumber = versionNumber;
    versionData.timestamp = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(versionData, null, 2));

    const changelogPath = path.join(dirPath, "changelog.txt");
    const logEntry = `Version ${versionNumber}: ${versionData.changeSummary} (by ${versionData.changedBy} at ${versionData.timestamp})\n`;
    fs.appendFileSync(changelogPath, logEntry);

    res.status(200).send("Version added successfully");
});

// Export changelog
router.get("/export/:fileId", (req, res) => {
    const { fileId } = req.params;
    const changelogPath = path.join(versionDir, fileId, "changelog.txt");

    if (!fs.existsSync(changelogPath)) {
        return res.status(404).send("Changelog not found");
    }

    res.setHeader("Content-Disposition", `attachment; filename=${fileId}-changelog.txt`);
    res.setHeader("Content-Type", "text/plain");
    res.send(fs.readFileSync(changelogPath, "utf8"));
});

module.exports = router;
