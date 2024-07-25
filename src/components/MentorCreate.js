import axios from 'axios'
import { useFormik } from 'formik'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const validate = values => {
    const errors = {}
    if (values.name === '') {
        errors.name = "*Required"
    } else if (values.name.length <= 3) {
        errors.name = "Username must be atleast 3 characters"
    } else if (values.email === '') {
        errors.email = "*Required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address";
    } else if (values.course === '') {
        errors.course = "*Required"
    }
    return errors
}

const MentorCreate = () => {

    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            course:''
        },
        validate,
        onSubmit: (values, {resetForm}) => {
            axios.post(
              "https://full-stack-mentor-student-1.onrender.com/mentor/create",
              {
                name: values.name,
                email: values.email,
                course: values.course,
              }
            );
            resetForm()
            alert("Added new record");
            navigate('/')
            window.location.reload()
        }
    })

  return (
    <div className="container">
      <form>
        <div className="mb-3">
          <label htmlFor="formGroupExampleInput" className="form-label">
            Mentor name
          </label>
          <input
            type="text"
            className="form-control"
                      id="name"
                      name='name'
            placeholder="ex: Krithik Roshan"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <p style={{ color: "red" }}>{formik.errors.name}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="formGroupExampleInput2" className="form-label">
            Mentor email
          </label>
                  <input
                      name='email'
            type="email"
            className="form-control"
            id="email"
            placeholder="name@mentor.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <p style={{ color: "red" }}>{formik.errors.email}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="formGroupExampleInput2" className="form-label">
            Course
          </label>
          <input
            type="text"
            className="form-control"
                      id="course"
                      name='course'
            placeholder="ex : C++,Java,Python,Full Stack and more..."
            value={formik.values.course}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <p style={{ color: "red" }}>{formik.errors.course}</p>
        </div>
        <div className="col-12">
          <button
            type="button"
            className="btn btn-primary"
            onClick={formik.handleSubmit}>
            ADD
          </button>
        </div>
      </form>
    </div>
  );
}

export default MentorCreate