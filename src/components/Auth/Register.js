// src/components/Auth/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost/ims/endpoints/auth/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server error.");
    }
  };

  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-lg-5 d-none d-lg-block bg-register-image">
                 <img 
    src="/assets/img/register.jpg" 
    alt="Register" 
    className="img-fluid h-100 w-100" 
    style={{ objectFit: "cover" }} 
  />
            </div>
            <div className="col-lg-7">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                </div>
                <form className="user" onSubmit={handleSubmit}>
                  <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                      <input
                        type="text"
                        name="firstName"
                        className="form-control form-control-user"
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        name="lastName"
                        className="form-control form-control-user"
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-user"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                      <input
                        type="password"
                        name="password"
                        className="form-control form-control-user"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="password"
                        name="repeatPassword"
                        className="form-control form-control-user"
                        placeholder="Repeat Password"
                        value={form.repeatPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-user btn-block">
                    Register Account
                  </button>
                  {error && <p className="text-danger mt-2">{error}</p>}
                </form>
                <hr />
                <div className="text-center">
                  <Link className="small" to="/login">
                    Already have an account? Login!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
