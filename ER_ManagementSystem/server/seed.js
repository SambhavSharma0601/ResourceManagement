// seed.js to insert users 
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();
const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI;

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteMany();

    const users = [
      {
        userId: 101,
        name: "Sambhav Manager",
        email: "manager@company.com",
        password: await bcrypt.hash("manager123", 10),
        role: "Manager",
      },
      {
        userId: 102,
        name: "John Engineer",
        email: "john.engineer@company.com",
        password: await bcrypt.hash("engineer123", 10),
        role: "Engineer",
      },
      {
        userId: 103,
        name: "Alice Tech",
        email: "alice.tech@company.com",
        password: await bcrypt.hash("alice123", 10),
        role: "Engineer",
      },
      {
        userId: 104,
        name: "Bob Dev",
        email: "bob.dev@company.com",
        password: await bcrypt.hash("bob123", 10),
        role: "Engineer",
      },
      {
        userId: 105,
        name: "Charlie Code",
        email: "charlie.code@company.com",
        password: await bcrypt.hash("charlie123", 10),
        role: "Engineer",
      },
      {
        userId: 106,
        name: "David Build",
        email: "david.build@company.com",
        password: await bcrypt.hash("david123", 10),
        role: "Engineer",
      },
      {
        userId: 107,
        name: "Ella Test",
        email: "ella.test@company.com",
        password: await bcrypt.hash("ella123", 10),
        role: "Engineer",
      },
      {
        userId: 108,
        name: "Frank Design",
        email: "frank.design@company.com",
        password: await bcrypt.hash("frank123", 10),
        role: "Engineer",
      },
      {
        userId: 109,
        name: "Grace DevOps",
        email: "grace.devops@company.com",
        password: await bcrypt.hash("grace123", 10),
        role: "Engineer",
      },
      {
        userId: 110,
        name: "Hannah Backend",
        email: "hannah.backend@company.com",
        password: await bcrypt.hash("hannah123", 10),
        role: "Engineer",
      },
      {
        userId: 111,
        name: "Ian Frontend",
        email: "ian.frontend@company.com",
        password: await bcrypt.hash("ian123", 10),
        role: "Engineer",
      },
    ];

    await User.insertMany(users);
    console.log("✅ Users inserted");
    process.exit();
  } catch (err) {
    console.error("❌ Error inserting users:", err);
    process.exit(1);
  }
};

seedUsers();
