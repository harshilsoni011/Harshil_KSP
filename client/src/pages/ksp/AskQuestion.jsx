import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { kspAPI } from "../../utils/api";
import { VALIDATION_MESSAGES, API_MESSAGES } from "../../utils/constants";
import { toast } from "react-toastify";

const AskQuestion = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    body: "",
  });

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (!value) {
          error = VALIDATION_MESSAGES.TITLE_REQUIRED;
        }
        break;
      case "body":
        if (!value) {
          error = VALIDATION_MESSAGES.BODY_REQUIRED;
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
    if (errors.body) {
      setErrors((prev) => ({ ...prev, body: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors = {
      title: validateField("title", title),
      body: validateField("body", body),
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (newErrors.title || newErrors.body) {
      return;
    }
    
    setLoading(true);
    try {
      const tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await kspAPI.createQuestion({ title, body, tags: tagArray });
      toast.success(API_MESSAGES.SUCCESS.QUESTION_CREATED);
      navigate(`/question/${res.data.question._id}`);
    } catch (err) {
      const message = err.response?.data?.error || API_MESSAGES.ERROR.QUESTION_FAILED;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="ask-question-header">
        <h2>
          <i className="bi bi-question-circle-fill me-2" />
          Ask a Question
        </h2>
        <p className="text-muted">Share your knowledge and get answers from the community</p>
      </div>
      <div className="card ask-question-card">
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="form-label fw-semibold">
                <i className="bi bi-type me-2" />
                Question Title
              </label>
              <input
                name="title"
                className={`form-control form-control-lg ${errors.title ? "is-invalid" : ""}`}
                placeholder="Your Question ?"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleBlur}
              />
              {errors.title && (
                <div className="invalid-feedback">{errors.title}</div>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">
                <i className="bi bi-card-text me-2" />
                Question Body
              </label>
              <textarea
                name="body"
                className={`form-control ${errors.body ? "is-invalid" : ""}`}
                rows={8}
                placeholder="Describe question in detail"
                value={body}
                onChange={handleBodyChange}
                onBlur={handleBlur}
              />
              {errors.body && (
                <div className="invalid-feedback">{errors.body}</div>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">
                <i className="bi bi-tags-fill me-2" />
                Tags
              </label>
              <input
                className="form-control"
                placeholder="react, javascript, debouncing (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Posting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle-fill me-2" />
                    Post Question
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;

