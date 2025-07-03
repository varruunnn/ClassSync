import mongoose from "mongoose";
import dotenv from "dotenv";
import ClassSubjects from "../models/ClassSubjects.js";

dotenv.config();

const data = [
  {
    className: "10",
    subjects: [
      {
        name: "Mathematics",
        syllabusPdfUrl:
          "https://cbseacademic.nic.in/web_material/CurriculumMain25/Sec/Maths_Sec_2024-25.pdf",
      },
      {
        name: "Science",
        syllabusPdfUrl:
          "https://cbseacademic.nic.in/web_material/CurriculumMain25/Sec/Science_Sec_2024-25.pdf",
      },
      {
        name: "Social Science",
        syllabusPdfUrl:
          "https://cbseacademic.nic.in/web_material/CurriculumMain25/Sec/Social_Science_Sec_2024-25.pdf",
      },
      {
        name: "English",
        syllabusPdfUrl:
          "https://cbseacademic.nic.in/web_material/CurriculumMain25/Sec/English_LL_2024-25.pdf",
      },
      {
        name: "Hindi",
        syllabusPdfUrl:
          "https://edustud.nic.in/edu/SYLLABUS_2024_25/10/10_hindi_hindi_2024_25.pdf",
      },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    await ClassSubjects.deleteMany();
    console.log("Old ClassSubjects cleared");
    await ClassSubjects.insertMany(data);
    console.log("ClassSubjects seeded");
    mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
