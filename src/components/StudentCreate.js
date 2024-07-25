import React from 'react'
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

const validate = (values) => {
  const errors = {};
  if (values.name === "") {
    errors.name = "*Required";
  } else if (values.name.length <= 3) {
    errors.name = "Username must be atleast 3 characters";
  } else if (values.email === "") {
    errors.email = "*Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  } 
  return errors;
};
const StudentCreate = () => {
   const navigate = useNavigate();

   const formik = useFormik({
     initialValues: {
       name: "",
       email: ""
     },
     validate,
     onSubmit: (values, { resetForm }) => {
       axios.post(
         "https://full-stack-mentor-student-1.onrender.com/student/create",
         {
           name: values.name,
           email: values.email,
         }
       );
       resetForm();
       alert("Added new record");
       navigate("/student");
       window.location.reload();
     },
   });

   return (
     <div className="container">
       <form>
         <div className="mb-3">
           <label htmlFor="formGroupExampleInput" className="form-label">
             Student name
           </label>
           <input
             type="text"
             className="form-control"
             id="name"
             name="name"
             placeholder="ex: Krithik Roshan"
             value={formik.values.name}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
           />
           <p style={{ color: "red" }}>{formik.errors.name}</p>
         </div>
         <div className="mb-3">
           <label htmlFor="formGroupExampleInput2" className="form-label">
             Student email
           </label>
           <input
             name="email"
             type="email"
             className="form-control"
             id="email"
             placeholder="name@student.com"
             value={formik.values.email}
             onChange={formik.handleChange}
             onBlur={formik.handleBlur}
           />
           <p style={{ color: "red" }}>{formik.errors.email}</p>
         </div>
         <div className="col-12">
           <button
             type="button"
             className="btn btn-primary"
             onClick={formik.handleSubmit}
           >
             ADD
           </button>
         </div>
       </form>
     </div>
   );
}

export default StudentCreate