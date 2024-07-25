import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Mentor = ({ mentor, student, setMentor, setStudent }) => {
  const navigate = useNavigate();
  const pop_Div = useRef();
  const [name, setName] = useState("");
  const [inputName, setInputName] = useState("");

  function handleMentorDetails(name) {
    pop_Div.current.style.display = "block";
    setName(name);
  }

  function handleClose() {
    pop_Div.current.style.display = "none";
  }

  async function handleSelectedStudent(stu_name) {
    
    try {
      if (stu_name != "0") {
        const response = await fetch(`http://localhost:3500/pre/${stu_name}`);
        const result = await response.json();
        if (typeof result.mentors === "undefined") {
          alert(`No mentors assigned to ${stu_name} `);
          window.location.reload();
        } else {
          const finaleMentors = [];
          for (let i = 0; i < result.mentors.length; i++) {
            finaleMentors.push(
              mentor.find((val) => {
                if (typeof val.name === "undefined") {
                  window.location.reload();
                } else {
                  return val.name === result.mentors[i];
                }
              })
            );
          }
          const students = []
          students.push(student.find(val => val.name == stu_name))
          console.log(students)
          setStudent(students)
          setMentor(finaleMentors);
        }
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleAdding(stu_name) {
    if (stu_name) {
      try {
        const response = await fetch("http://localhost:3500/student");
        const result = await response.json();
        const res = result.students.find(
          (val) => val.name == stu_name && val.name
        );
        if (res) {
          axios
            .put(`http://localhost:3500/mentor/add/${name}`, {
              student: stu_name,
            })
            .then((res) => {
              setInputName("");
              navigate("/");
              alert(`${stu_name} has added to mentee`);
            })
            .catch((err) => console.log(err));
        } else {
          alert(`${stu_name} has not found`);
          setInputName("");
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="container">
      <label htmlFor="inputGroupSelect01">Previous Mentors of Student: </label>
      <select
        onChange={(e) => handleSelectedStudent(e.target.value)}
        className="custom-select"
        id="inputGroupSelect01"
      >
        <option value="0"> Select... </option>
        {student.length &&
          student.map((val, index) => {
            return (
              <option key={index} value={val.name}>
                {val.name}
              </option>
            );
          })}
      </select>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">_id</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Course</th>
          </tr>
        </thead>
        <tbody>
          {mentor.length &&
            mentor.map((val, index) => {
              return (
                <tr
                  id="mentor-table"
                  key={index}
                  onClick={() => handleMentorDetails(val.name)}
                >
                  <th scope="row">{index + 1}</th>
                  <td>{val.name}</td>
                  <td>{val.email}</td>
                  <td>{val.course}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="popup" ref={pop_Div}>
        <div className="container">
          <p>
            Add multiple students to Mentor-
            <span style={{ color: "red", textTransform: "uppercase" }}>
              {name}
            </span>
          </p>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                @
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Student name"
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
            <br />
          </div>
          <p style={{ color: "red" }}>
            {inputName.length ? <></> : <>*Required</>}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleAdding(inputName)}
          >
            ADD
          </button>
          <button
            style={{ marginLeft: "20px" }}
            type="button"
            className="btn btn-danger"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mentor;
