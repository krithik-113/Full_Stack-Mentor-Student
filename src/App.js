import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, Route, Routes } from "react-router-dom";
import Mentor from "./components/Mentor";
import Student from "./components/Student";
import MentorCreate from "./components/MentorCreate";
import StudentCreate from "./components/StudentCreate";

function App() {
  const nav_barRef  = useRef()
  const nav_bar_stu = useRef()
  const Student_Active = useRef()
  const student_c_Active = useRef()
  let [mentor, setMentor] = useState("");
  let [student, setStudent] = useState("");
  const API_URL_mentor = "https://mentor-student-fullstack.netlify.app/mentor";
  const API_URL_student = "https://mentor-student-fullstack.netlify.app/student";
  useEffect(() => {
    axios
      .get(API_URL_mentor)
      .then((response) => response.data)
      .then((result) => setMentor(result.mentors))
      .catch((err) => console.log(err));

    axios
      .get(API_URL_student)
      .then((response) => response.data)
      .then((result) => setStudent(result.students))
      .catch((err) => console.log(err));
  }, []);

  // changing class name
  function handleActiveDesign() {
    student_c_Active.current.classList.remove("active");
    Student_Active.current.classList.remove("active");
    nav_bar_stu.current.classList.remove("active");
    nav_barRef.current.classList.add("active");
  }
  // changing class name
  function handleActiveAnoDesign() {
    student_c_Active.current.classList.remove("active");
    Student_Active.current.classList.remove("active");
    nav_barRef.current.classList.remove("active");
    nav_bar_stu.current.classList.add("active");
  }
  function handleStudent() {
    student_c_Active.current.classList.remove("active");
    nav_bar_stu.current.classList.remove("active");
    nav_barRef.current.classList.remove("active");
    Student_Active.current.classList.add("active");
  }
  function studentCreateRecord() {
    nav_barRef.current.classList.remove("active");
    nav_bar_stu.current.classList.remove("active");
    Student_Active.current.classList.remove("active");
    student_c_Active.current.classList.add('active');
  }

  return (
    <div className="App">
      <header>
        <nav
          id="sidebarMenu"
          className="collapse d-lg-block sidebar collapse bg-white"
        >
          <div className="position-sticky">
            <div className="list-group list-group-flush mx-3 mt-4">
              <div
                id="nav"
                className="list-group-item list-group-item-action py-2 ripple"
                aria-current="true"
              >
                <span>Main dashboard</span>
              </div>
              <Link to="/" style={{ textDecoration: "none" }}>
                <div
                  ref={nav_barRef}
                  onClick={handleActiveDesign}
                  className="list-group-item list-group-item-action py-2 ripple active"
                >
                  <span>Mentor</span>
                </div>
              </Link>

              <Link to="/mentor/create" style={{ textDecoration: "none" }}>
                <div
                  ref={nav_bar_stu}
                  onClick={handleActiveAnoDesign}
                  className="list-group-item list-group-item-action py-2 ripple"
                >
                  <span>Create Mentor</span>
                </div>
              </Link>
              <Link to="/student" style={{ textDecoration: "none" }}>
                <div
                  ref={Student_Active}
                  onClick={handleStudent}
                  className="list-group-item list-group-item-action py-2 ripple"
                >
                  <span>Student</span>
                </div>
              </Link>

              <Link to="/student/create" style={{ textDecoration: "none" }}>
                <div
                  ref={student_c_Active}
                  onClick={studentCreateRecord}
                  className="list-group-item list-group-item-action py-2 ripple"
                >
                  <span>Create Student</span>
                </div>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Mentor mentor={mentor} student={student} setMentor={ setMentor} setStudent={setStudent} />} />
        <Route path="/mentor/create" element={<MentorCreate />} />
        <Route
          path="/student"
          element={<Student student={student} setStudent={setStudent} mentor={ mentor} setMentor={ setMentor}/>}
        />
        <Route path="/student/create" element={<StudentCreate />} />
      </Routes>
    </div>
  );
}

export default App;
