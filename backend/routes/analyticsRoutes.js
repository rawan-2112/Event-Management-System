const express = require("express");
const Ticket = require("../models/Ticket");
const { protect, authorize } = require("../middleware/auth");
const { Parser } = require("json2csv"); 
const PDFDocument = require("pdfkit"); 

const router = express.Router();


router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("user");

    const ageGroups = { "18-25": 0, "26-35": 0, "36-50": 0, "50+": 0 };
    const gender = { Male: 0, Female: 0 };
    const interests = {};
    const locations = {};

    tickets.forEach(t => {
      const user = t.user;
      if (!user) return;


      const age = user.age || 0;
      if (age <= 25) ageGroups["18-25"]++;
      else if (age <= 35) ageGroups["26-35"]++;
      else if (age <= 50) ageGroups["36-50"]++;
      else ageGroups["50+"]++;

      if (user.gender === "Male") gender.Male++;
      if (user.gender === "Female") gender.Female++;

      if (user.interests) {
        user.interests.forEach(i => {
          interests[i] = (interests[i] || 0) + 1;
        });
      }

      if (user.location) locations[user.location] = (locations[user.location] || 0) + 1;
    });

    res.json({ ageGroups, gender, interests, locations });
  } catch (err) {
    console.error("❌ Analytics error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


router.get("/download/csv", protect, authorize("admin"), async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("user", "name email age gender location interests");
    const data = tickets.map(t => ({
      Event: t.event?.title || "Unknown",
      User: t.user?.name || "N/A",
      Email: t.user?.email || "N/A",
      Age: t.user?.age || "N/A",
      Gender: t.user?.gender || "N/A",
      Location: t.user?.location || "N/A",
      Interests: t.user?.interests?.join(", ") || "N/A",
      Seat: t.seatNumber
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("analytics_report.csv");
    return res.send(csv);
  } catch (err) {
    console.error("CSV error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


router.get("/download/pdf", protect, authorize("admin"), async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("user", "name email age gender location interests");

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=analytics_report.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("📊 Analytics Report", { align: "center" });
    doc.moveDown();

    tickets.forEach((t, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${t.user?.name || "N/A"} (${t.user?.email || "N/A"}) | Age: ${t.user?.age || "-"} | Gender: ${t.user?.gender || "-"} | Location: ${t.user?.location || "-"}`
      );
    });

    doc.end();
  } catch (err) {
    console.error("PDF error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
