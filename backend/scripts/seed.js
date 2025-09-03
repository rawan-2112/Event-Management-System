require("dotenv").config({ path: "./backend/.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("../models/Event");
const User = require("../models/User");

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ DB connected");
}

// backend/scripts/seed.js
async function createUserIfNotExists({ name, email, password, role }) {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email, password, role });
    console.log(`👤 Created ${role}: ${email} / ${password}`);
  } else {
    console.log(`ℹ️ ${role} exists: ${email}`);
  }
  return user;
}


function randomAttendees(n) {
  const names = ["Ali", "Sara", "Omar", "Laila", "Hassan", "Mona", "Youssef", "Noura", "Amr", "Dalia"];
  const cities = ["Cairo", "Alex", "Giza", "Mansoura", "Dubai", "Riyadh"];
  const genders = ["Male", "Female"];
  const ages = () => {
    const buckets = [
      [18, 24],
      [25, 34],
      [35, 44],
      [45, 55],
    ];
    const b = buckets[Math.floor(Math.random() * buckets.length)];
    return Math.floor(Math.random() * (b[1] - b[0] + 1)) + b[0];
  };

  return Array.from({ length: n }).map(() => ({
    name: names[Math.floor(Math.random() * names.length)],
    age: ages(),
    gender: genders[Math.floor(Math.random() * genders.length)],
    city: cities[Math.floor(Math.random() * cities.length)],
  }));
}

async function seed() {
  await connectDB();

  const admin = await createUserIfNotExists({
    name: "Admin",
    email: "admin@example.com",
    password: "Admin123!",
    role: "admin",
  });

  const user = await createUserIfNotExists({
    name: "User",
    email: "user@example.com",
    password: "User123!",
    role: "user",
  });

  // نظف الأحداث القديمة
  await Event.deleteMany({});
  console.log("🧹 Cleared events collection");

  // 3 أحداث مع حضور وسعر ومقاعد
  const eventsData = [
    {
      title: "Music Concert",
      description: "Live concert with top artists.",
      date: new Date("2025-09-10"),
      location: "Cairo",
      price: 300,
      status: "active",
      bannerUrl: "",
      createdBy: admin._id,
      attendees: randomAttendees(120),
    },
    {
      title: "Tech Conference",
      description: "Latest in AI, cloud, and web.",
      date: new Date("2025-10-15"),
      location: "Alex",
      price: 500,
      status: "upcoming",
      bannerUrl: "",
      createdBy: admin._id,
      attendees: randomAttendees(200),
    },
    {
      title: "Startup Meetup",
      description: "Networking for founders & VCs.",
      date: new Date("2025-11-05"),
      location: "Dubai",
      price: 450,
      status: "upcoming",
      bannerUrl: "",
      createdBy: admin._id,
      attendees: randomAttendees(80),
    },
  ];

  // أضف المقاعد لكل حدث
  for (const ev of eventsData) {
    ev.seats = Event.generateSeatMap(6, 10); // 6 صفوف × 10 مقاعد
  }

  await Event.insertMany(eventsData);
  console.log("🎉 Inserted sample events with attendees & seats");

  await mongoose.disconnect();
  console.log("🔌 DB disconnected");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
