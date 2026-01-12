import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { kspAPI } from "../../utils/api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchSidebarData } from "../../store/commonSlice";

const KspDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await kspAPI.getQuestions({
          search: debounced || undefined,
        });
        setQuestions(res.data.data || []);
      } catch (err) {
        console.error("Failed to load questions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
    dispatch(fetchSidebarData());
  }, [debounced, dispatch]);

  return (
    <div className="container py-4">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">
            <i className="bi bi-house-door-fill me-2" />
            Knowledge Share
          </h2>
          <p className="dashboard-subtitle">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
        <Link to="/ask" className="btn btn-primary btn-ask">
          <i className="bi bi-plus-circle-fill me-2" />
          Ask Question
        </Link>
      </div>

      <div className="card search-card mb-4">
        <div className="card-body">
          <div className="search-input-wrapper">
            <i className="bi bi-search search-icon" />
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search questions by title, body or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-inbox empty-icon" />
          <h4>No questions yet</h4>
          <p className="text-muted">Be the first to ask a question</p>
          <Link to="/ask" className="btn btn-primary">
            <i className="bi bi-plus-circle-fill me-2" />
            Ask Your Question
          </Link>
        </div>
      ) : (
        <div className="questions-list">
          {questions.map((q) => (
            <Link
              key={q._id}
              to={`/question/${q._id}`}
              className="question-card"
            >
              <div className="question-stats">
                <div className="stat-item">
                  <i className="bi bi-hand-thumbs-up-fill text-success" />
                  <span>{q.score || 0}</span>
                  <small>votes</small>
                </div>
              </div>
              <div className="question-content">
                <h5 className="question-title">{q.title}</h5>
                <p className="question-excerpt">{q.body}</p>
                <div className="question-footer">
                  <div className="question-tags">
                    {(q.tags || []).map((t) => (
                      <span key={t} className="tag-badge">
                        <i className="bi bi-tag-fill me-1" />
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="question-author">
                    <i className="bi bi-person-circle me-1" />
                    <span>{q.author?.name || "Someuser"}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default KspDashboard;

