import React, { useState, useEffect } from "react";
import "./interview.scss";
import { Link, useParams } from "react-router";
import { useInterview } from "../hooks/useInterview";
import { getResumePdf } from "../services/interview.api";

const Interview = ({ reportData }) => {
  const { interviewId } = useParams();
  const { report: contextReport, getReportById, loading } = useInterview();

  // Active navigation tab on the left: 'technical' | 'behavioral' | 'roadmap'
  const [activeTab, setActiveTab] = useState("technical");
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [downloadingResume, setDownloadingResume] = useState(false);

  const handleDownloadResume = async () => {
    const targetId = interviewId || report?._id || report?.id;
    if (!targetId) {
      alert("No report ID available to download resume.");
      return;
    }

    try {
      setDownloadingResume(true);
      const blob = await getResumePdf(targetId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Resume-${targetId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download resume:", err);
      alert("Failed to download resume. Please try again.");
    } finally {
      setDownloadingResume(false);
    }
  };

  useEffect(() => {
    if (interviewId && (!contextReport || contextReport._id !== interviewId)) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  // Priority: prop data -> context report -> fallback demo mock data
  const report = reportData || contextReport || {
    matchScore: 82,
    skillGaps: [
      { skill: "redis", severity: "high" },
      { skill: "Message queue", severity: "medium" },
      { skill: "Event loop", severity: "low" },
      { skill: "Distributed Caching", severity: "medium" },
      { skill: "System Design", severity: "high" },
    ],
    technicalQuestions: [
      {
        question: "How does Redis handle persistence and what are the trade-offs of RDB vs AOF?",
        intention: "Evaluates in-depth storage mechanics, memory management, and reliability trade-offs in distributed systems.",
        answer:
          "Redis provides two primary persistence mechanisms: RDB (point-in-time snapshots) and AOF (append-only log). RDB offers faster restarts and minimal performance hit during routine ops, but can lose recent data between snapshots. AOF logs every write for maximum durability with fsync policies, but creates larger files and slightly slower read/write throughput.",
      },
      {
        question: "Explain the Node.js / JavaScript Event Loop phases and microtask priority.",
        intention: "Tests understanding of asynchronous runtimes, non-blocking I/O execution order, and potential event loop blocking traps.",
        answer:
          "The Event Loop transitions across Timers, Pending Callbacks, Idle/Prepare, Poll, Check (setImmediate), and Close callbacks. Microtasks (process.nextTick and Promise callbacks) execute immediately after each phase or call stack drain, taking priority before moving to macro tasks.",
      },
      {
        question: "How would you design a resilient message queue consumer architecture?",
        intention: "Validates distributed systems concepts: idempotency, dead-letter queues, backpressure, and at-least-once delivery guarantees.",
        answer:
          "Use acknowledged consumption with visibility timeouts, a dedicated Dead Letter Queue (DLQ) for failed retry cycles, and implement idempotent consumers using deduplication keys or distributed locks to prevent double-processing during transient network partitions.",
      },
    ],
    behavioralQuestions: [
      {
        question: "Tell me about a time you resolved a major production bottleneck under high pressure.",
        intention: "Assess analytical debugging under pressure, communication with stakeholders, and systematic mitigation strategy.",
        answer:
          "STAR method: Outlined a situation where API response latency jumped 400%. Identified N+1 queries causing database contention. Rolled out query batching and in-memory cache layer within 45 minutes, reducing p99 latency by 78%.",
      },
      {
        question: "Describe how you navigate conflicting technical decisions within your team.",
        intention: "Assess emotional intelligence, teamwork, consensus-building, and data-backed technical diplomacy.",
        answer:
          "I encourage creating measurable PoCs or benchmark metrics rather than subjective arguments. By focusing on business outcomes and team maintenance costs, we reach consensus objectively.",
      },
    ],
    preparationPlan: [
      {
        day: 1,
        focus: "Foundations & Concurrency Models",
        tasks: ["Review JavaScript Event Loop & libuv threadpool internals", "Benchmark async/await vs raw promises"],
      },
      {
        day: 2,
        focus: "In-Memory Stores & Caching",
        tasks: ["Deep dive into Redis data structures & eviction policies", "Implement cache-aside and write-through patterns"],
      },
      {
        day: 3,
        focus: "Message Queues & Event Streaming",
        tasks: ["Study RabbitMQ / Kafka partition models & consumer groups", "Build sample DLQ retry mechanism"],
      },
      {
        day: 4,
        focus: "System Design Practice",
        tasks: ["Architect a high-scale real-time notifications engine", "Conduct mock behavioral interview on conflict resolution"],
      },
    ],
  };

  return (
    <div className="interview-layout-wrapper">
      {/* Three-column card board matching the wireframe */}
      <div className="interview-container">
        {/* Left Column: Navigation / Category Selectors */}
        <aside className="column column-left">
          <div className="column-top-header">
            <Link to="/" className="back-link">
              ← Back
            </Link>
          </div>

          <nav className="nav-menu">
            <button
              className={`nav-item ${activeTab === "technical" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("technical");
                setSelectedQuestionIndex(0);
              }}
            >
              <span className="nav-indicator"></span>
              Technical questions
            </button>

            <button
              className={`nav-item ${activeTab === "behavioral" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("behavioral");
                setSelectedQuestionIndex(0);
              }}
            >
              <span className="nav-indicator"></span>
              Behavioral questions
            </button>

            <button
              className={`nav-item ${activeTab === "roadmap" ? "active" : ""}`}
              onClick={() => setActiveTab("roadmap")}
            >
              <span className="nav-indicator"></span>
              Road Map
            </button>
          </nav>

          {/* Download Resume Button in bottom of left column */}
          <div className="left-column-bottom">
            <button
              className="download-resume-btn"
              onClick={handleDownloadResume}
              disabled={downloadingResume}
            >
              {downloadingResume ? (
                <>
                  <span className="spinner"></span>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span className="btn-sparkle">✦</span>
                  <span>Download Resume</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Vertical Divider 1 */}
        <div className="column-divider">
          <div className="divider-line"></div>
        </div>

        {/* Center Column: Main Content Area */}
        <main className="column column-center">
          <div className="main-content-scroll">
            {activeTab === "technical" && (
              <div className="content-pane">
                <div className="pane-header">
                  <span className="tab-badge">Technical Focus</span>
                  <h2>Technical Interview Questions</h2>
                  <p className="pane-sub">Curated based on the target role description and your profile analysis.</p>
                </div>

                <div className="questions-list">
                  {report.technicalQuestions?.map((item, idx) => (
                    <div
                      key={idx}
                      className={`question-card ${selectedQuestionIndex === idx ? "expanded" : ""}`}
                      onClick={() => setSelectedQuestionIndex(idx)}
                    >
                      <div className="question-title-bar">
                        <span className="q-number">Q{idx + 1}</span>
                        <h4 className="q-text">{item.question}</h4>
                        <span className="q-expand-toggle">
                          {selectedQuestionIndex === idx ? "−" : "+"}
                        </span>
                      </div>

                      {selectedQuestionIndex === idx && (
                        <div className="question-details">
                          <div className="detail-block">
                            <span className="detail-tag">Interviewer's Intention</span>
                            <p>{item.intention}</p>
                          </div>
                          <div className="detail-block answer-block">
                            <span className="detail-tag">Recommended Strategy / Answer</span>
                            <p>{item.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "behavioral" && (
              <div className="content-pane">
                <div className="pane-header">
                  <span className="tab-badge">Behavioral Focus</span>
                  <h2>Behavioral & Leadership Questions</h2>
                  <p className="pane-sub">Frame responses using the STAR format (Situation, Task, Action, Result).</p>
                </div>

                <div className="questions-list">
                  {report.behavioralQuestions?.map((item, idx) => (
                    <div
                      key={idx}
                      className={`question-card ${selectedQuestionIndex === idx ? "expanded" : ""}`}
                      onClick={() => setSelectedQuestionIndex(idx)}
                    >
                      <div className="question-title-bar">
                        <span className="q-number">Q{idx + 1}</span>
                        <h4 className="q-text">{item.question}</h4>
                        <span className="q-expand-toggle">
                          {selectedQuestionIndex === idx ? "−" : "+"}
                        </span>
                      </div>

                      {selectedQuestionIndex === idx && (
                        <div className="question-details">
                          <div className="detail-block">
                            <span className="detail-tag">Evaluation Goal</span>
                            <p>{item.intention}</p>
                          </div>
                          <div className="detail-block answer-block">
                            <span className="detail-tag">Key Talking Points</span>
                            <p>{item.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "roadmap" && (
              <div className="content-pane">
                <div className="pane-header">
                  <span className="tab-badge">Preparation Timeline</span>
                  <h2>Personalized Study Roadmap</h2>
                  <p className="pane-sub">A day-by-day execution plan targeted at addressing your detected skill gaps.</p>
                </div>

                <div className="roadmap-timeline">
                  {report.preparationPlan?.map((plan, idx) => (
                    <div key={idx} className="roadmap-day-card">
                      <div className="day-badge">Day {plan.day}</div>
                      <div className="day-body">
                        <h4 className="focus-heading">{plan.focus}</h4>
                        <ul className="tasks-list">
                          {plan.tasks?.map((task, tIdx) => (
                            <li key={tIdx}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Vertical Divider 2 */}
        <div className="column-divider">
          <div className="divider-line"></div>
        </div>

        {/* Right Column: Skill Gaps and Badges */}
        <aside className="column column-right">
          <div className="skill-gaps-section">
            <h3 className="section-title">Skill Gaps</h3>

            <div className="tags-container">
              {report.skillGaps?.map((gap, idx) => (
                <div key={idx} className={`skill-tag severity-${gap.severity || "medium"}`}>
                  <span className="tag-label">{gap.skill}</span>
                  {gap.severity && <span className="tag-severity">{gap.severity}</span>}
                </div>
              ))}
            </div>
          </div>

          {report.matchScore !== undefined && (
            <div className="match-score-card">
              <span className="score-title">Job Match Score</span>
              <div className="score-meter">
                <div
                  className="score-fill"
                  style={{ width: `${report.matchScore}%` }}
                ></div>
              </div>
              <span className="score-value">{report.matchScore}% Compatibility</span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Interview;
