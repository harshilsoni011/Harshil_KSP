import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { kspAPI } from "../../utils/api";
import { useAppDispatch } from "../../store/hooks";
import { loginThunk } from "../../store/authSlice";
import { VALIDATION_MESSAGES, REGEX_PATTERNS, API_MESSAGES } from "../../utils/constants";
import { toast } from "react-toastify";

const KspRegister = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value) {
          error = VALIDATION_MESSAGES.NAME_REQUIRED;
        }
        break;
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
        } else if (value.length < 6) {
          error = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
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
    setError("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate all fields
    const newErrors = {
      name: validateField("name", form.name),
      email: validateField("email", form.email),
      password: validateField("password", form.password),
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (newErrors.name || newErrors.email || newErrors.password) {
      return;
    }
    
    setLoading(true);
    try {
      await kspAPI.register(form);
      toast.success(API_MESSAGES.SUCCESS.REGISTER);
      await dispatch(
        loginThunk({ credentials: { email: form.email, password: form.password } }),
      );
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.error || API_MESSAGES.ERROR.REGISTER_FAILED;
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
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
                  <i className="fas fa-user-plus" />
                  <h3 className="fw-bold mt-3">Create Account</h3>
                  <p className="text-muted">Join and start sharing knowledge</p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
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
                    {loading ? "Creating account..." : "Register"}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Already have an account? <Link to="/login">Login</Link>
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

export default KspRegister;

