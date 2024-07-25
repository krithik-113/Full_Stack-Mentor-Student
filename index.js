const mongoose = require("mongoose");
const { mentorModule, studentModule } = require("./module&Schema/data");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose_connect_mongoDB().catch((err) => console.log);
async function mongoose_connect_mongoDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/mentorAndStudentDB");
    console.log("database connected successfully");
  } catch (err) {
    console.log(err);
  }
}
// http://localhost:3500/mentor
app.get("/mentor", async (req, res) => {
  const mentor = await mentorModule.find();
  res.json({
    mentors: mentor,
  });
});

// http://localhost:3500/student
app.get("/student", async (req, res) => {
  const student = await studentModule.find();
  res.json({
    students: student,
  });
});

// http://localhost:3500/mentor/create
app.post("/mentor/create", async (req, res) => {
  const mentor = new mentorModule(req.body);
  console.log(mentor);
  try {
    const response = await mentorModule.create(mentor);
    return res.json({
      message: "added successfully",
      fields: response,
    });
  } catch (err) {
    console.log(err.message);
  }

  return res.json({
    message: "Enter the fields in given format",
    fields: {
      name: "mandatory",
      email: "mandatory",
      course: "mandatory",
      mentee: ["optional"],
    },
  });
});
// http://localhost:3500/student/create
app.post("/student/create", async (req, res) => {
  const student = await new studentModule(req.body);
  console.log(student);
  if (student) {
    try {
      const response = await studentModule.create(student);
      return res.json({
        message: "added successfully",
        fields: response,
      });
    } catch (err) {
      console.log(err);
    }

    return res.json({
      message: "Enter the fields in given format",
      fields: {
        name: "mandatory",
        email: "mandatory",
        mentor: ["optional"],
      },
    });
  }
});
// http://localhost:3500/mentor/add/:name
app.put("/mentor/add/:name", async (req, res) => {
  const { name } = req.params
  try {
    const mentor = await mentorModule.find({ name: name })
    if (!mentor.length) {
      return res.json({
        message: "Mentor has not found",
        mentorName:name
      })
    }
    const students = await studentModule.find({ name: req.body.student })
    if(!students.length){
    return  res.json({
        message: "Student has not found",
        studentName:req.body.student
      })
    }
     await mentorModule.updateMany(
        { name: name },
        { $push: { mentee: req.body.student} }
    );
    await studentModule.updateMany({ name: req.body.student },
      {$push:{mentor:name}}
    )
      return res.json({
        message: "mentor has updated successfully",
        updatedMentorName: name,
      });
    } catch (err) {
     return res.json({
        message: "mentor has not found",
        error:err.message
      })
    }
  })

// http://localhost:3500/mentor/:name
app.get("/mentor/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const mentor = await mentorModule.find(
      { name: name },
      { _id: 0, mentee: 1 }
    );
    return res.json({
      message: "students of given mentor",
      mentorName: name,
      students: mentor[0].mentee,
    });
  } catch (err) {
    console.log(err.message);
  }

  res.json({
    message: "students in requested mentor",
    mentor: name,
  });
});

// http://localhost:3500/student/nomenter
app.get("/student/nomenter", async (req, res) => {
  let student = await studentModule.find();
  const studs = []
  student.forEach((val) => {
    if (!val.mentor.length) {
      studs.push(val);
    }
  });
  res.json({
    message: "Student without mentor",
    fields: studs,
  });
});

// http://localhost:3500/student/add/:name
app.put("/student/add/:name", async (req, res) => {
  const { name } = req.params;
  const student = await studentModule.find({ name: name });
  try {
    await studentModule.updateMany(
      { name: name },
      { $push: { mentor: req.body.mentor } }
    );
    await mentorModule.updateMany(
      { name: req.body.mentor },
      { $push: { mentee: name } }
    );
    return res.json({
      message: "successfully added mentor to student",
      mentorName: req.body.mentor,
    });
  } catch (err) {
    console.log(err);
  }

  res.json({
    fields: student,
  });
});

// http://localhost:3500/pre/:name
app.get("/pre/:name", async (req, res) => {
  const { name } = req.params;
  let student = await studentModule.find({ name: name }, { _id: 0, mentor: 1 });
  student = student[0].mentor.slice(0, student[0].mentor.length - 1);
  console.log(student)
  if (student.length) {
    return res.json({
      message: "requested student previous mentor's of given student",
      studentName: name,
      mentors: student,
    });
  }
  res.json({
    message: "To find a previos mentors of a given student",
  });
});

// delete
// http://localhost:3500/mentor/del/:name
app.delete("/mentor/del/:name", async (req, res) => {
  const { name } = req.params;
  try {
    await mentorModule.deleteMany({ name: name });
    return res.json({
      message: "successfully deleted mentor record",
      deletedMentorName: name,
    });
  } catch (err) {
    console.log(err.message);
  }
  res.json({
    message: "Enter a mentor name to delete",
  });
});

// http://localhost:3500/student/del/:name
app.delete("/student/del/:name", async (req, res) => {
  const { name } = req.params;
  try {
    await studentModule.deleteMany({ name: name });
    return res.json({
      message: "successfully deleted mentor record",
      deletedMentorName: name,
    });
  } catch (err) {
    console.log(err.message);
  }
  res.json({
    message: "Enter a mentor name to delete",
  });
});

app.listen(3500, () => {
  console.log("server is running in port 3500");
});
