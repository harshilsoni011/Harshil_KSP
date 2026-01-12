import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { kspAPI } from "../../utils/api";
import { VALIDATION_MESSAGES, API_MESSAGES } from "../../utils/constants";
import { toast } from "react-toastify";

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [comments, setComments] = useState([]);
  const [answerBody, setAnswerBody] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);
  const [answerError, setAnswerError] = useState("");
  const [commentError, setCommentError] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await kspAPI.getQuestionById(id);
      setQuestion(res.data.question);
      setAnswers(res.data.answers || []);
      setComments(res.data.comments || []);
    } catch (err) {
      toast.error(API_MESSAGES.ERROR.NOT_FOUND);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleVoteQuestion = async (value) => {
    setVoteLoading(true);
    try {
      const res = await kspAPI.voteQuestion(id, value);
      setQuestion(res.data.question);
      toast.success(API_MESSAGES.SUCCESS.VOTE_SUBMITTED);
    } catch (err) {
      const message = err.response?.data?.error || API_MESSAGES.ERROR.VOTE_FAILED;
      toast.error(message);
    } finally {
      setVoteLoading(false);
    }
  };

  const handleVoteAnswer = async (answerId, value) => {
    try {
      const res = await kspAPI.voteAnswer(answerId, value);
      setAnswers((prev) =>
        prev.map((a) => (a._id === answerId ? res.data.answer : a)),
      );
      toast.success(API_MESSAGES.SUCCESS.VOTE_SUBMITTED);
    } catch (err) {
      const message = err.response?.data?.error || API_MESSAGES.ERROR.VOTE_FAILED;
      toast.error(message);
    }
  };

  const handleAddAnswer = async (e) => {
    e.preventDefault();
    setAnswerError("");
    
    if (!answerBody.trim()) {
      setAnswerError(VALIDATION_MESSAGES.BODY_REQUIRED);
      return;
    }
    
    try {
      await kspAPI.createAnswer(id, { body: answerBody });
      setAnswerBody("");
      setAnswerError("");
      toast.success(API_MESSAGES.SUCCESS.ANSWER_POSTED);
      await loadData();
    } catch (err) {
      const message = err.response?.data?.error || API_MESSAGES.ERROR.ANSWER_FAILED;
      setAnswerError(message);
      toast.error(message);
    }
  };

  const handleAddQuestionComment = async (e) => {
    e.preventDefault();
    setCommentError("");
    
    if (!commentBody.trim()) {
      setCommentError(VALIDATION_MESSAGES.BODY_REQUIRED);
      return;
    }
    
    try {
      await kspAPI.createQuestionComment(id, { body: commentBody });
      setCommentBody("");
      setCommentError("");
      toast.success(API_MESSAGES.SUCCESS.COMMENT_POSTED);
      await loadData();
    } catch (err) {
      const message = err.response?.data?.error || API_MESSAGES.ERROR.COMMENT_FAILED;
      setCommentError(message);
      toast.error(message);
    }
  };

  if (loading && !question) {
    return <div className="container py-4">Loading...</div>;
  }

  if (!question) {
    return <div className="container py-4">Question not found.</div>;
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-9">
          <div className="question-detail-card">
            <div className="card-body">
              <div className="d-flex">
                <div className="question-vote-section">
                  <button
                    className="btn vote-btn vote-up"
                    onClick={() => handleVoteQuestion(1)}
                    disabled={voteLoading}
                    title="Upvote"
                  >
                    <i className="bi bi-hand-thumbs-up-fill" />
                  </button>
                  <div className="vote-count">{question.score || 0}</div>
                  <button
                    className="btn vote-btn vote-down"
                    onClick={() => handleVoteQuestion(-1)}
                    disabled={voteLoading}
                    title="Downvote"
                  >
                    <i className="bi bi-hand-thumbs-down-fill" />
                  </button>
                </div>
                <div className="flex-grow-1">
                  <h2 className="question-title mb-3">{question.title}</h2>
                  <p className="question-excerpt mb-3">{question.body}</p>
                  <div className="question-footer">
                    <div className="question-tags">
                      {(question.tags || []).map((t) => (
                        <span key={t} className="tag-badge">
                          <i className="bi bi-tag-fill me-1" />
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="question-author">
                      <i className="bi bi-person-circle me-1" />
                      asked by <strong>{question.author?.name || "Unknown"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="answers-section mt-4">
            <h4 className="mb-3">
              <i className="bi bi-chat-dots-fill me-2 text-info" />
              Answers <span className="text-muted">({answers.length})</span>
            </h4>

            {answers.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-inbox empty-icon" />
                <p className="text-muted">No answers yet. Be the first to answer!</p>
              </div>
            ) : (
              answers.map((a) => (
                <div key={a._id} className="answer-card">
                  <div className="card-body">
                    <div className="d-flex">
                      <div className="answer-vote-section">
                        <button
                          className="btn vote-btn vote-up"
                          onClick={() => handleVoteAnswer(a._id, 1)}
                          title="Upvote"
                        >
                          <i className="bi bi-hand-thumbs-up-fill" />
                        </button>
                        <div className="vote-count">{a.score || 0}</div>
                        <button
                          className="btn vote-btn vote-down"
                          onClick={() => handleVoteAnswer(a._id, -1)}
                          title="Downvote"
                        >
                          <i className="bi bi-hand-thumbs-down-fill" />
                        </button>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-3">{a.body}</p>
                        <div className="question-author">
                          <i className="bi bi-person-circle me-1" />
                          answered by <strong>{a.author?.name || "Unknown"}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="card answer-form-card mt-4">
            <div className="card-body">
              <h5 className="mb-3">
                <i className="bi bi-pencil-fill me-2" />
                Your Answer
              </h5>
              <form onSubmit={handleAddAnswer} noValidate>
                <div className="mb-3">
                  <textarea
                    className={`form-control ${answerError ? "is-invalid" : ""}`}
                    rows={6}
                    placeholder="Write your answer here..."
                    value={answerBody}
                    onChange={(e) => {
                      setAnswerBody(e.target.value);
                      if (answerError) setAnswerError("");
                    }}
                  />
                  {answerError && (
                    <div className="invalid-feedback">{answerError}</div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary btn-lg">
                  <i className="bi bi-check-circle-fill me-2" />
                  Post Answer
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-3 mt-4 mt-md-0">
          <div className="card comments-section">
            <div className="card-body">
              <h6 className="mb-3">
                <i className="bi bi-chat-left-text-fill me-2" />
                Comments
              </h6>
              {comments.length === 0 ? (
                <p className="text-muted small mb-3">No comments yet.</p>
              ) : (
                <div className="mb-3">
                  {comments.map((c) => (
                    <div key={c._id} className="comment-item">
                      <p className="mb-1 small">{c.body}</p>
                      <small className="text-muted">
                        <i className="bi bi-person-circle me-1" />
                        {c.author?.name || "User"}
                      </small>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={handleAddQuestionComment} noValidate>
                <textarea
                  className={`form-control form-control-sm mb-2 ${commentError ? "is-invalid" : ""}`}
                  rows={3}
                  value={commentBody}
                  onChange={(e) => {
                    setCommentBody(e.target.value);
                    if (commentError) setCommentError("");
                  }}
                  placeholder="Add a comment..."
                />
                {commentError && (
                  <div className="invalid-feedback d-block mb-2">{commentError}</div>
                )}
                <button
                  type="submit"
                  className="btn btn-outline-primary btn-sm w-100"
                >
                  <i className="bi bi-chat-left-text me-1" />
                  Comment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;

