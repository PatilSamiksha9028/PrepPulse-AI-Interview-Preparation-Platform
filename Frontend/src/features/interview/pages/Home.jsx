import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import "./home.scss";
import { useAuth } from "../../auth/hooks/useAuth";
import { useInterview } from "../hooks/useInterview";
import { getResumePdf } from "../services/interview.api";

const Home = () => {
  const { loading, generateReport, reports, getReports } = useInterview();
  const { user, handlelogout } = useAuth();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [downloadingResume, setDownloadingResume] = useState(false);

  const fileInputRef = useRef(null);
  const MAX_CHARS = 5000;

  useEffect(() => {
    getReports();
  }, []);

  const handleDownloadLatestResume = async () => {
    if (!reports || reports.length === 0) {
      alert("No generated interview reports found yet. Generate a strategy first to download the AI resume.");
      return;
    }

    // Pick the most recent report (by createdAt)
    const latestReport = [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const targetId = latestReport._id || latestReport.id;

    try {
      setDownloadingResume(true);
      const blob = await getResumePdf(targetId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `AI-Resume-${latestReport.title ? latestReport.title.replace(/[^a-zA-Z0-9]/g, "-") : targetId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download resume:", err);
      alert("Failed to download AI resume. Please try again.");
    } finally {
      setDownloadingResume(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Sort reports by increasing order of date (oldest to newest)
  const sortedReports = reports && reports.length > 0
    ? [...reports].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    : [];

  const handleGenerateReport = async () => {
    if (!jobDescription.trim()) {
      setStatusMessage({ type: "error", text: "Target Job Description is required." });
      return;
    }

    if (!resumeFile && !selfDescription.trim()) {
      setStatusMessage({
        type: "error",
        text: "Either a Resume or a Self Description is required to generate a plan.",
      });
      return;
    }

    try {
      setStatusMessage({ type: "info", text: "Analyzing requirements & preparing your custom interview strategy..." });

      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile
      });

      if (data && (data._id || data.id)) {
        navigate(`/interview/${data._id || data.id}`);
      } else {
        navigate("/interview");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.message || err.message || "Failed to generate interview strategy.",
      });
    }
  };

  const handleJobDescChange = (e) => {
    if (e.target.value.length <= MAX_CHARS) {
      setJobDescription(e.target.value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    const allowedExtensions = [".pdf", ".docx"];
    const ext = "." + file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      setStatusMessage({ type: "error", text: "Please upload a valid PDF or DOCX file." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatusMessage({ type: "error", text: "File size exceeds 5MB limit." });
      return;
    }

    setStatusMessage(null);
    setResumeFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="interview-page-wrapper">
      {/* Top Navbar / User session banner */}
      <header className="page-topbar">
        <div className="brand-pill">
          <span className="brand-dot"></span>
          Interview AI Engine
        </div>
        <div className="user-controls">
          <div className="user-info">
            <div className="avatar-chip">
              {(user?.username?.[0] || user?.email?.[0] || "U").toUpperCase()}
            </div>
            <span className="username">{user?.username || user?.email || "Candidate"}</span>
          </div>
          <button className="logout-button" onClick={handlelogout} title="Log out">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Log out</span>
          </button>
        </div>
      </header>

      <main className="interview-main">
        {/* Hero Section */}
        <div className="hero-header">
          <h1 className="hero-title">
            Create Your Custom <span className="highlight-text">Interview Plan</span>
          </h1>
          <p className="hero-subtitle">
            Let our AI analyze the job requirements and your unique profile to build a winning strategy.
          </p>
        </div>

        {/* Status Toast / Alert if applicable */}
        {statusMessage && (
          <div className={`status-banner ${statusMessage.type}`}>
            <span className="status-icon">
              {statusMessage.type === "error" ? "⚠️" : statusMessage.type === "success" ? "✓" : "⚡"}
            </span>
            <span>{statusMessage.text}</span>
            <button className="status-close" onClick={() => setStatusMessage(null)}>✕</button>
          </div>
        )}

        {/* Main Card Container with Two Panels */}
        <div className="planner-card">
          <div className="panels-container">
            {/* Left Panel: Target Job Description */}
            <div className="panel left-panel">
              <div className="panel-header">
                <div className="header-left">
                  <div className="icon-badge pink-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </div>
                  <h2 className="panel-title">Target Job Description</h2>
                </div>
                <span className="badge required-badge">Required</span>
              </div>

              <div className="textarea-box">
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  value={jobDescription}
                  onChange={handleJobDescChange}
                  placeholder="Paste the full job description here...&#10;e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                  spellCheck="false"
                ></textarea>

                <div className="char-count">
                  {jobDescription.length}/{MAX_CHARS} chars
                </div>
              </div>
            </div>

            {/* Center Split Pin */}
            <div className="panel-divider">
              <div className="divider-line"></div>
              <div className="divider-pin" title="AI Match Junction">
                <span className="pin-dot"></span>
              </div>
            </div>

            {/* Right Panel: Your Profile */}
            <div className="panel right-panel">
              <div className="panel-header">
                <div className="header-left">
                  <div className="icon-badge pink-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <h2 className="panel-title">Your Profile</h2>
                </div>
              </div>

              {/* Upload Resume Section */}
              <div className="profile-section">
                <label className="section-label">
                  Upload Resume <span className="label-accent">(Best Results)</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  id="resume-input"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                <div
                  className={`dropzone ${isDragging ? "dragging" : ""} ${resumeFile ? "has-file" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                >
                  {resumeFile ? (
                    <div className="file-info-preview">
                      <div className="file-icon-wrap">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                      </div>
                      <div className="file-details">
                        <span className="file-name">{resumeFile.name}</span>
                        <span className="file-size">
                          {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Ready
                        </span>
                      </div>
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={handleRemoveFile}
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="upload-circle-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                        </svg>
                      </div>
                      <p className="dropzone-text">Click to upload or drag & drop</p>
                      <p className="dropzone-hint">PDF or DOCX (Max 5MB)</p>
                    </>
                  )}
                </div>
              </div>

              {/* OR Divider */}
              <div className="or-separator">
                <span className="or-line"></span>
                <span className="or-text">OR</span>
                <span className="or-line"></span>
              </div>

              {/* Quick Self-Description */}
              <div className="profile-section">
                <label className="section-label" htmlFor="quickDescription">
                  Quick Self-Description
                </label>
                <div className="self-desc-box">
                  <textarea
                    id="quickDescription"
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                    rows={4}
                  ></textarea>
                </div>
              </div>

              {/* Info Note Banner */}
              <div className="info-banner">
                <div className="info-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <p className="info-text">
                  Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Bar inside the Card */}
          <div className="card-footer">
            <div className="footer-left">
              <span className="sparkle-dot"></span>
              <span className="footer-note">AI-Powered Strategy Generation • Approx 30s</span>
            </div>

            <button
              className="generate-action-btn"
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Generating Strategy...</span>
                </>
              ) : (
                <>
                  <span className="btn-sparkle">★</span>
                  <span>Generate My Interview Strategy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* My Recent Interview Plans Section */}
        {sortedReports && sortedReports.length > 0 && (
          <section className="recent-plans-section">
            <h2 className="recent-plans-title">My Recent Interview Plans</h2>
            <div className="recent-plans-grid">
              {sortedReports.map((item) => (
                <div
                  key={item._id || item.id}
                  className="recent-plan-card"
                  onClick={() => navigate(`/interview/${item._id || item.id}`)}
                >
                  <h3 className="plan-card-title">{item.title || "Interview Strategy Plan"}</h3>
                  <p className="plan-card-date">
                    Generated on {formatDate(item.createdAt)}
                  </p>
                  <p className="plan-card-score">
                    Match Score: <span className="score-num">{item.matchScore ?? 85}%</span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Page Footer Links */}
        <footer className="page-footer">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#help">Help Center</a>
        </footer>
      </main>
    </div>
  );
};

export default Home;