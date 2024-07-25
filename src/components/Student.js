import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Student = ({ student, setStudent, mentor, setMentor }) => {
  const navigate = useNavigate()
  const pop_Div = useRef();
  const [name, setName] = useState("");

  function handleFilter(value) {
    if (value === "2") {
      axios
        .get(
          "https://full-stack-mentor-student-1.onrender.com/student/nomenter"
        )
        .then((response) => response.data)
        .then((res) => {
          setStudent(res.fields);
        })
        .catch((err) => console.log(err));
    } else {
      window.location.reload();
    }
  }
  const [inputName, setInputName] = useState("");

  function handleMentorDetails(name) {
    pop_Div.current.style.display = "block";
    setName(name);
  }
  function handleClose() {
    pop_Div.current.style.display = "none";
  }
  async function handleAdding(stu_name) {
    if (stu_name) {
      try {
        const response = await fetch(
          "https://full-stack-mentor-student-1.onrender.com/mentor"
        );
        const result = await response.json();
        const res = result.mentors.find(
          (val) => val.name == stu_name && val.name
        );
        if (res) {
          axios
            .put(
              `https://full-stack-mentor-student-1.onrender.com/student/add/${name}`,
              {
                mentor: stu_name,
              }
            )
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

  async function handleMentorFilter(ment_name) {
    console.log(ment_name)
    try {
      if (ment_name != "0") {
        const response = await fetch(
          `https://full-stack-mentor-student-1.onrender.com/mentor/${ment_name}`
        );
        const result = await response.json();
        const studentsToShow = [];
        if (result.students.length) {
          for (let i = 0; i < result.students.length; i++) {
            studentsToShow.push(student.find((val) => {
                if (typeof val.name === 'undefined') {
                  window.location.reload()
                } else {
                 return val.name === result.students[i];
                }
              })
            );
          }
           const mentorOptions = [];
          mentorOptions.push(mentor.find((val) => val.name === ment_name));
          console.log(mentorOptions)
           setMentor(mentorOptions);
          setStudent(studentsToShow);
        } else {
          alert(`For ${ment_name} no students has assigned`);
          window.location.reload()
        }
      } else {
       
        window.location.reload();
        
      }
        } catch (err) {
        console.log(err);
      }
    
  }

  return (
    <div className="container">
      <select
        className="custom-select"
        id="vera"
        onChange={(e) => handleFilter(e.target.value)}
      >
        <option value="1">With Mentor's</option>
        <option value="2">Without Mentor's</option>
      </select>

      <label htmlFor="inputGroupSelect01" className="label">
        Select Mentor :
      </label>

      <select
        className="custom-select"
        id="inputGroupSelect01"
        onChange={(e) => handleMentorFilter(e.target.value)}
      >
        <option value="0"> Select... </option>
        {mentor.length &&
          mentor.map((val, index) => {
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
            <th scope="col">Date Created</th>
          </tr>
        </thead>
        <tbody>
          {student.length && student.map((val, index) => {
              return (
                <tr
                  key={index}
                  id="mentor-table"
                  onClick={() => handleMentorDetails(val.name)}
                >
                  <th scope="row">{index + 1}</th>
                  <td>{val.name}</td>
                  <td>{val.email}</td>
                  <td>{val.updatedAt}</td>
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
              placeholder="Mentor name"
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

export default Student