import { useState, useEffect } from "react";
import { faUser } from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    passowrd: "",
    password2: "",
  });

  const { name, email, passowrd, password2 } = formData;

  const onChange = () => {};

  return (
    <>
      <section className="heading">
        <h1>
          <faUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section>
        <form className="form">
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={name}
            placeholder="Enter you name"
            onChange={onChange}
          />
        </form>
      </section>
    </>
  );
}

export default Register;
