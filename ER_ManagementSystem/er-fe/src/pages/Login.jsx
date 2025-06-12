import React, { useState } from "react";
import "./Login.css";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";

import { useLoginHook } from "../hooks/useLoginHook"; // update path as per your structure
import {  useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, loading, error } = useLoginHook();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData);

    if (result) {
      // navigate to the dashboard once login is success
      navigate("/dashboard");
    } else {
      console.error("Login failed");
    }
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img
                src="https://media.licdn.com/dms/image/v2/D560BAQGDboRtzGkMrQ/company-logo_200_200/company-logo_200_200/0/1736245737287/geekyants_india_pvt_ltd_logo?e=2147483647&v=beta&t=W7P--dJjo13jV3jkQnft5N7OyyqfSxBZ-f-a0uyy7wU"
                style={{ width: "185px" }}
                alt="logo"
              />
              <h4 className="mt-1 mb-5 pb-1">We are The Geeks</h4>
            </div>

            <p>Please login to your account</p>

            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass="mb-4"
                label="Email address"
                id="form1"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="form2"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />

              {error && <p style={{ color: "red" }}>{error}</p>}

              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn
                  type="submit"
                  className="mb-4 w-100 gradient-custom-2"
                  disabled={loading}>
                  {loading ? "Logging in..." : "Sign in"}
                </MDBBtn>
                <a className="text-muted" href="#!">
                  Forgot password?
                </a>
              </div>
            </form>

          </div>
        </MDBCol>

        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">We are more than just a company</h4>
              <p className="small mb-0">
                For demo purpose use : hannah.backend@company.com , password hannah123 (engineer user)
                <br></br>manager@company.com , password : manager123 (admin/manager role user)
NOTE: If you didn't get redirect after login, manually change the url to /dashboard  --  THIS IS netlify issue or browser specific
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
