import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginThunk } from "../../store/authSlice";
import { VALIDATION_MESSAGES, REGEX_PATTERNS } from "../../utils/constants";

const KspLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) {
          error = VALIDATION_MESSAGES.EMAIL_REQUIRED;
        } else if (!REGEX_PATTERNS.EMAIL.test(value)) {
          error = VALIDATION_MESSAGES.EMAIL_INVALID;
        }
        break;
      case "password":
        if (!value) {
          error = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      email: validateField("email", form.email),
      password: validateField("password", form.password),
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (newErrors.email || newErrors.password) {
      return;
    }
    
    const result = await dispatch(loginThunk({ credentials: form }));
    if (loginThunk.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card login-card">
              <div className="card-body login-form">
                <div className="login-logo">
                  <i className="fas fa-comments" />
                  <h3 className="fw-bold mt-3">KSP Login</h3>
                  <p className="text-muted">Sign in to ask and answer questions</p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Don&apos;t have an account?{" "}
                    <Link to="/register">Register</Link>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KspLogin;

