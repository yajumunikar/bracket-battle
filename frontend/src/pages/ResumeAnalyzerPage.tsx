import { useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { analyzeResume } from "../api/resume";
import { searchJobs } from "../api/jobs";
import type { ResumeAnalysisResponse } from "../api/resume";
import type { JobSearchResponse, JobListing } from "../api/jobs";
import Footer from "../components/Footer";

// ── Color helpers ──────────────────────────────────────────────────────────────
const getScoreColor = (score: number) => {
  if (score >= 75) return "#22c97a";
  if (score >= 50) return "#f5c542";
  return "#ff5e6c";
};

const getGradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "#22c97a";
  if (grade.startsWith("B")) return "#22c97a";
  if (grade.startsWith("C")) return "#f5c542";
  return "#ff5e6c";
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day ago";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return `${Math.floor(diff / 30)}mo ago`;
};

// ── Sub-components ─────────────────────────────────────────────────────────────
const ScoreBar = ({ label, value }: { label: string; value: number }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
      <Typography sx={{ fontSize: "0.82rem", color: "#b0b0c8" }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.82rem",
          fontWeight: 700,
          color: getScoreColor(value),
        }}
      >
        {value}%
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 6,
        borderRadius: 3,
        bgcolor: "#2a2a38",
        "& .MuiLinearProgress-bar": {
          bgcolor: getScoreColor(value),
          borderRadius: 3,
        },
      }}
    />
  </Box>
);

const SectionCard = ({
  children,
  sx = {},
}: {
  children: React.ReactNode;
  sx?: object;
}) => (
  <Box
    sx={{
      background: "#16161f",
      border: "1px solid #23232f",
      borderRadius: "14px",
      p: 3,
      ...sx,
    }}
  >
    {children}
  </Box>
);

const CardLabel = ({
  children,
  color = "#6b6b80",
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <Typography
    sx={{
      fontSize: "0.7rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color,
      mb: 2,
      display: "flex",
      alignItems: "center",
      gap: 0.8,
      "&::before": {
        content: '""',
        width: 6,
        height: 6,
        borderRadius: "50%",
        bgcolor: color,
        display: "inline-block",
      },
    }}
  >
    {children}
  </Typography>
);

// ── Job Card ──────────────────────────────────────────────────────────────────
const JobCard = ({ job }: { job: JobListing }) => (
  <Box
    sx={{
      background: "#16161f",
      border: "1px solid #23232f",
      borderLeft: "3px solid #7c6aff",
      borderRadius: "12px",
      p: 2.5,
      mb: 2,
      transition: "border-color 0.2s",
      "&:hover": { borderColor: "#7c6aff", borderLeftColor: "#7c6aff" },
    }}
  >
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
      {/* Logo */}
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "10px",
          flexShrink: 0,
          bgcolor: "#23232f",
          border: "1px solid #2a2a38",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {job.companyLogo ? (
          <Box
            component="img"
            src={job.companyLogo}
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
            onError={(e: any) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <Typography sx={{ fontSize: "1.2rem" }}>🏢</Typography>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
            mb: 0.5,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#e8e8f0",
              lineHeight: 1.3,
            }}
          >
            {job.title}
          </Typography>
          {job.salary && (
            <Chip
              label={job.salary}
              size="small"
              sx={{
                bgcolor: "rgba(34,201,122,0.1)",
                color: "#22c97a",
                border: "1px solid rgba(34,201,122,0.2)",
                fontSize: "0.7rem",
                height: 22,
                flexShrink: 0,
              }}
            />
          )}
        </Box>

        <Typography
          sx={{
            fontSize: "0.83rem",
            color: "#7c6aff",
            fontWeight: 500,
            mb: 0.75,
          }}
        >
          {job.company}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          <Chip
            label={`📍 ${job.location}`}
            size="small"
            sx={{
              bgcolor: "#1e1e2a",
              color: "#b0b0c8",
              fontSize: "0.72rem",
              height: 20,
            }}
          />
          {job.employmentType && (
            <Chip
              label={job.employmentType}
              size="small"
              sx={{
                bgcolor: "#1e1e2a",
                color: "#b0b0c8",
                fontSize: "0.72rem",
                height: 20,
              }}
            />
          )}
          {job.remote && (
            <Chip
              label="🌐 Remote"
              size="small"
              sx={{
                bgcolor: "rgba(124,106,255,0.1)",
                color: "#7c6aff",
                fontSize: "0.72rem",
                height: 20,
              }}
            />
          )}
          {job.postedAt && (
            <Chip
              label={formatDate(job.postedAt)}
              size="small"
              sx={{
                bgcolor: "#1e1e2a",
                color: "#555570",
                fontSize: "0.72rem",
                height: 20,
              }}
            />
          )}
        </Box>

        {job.description && (
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "#6b6b80",
              lineHeight: 1.6,
              mb: 1.5,
            }}
          >
            {job.description}
          </Typography>
        )}

        <Button
          href={job.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          sx={{
            bgcolor: "#7c6aff",
            color: "#fff",
            fontSize: "0.78rem",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "8px",
            px: 2,
            py: 0.75,
            "&:hover": { bgcolor: "#6857e0" },
          }}
        >
          Apply Now →
        </Button>
      </Box>
    </Box>
  </Box>
);

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ResumeAnalyzerPage() {
  const [activeTab, setActiveTab] = useState<"analyzer" | "jobs">("analyzer");

  // Analyzer state
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeAnalysisResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Job search state
  const [jobQuery, setJobQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);
  const [jobResults, setJobResults] = useState<JobSearchResponse | null>(null);
  const [jobPage, setJobPage] = useState(1);
  const [resumeQuery, setResumeQuery] = useState<string | null>(null);

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }
    setError(null);
    setFile(f);
    setResult(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  // ── Analyze ────────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeResume(file, jobDescription);
      setResult(data);
      // Extract role for job search suggestion
      const firstStrength = data.strengths?.[0] || "";
      const queryGuess = extractRoleFromResume(firstStrength);
      setResumeQuery(queryGuess);
      setTimeout(() => {
        document
          .getElementById("results-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Analysis failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const extractRoleFromResume = (strength: string): string => {
    if (strength.toLowerCase().includes("java")) return "Senior Java Developer";
    if (strength.toLowerCase().includes("react")) return "Full Stack Developer";
    if (strength.toLowerCase().includes("python")) return "Python Developer";
    return "Software Engineer";
  };

  // ── Job Search ─────────────────────────────────────────────────────────────
  const handleJobSearch = async (query?: string, page = 1) => {
    const q = query || jobQuery;
    if (!q.trim()) {
      setJobError("Please enter a job title or skill.");
      return;
    }
    setJobLoading(true);
    setJobError(null);
    try {
      const data = await searchJobs(q, jobLocation, page);
      setJobResults(data);
      setJobPage(page);
    } catch (err: any) {
      setJobError(
        err?.response?.data?.error || "Job search failed. Please try again."
      );
    } finally {
      setJobLoading(false);
    }
  };

  const handleFindJobsFromResume = () => {
    if (!resumeQuery) {
      setJobError("Analyze your resume first to use this feature.");
      return;
    }
    setJobQuery(resumeQuery);
    handleJobSearch(resumeQuery, 1);
  };

  // ── Score Ring ─────────────────────────────────────────────────────────────
  const ScoreRing = ({ score, grade }: { score: number; grade: string }) => {
    const color = getScoreColor(score);
    const gradeColor = getGradeColor(grade);
    const r = 44;
    const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ position: "relative", width: 110, height: 110 }}>
          <svg width="110" height="110" style={{ transform: "rotate(-90deg)" }}>
            <circle
              cx="55"
              cy="55"
              r={r}
              fill="none"
              stroke="#2a2a38"
              strokeWidth="8"
            />
            <circle
              cx="55"
              cy="55"
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeLinecap="round"
            />
          </svg>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{ fontSize: "1.4rem", fontWeight: 800, color, lineHeight: 1 }}
            >
              {score}
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: "#6b6b80", mt: 0.3 }}>
              out of 100
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: "2.6rem",
              fontWeight: 800,
              color: gradeColor,
              lineHeight: 1,
            }}
          >
            {grade}
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#6b6b80", mt: 0.3 }}>
            Overall Grade
          </Typography>
        </Box>
      </Box>
    );
  };

  // ── Tab Button ─────────────────────────────────────────────────────────────
  const TabBtn = ({
    id,
    label,
    icon,
  }: {
    id: "analyzer" | "jobs";
    label: string;
    icon: string;
  }) => (
    <Box
      onClick={() => setActiveTab(id)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 3,
        py: 1.5,
        cursor: "pointer",
        borderRadius: "10px",
        bgcolor: activeTab === id ? "rgba(124,106,255,0.15)" : "transparent",
        border:
          activeTab === id
            ? "1px solid rgba(124,106,255,0.3)"
            : "1px solid transparent",
        color: activeTab === id ? "#7c6aff" : "#6b6b80",
        fontWeight: activeTab === id ? 700 : 400,
        fontSize: "0.88rem",
        transition: "all 0.2s",
        "&:hover": { color: "#7c6aff", bgcolor: "rgba(124,106,255,0.08)" },
      }}
    >
      <span>{icon}</span> {label}
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0f", color: "#e8e8f0" }}>
      <Navbar />

      {/* ── HERO ── */}
      <Box
        sx={{
          textAlign: "center",
          pt: { xs: 6, md: 9 },
          pb: 4,
          px: 3,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 300,
            background:
              "radial-gradient(ellipse at center top, rgba(124,106,255,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          },
        }}
      >
        <Chip
          label="✦  AI-Powered · Instant Analysis"
          sx={{
            mb: 3,
            bgcolor: "rgba(124,106,255,0.12)",
            border: "1px solid rgba(124,106,255,0.2)",
            color: "#7c6aff",
            fontWeight: 600,
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2rem", md: "3.2rem" },
            fontWeight: 800,
            letterSpacing: "-1.5px",
            lineHeight: 1.1,
            mb: 2,
          }}
        >
          Is your resume{" "}
          <Box component="span" sx={{ color: "#7c6aff" }}>
            actually
          </Box>
          <br />
          getting you interviews?
        </Typography>
        <Typography
          sx={{
            color: "#6b6b80",
            fontSize: "1rem",
            maxWidth: 480,
            mx: "auto",
            mb: 4,
            lineHeight: 1.7,
          }}
        >
          Analyze your resume with AI or find relevant job opportunities — all
          in one place.
        </Typography>

        {/* ── TABS ── */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 4 }}>
          <TabBtn id="analyzer" label="Resume Analyzer" icon="📄" />
          <TabBtn id="jobs" label="Job Finder" icon="🔍" />
        </Box>
      </Box>

      {/* ══════════════════════════════════════════════════════════════════
          TAB 1 — RESUME ANALYZER
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "analyzer" && (
        <Box sx={{ px: 3, pb: 6 }}>
          {/* Upload Zone */}
          <Box
            onDrop={onDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              maxWidth: 640,
              mx: "auto",
              mb: 2,
              border: `2px dashed ${
                dragging ? "#7c6aff" : file ? "#22c97a" : "#23232f"
              }`,
              borderRadius: "16px",
              p: { xs: 4, md: 6 },
              textAlign: "center",
              cursor: "pointer",
              bgcolor: dragging
                ? "rgba(124,106,255,0.08)"
                : file
                ? "rgba(34,201,122,0.04)"
                : "#16161f",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "#7c6aff",
                bgcolor: "rgba(124,106,255,0.08)",
              },
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={(e) =>
                e.target.files?.[0] && handleFile(e.target.files[0])
              }
            />
            <Box
              sx={{
                width: 56,
                height: 56,
                bgcolor: "rgba(124,106,255,0.12)",
                border: "1px solid rgba(124,106,255,0.25)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
                fontSize: "1.6rem",
              }}
            >
              📄
            </Box>
            {file ? (
              <>
                <Typography sx={{ fontWeight: 700, fontSize: "1rem", mb: 0.5 }}>
                  {file.name}
                </Typography>
                <Chip
                  label={`✓  ${(file.size / 1024).toFixed(
                    0
                  )} KB — click to change`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(34,201,122,0.1)",
                    color: "#22c97a",
                    border: "1px solid rgba(34,201,122,0.2)",
                    mt: 1,
                  }}
                />
              </>
            ) : (
              <>
                <Typography sx={{ fontWeight: 700, fontSize: "1rem", mb: 0.5 }}>
                  Drop your resume here
                </Typography>
                <Typography sx={{ color: "#6b6b80", fontSize: "0.85rem" }}>
                  PDF supported ·{" "}
                  <Box
                    component="span"
                    sx={{ color: "#7c6aff", textDecoration: "underline" }}
                  >
                    browse files
                  </Box>
                </Typography>
              </>
            )}
          </Box>

          {/* Job Description */}
          <Box sx={{ maxWidth: 640, mx: "auto", mb: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#6b6b80",
                }}
              >
                Job Description
              </Typography>
              <Chip
                label="Optional — for targeted analysis"
                size="small"
                sx={{
                  bgcolor: "rgba(124,106,255,0.1)",
                  color: "#7c6aff",
                  fontSize: "0.7rem",
                }}
              />
            </Box>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={4}
              style={{
                width: "100%",
                background: "#16161f",
                border: "1px solid #23232f",
                borderRadius: "12px",
                color: "#e8e8f0",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.88rem",
                padding: "14px 16px",
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#7c6aff")}
              onBlur={(e) => (e.target.style.borderColor = "#23232f")}
            />
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                maxWidth: 640,
                mx: "auto",
                mb: 2,
                bgcolor: "rgba(255,94,108,0.1)",
                color: "#ff5e6c",
                border: "1px solid rgba(255,94,108,0.2)",
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!file || loading}
            sx={{
              maxWidth: 640,
              width: "100%",
              mx: "auto",
              display: "block",
              py: 2,
              bgcolor: "#7c6aff",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              borderRadius: "12px",
              textTransform: "none",
              letterSpacing: "-0.3px",
              "&:hover": { bgcolor: "#6857e0", transform: "translateY(-1px)" },
              "&:disabled": { bgcolor: "#23232f", color: "#4a4a5a" },
              transition: "all 0.2s",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                }}
              >
                <CircularProgress size={18} sx={{ color: "#fff" }} />
                Analyzing your resume...
              </Box>
            ) : (
              "✦  Analyze My Resume"
            )}
          </Button>

          {/* Results */}
          {result && (
            <Box id="results-section" sx={{ maxWidth: 900, mx: "auto", mt: 6 }}>
              <Box sx={{ borderTop: "1px solid #23232f", mb: 4 }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Analysis Results
                </Typography>
                <SectionCard sx={{ p: "12px 20px" }}>
                  <ScoreRing score={result.overallScore} grade={result.grade} />
                </SectionCard>
              </Box>

              <Alert
                severity="info"
                sx={{
                  mb: 3,
                  bgcolor: "rgba(124,106,255,0.08)",
                  color: "#c0b8ff",
                  border: "1px solid rgba(124,106,255,0.2)",
                  borderRadius: "12px",
                  "& .MuiAlert-icon": { color: "#7c6aff" },
                }}
              >
                {result.summary}
              </Alert>

              {/* Find Jobs CTA */}
              <Box
                sx={{
                  mb: 3,
                  p: 2.5,
                  background: "rgba(34,201,122,0.05)",
                  border: "1px solid rgba(34,201,122,0.15)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "#22c97a",
                      mb: 0.3,
                    }}
                  >
                    Ready to apply? Find matching jobs →
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "#6b6b80" }}>
                    Based on your resume, we'll search for {resumeQuery} roles
                  </Typography>
                </Box>
                <Button
                  onClick={() => {
                    setActiveTab("jobs");
                    handleFindJobsFromResume();
                  }}
                  sx={{
                    bgcolor: "#22c97a",
                    color: "#0a0a0f",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "8px",
                    px: 2.5,
                    "&:hover": { bgcolor: "#1aad68" },
                  }}
                >
                  Find Jobs
                </Button>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  mb: 2,
                }}
              >
                <SectionCard>
                  <CardLabel color="#7c6aff">Score Breakdown</CardLabel>
                  <ScoreBar
                    label="Impact & Achievements"
                    value={result.scoreBreakdown.impactAndAchievements}
                  />
                  <ScoreBar
                    label="Keyword Match"
                    value={result.scoreBreakdown.keywordMatch}
                  />
                  <ScoreBar
                    label="Formatting & Clarity"
                    value={result.scoreBreakdown.formattingAndClarity}
                  />
                  <ScoreBar
                    label="ATS Compatibility"
                    value={result.scoreBreakdown.atsCompatibility}
                  />
                  <ScoreBar
                    label="Quantified Results"
                    value={result.scoreBreakdown.quantifiedResults}
                  />
                </SectionCard>
                <SectionCard>
                  <CardLabel color="#22c97a">Strengths</CardLabel>
                  {result.strengths.map((s, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        gap: 1.2,
                        py: 1.2,
                        borderBottom:
                          i < result.strengths.length - 1
                            ? "1px solid #23232f"
                            : "none",
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "#22c97a",
                          mt: 0.7,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{ fontSize: "0.85rem", lineHeight: 1.55 }}
                      >
                        {s}
                      </Typography>
                    </Box>
                  ))}
                </SectionCard>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  mb: 2,
                }}
              >
                <SectionCard>
                  <CardLabel color="#ff5e6c">Weaknesses</CardLabel>
                  {result.weaknesses.map((w, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        gap: 1.2,
                        py: 1.2,
                        borderBottom:
                          i < result.weaknesses.length - 1
                            ? "1px solid #23232f"
                            : "none",
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "#ff5e6c",
                          mt: 0.7,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{ fontSize: "0.85rem", lineHeight: 1.55 }}
                      >
                        {w}
                      </Typography>
                    </Box>
                  ))}
                </SectionCard>
                <SectionCard>
                  <CardLabel color="#f5c542">Improvement Suggestions</CardLabel>
                  {result.suggestions.map((s, i) => (
                    <Box
                      key={i}
                      sx={{
                        bgcolor: "#111118",
                        border: "1px solid #23232f",
                        borderRadius: "10px",
                        p: "12px 14px",
                        mb: i < result.suggestions.length - 1 ? 1.5 : 0,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.83rem",
                          lineHeight: 1.6,
                          color: "#b0b0c8",
                        }}
                      >
                        {s}
                      </Typography>
                    </Box>
                  ))}
                </SectionCard>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 2,
                  mb: 2,
                }}
              >
                <SectionCard>
                  <CardLabel color="#f5c542">ATS Compatibility</CardLabel>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "2.8rem",
                        fontWeight: 800,
                        color: getScoreColor(result.atsAnalysis.score),
                        lineHeight: 1,
                      }}
                    >
                      {result.atsAnalysis.score}%
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.83rem",
                        color: "#6b6b80",
                        lineHeight: 1.6,
                      }}
                    >
                      {result.atsAnalysis.explanation}
                    </Typography>
                  </Box>
                  {result.atsAnalysis.issues.map((issue, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        gap: 1.2,
                        py: 1,
                        borderTop: "1px solid #23232f",
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          bgcolor: "#f5c542",
                          mt: 0.7,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "0.82rem",
                          color: "#b0b0c8",
                          lineHeight: 1.5,
                        }}
                      >
                        {issue}
                      </Typography>
                    </Box>
                  ))}
                </SectionCard>
                <SectionCard>
                  <CardLabel color="#7c6aff">
                    Keyword Match vs. Job Description
                  </CardLabel>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {result.keywordMatch.present.map((kw, i) => (
                      <Chip
                        key={i}
                        label={`${kw} ✓`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(34,201,122,0.1)",
                          color: "#22c97a",
                          border: "1px solid rgba(34,201,122,0.2)",
                          fontSize: "0.75rem",
                        }}
                      />
                    ))}
                    {result.keywordMatch.missing.map((kw, i) => (
                      <Chip
                        key={i}
                        label={`${kw} ✗`}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,94,108,0.1)",
                          color: "#ff5e6c",
                          border: "1px solid rgba(255,94,108,0.2)",
                          fontSize: "0.75rem",
                        }}
                      />
                    ))}
                  </Box>
                </SectionCard>
              </Box>

              <SectionCard>
                <CardLabel color="#7c6aff">AI Bullet Point Rewrites</CardLabel>
                {result.bulletRewrites.map((rewrite, i) => (
                  <Box
                    key={i}
                    sx={{
                      bgcolor: "#111118",
                      border: "1px solid #23232f",
                      borderRadius: "10px",
                      p: "14px 16px",
                      mb: i < result.bulletRewrites.length - 1 ? 2 : 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#ff5e6c",
                        mb: 0.5,
                      }}
                    >
                      Before
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "#6b6b80",
                        lineHeight: 1.6,
                        mb: 1,
                      }}
                    >
                      {rewrite.before}
                    </Typography>
                    <Typography
                      sx={{ textAlign: "center", color: "#4a4a5a", mb: 1 }}
                    >
                      ↓
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#22c97a",
                        mb: 0.5,
                      }}
                    >
                      After
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: "#e8e8f0",
                        lineHeight: 1.6,
                      }}
                    >
                      {rewrite.after}
                    </Typography>
                  </Box>
                ))}
              </SectionCard>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                    setJobDescription("");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  sx={{
                    color: "#7c6aff",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "rgba(124,106,255,0.08)" },
                  }}
                >
                  ← Analyze another resume
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB 2 — JOB FINDER
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "jobs" && (
        <Box sx={{ maxWidth: 860, mx: "auto", px: 3, pb: 10 }}>
          {/* Search Box */}
          <SectionCard sx={{ mb: 3 }}>
            <CardLabel color="#7c6aff">Search Jobs</CardLabel>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
              <TextField
                value={jobQuery}
                onChange={(e) => setJobQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJobSearch()}
                placeholder="Job title or skill (e.g. Senior Java Developer)"
                fullWidth
                sx={{
                  flex: "1 1 280px",
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#111118",
                    color: "#e8e8f0",
                    fontSize: "0.88rem",
                    "& fieldset": { borderColor: "#23232f" },
                    "&:hover fieldset": { borderColor: "#7c6aff" },
                    "&.Mui-focused fieldset": { borderColor: "#7c6aff" },
                  },
                  "& input::placeholder": { color: "#6b6b80" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontSize: "1rem" }}>🔍</Typography>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJobSearch()}
                placeholder="Location (e.g. Boston, MA)"
                sx={{
                  flex: "1 1 200px",
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#111118",
                    color: "#e8e8f0",
                    fontSize: "0.88rem",
                    "& fieldset": { borderColor: "#23232f" },
                    "&:hover fieldset": { borderColor: "#7c6aff" },
                    "&.Mui-focused fieldset": { borderColor: "#7c6aff" },
                  },
                  "& input::placeholder": { color: "#6b6b80" },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontSize: "1rem" }}>📍</Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Button
                onClick={() => handleJobSearch()}
                disabled={jobLoading}
                sx={{
                  bgcolor: "#7c6aff",
                  color: "#fff",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "10px",
                  px: 3,
                  "&:hover": { bgcolor: "#6857e0" },
                  "&:disabled": { bgcolor: "#23232f", color: "#4a4a5a" },
                }}
              >
                {jobLoading ? (
                  <CircularProgress size={16} sx={{ color: "#fff" }} />
                ) : (
                  "Search Jobs"
                )}
              </Button>
              <Button
                onClick={() => {
                  setActiveTab("analyzer");
                }}
                variant="outlined"
                sx={{
                  borderColor: "#23232f",
                  color: "#6b6b80",
                  textTransform: "none",
                  borderRadius: "10px",
                  px: 2,
                  "&:hover": { borderColor: "#7c6aff", color: "#7c6aff" },
                }}
              >
                ← Back to Analyzer
              </Button>
              {resumeQuery && (
                <Button
                  onClick={handleFindJobsFromResume}
                  disabled={jobLoading}
                  sx={{
                    bgcolor: "rgba(34,201,122,0.1)",
                    color: "#22c97a",
                    border: "1px solid rgba(34,201,122,0.2)",
                    textTransform: "none",
                    borderRadius: "10px",
                    px: 2,
                    fontSize: "0.82rem",
                    "&:hover": { bgcolor: "rgba(34,201,122,0.15)" },
                  }}
                >
                  ✦ Find jobs from my resume
                </Button>
              )}
            </Box>
          </SectionCard>

          {jobError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                bgcolor: "rgba(255,94,108,0.1)",
                color: "#ff5e6c",
                border: "1px solid rgba(255,94,108,0.2)",
              }}
            >
              {jobError}
            </Alert>
          )}

          {jobLoading && (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <CircularProgress sx={{ color: "#7c6aff" }} />
              <Typography sx={{ mt: 2, color: "#6b6b80", fontSize: "0.88rem" }}>
                Searching across LinkedIn, Indeed, Glassdoor...
              </Typography>
            </Box>
          )}

          {jobResults && !jobLoading && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: "0.85rem", color: "#6b6b80" }}>
                  Showing{" "}
                  <Box
                    component="span"
                    sx={{ color: "#e8e8f0", fontWeight: 700 }}
                  >
                    {jobResults.jobs.length}
                  </Box>{" "}
                  jobs
                  {jobQuery && (
                    <>
                      {" "}
                      for{" "}
                      <Box component="span" sx={{ color: "#7c6aff" }}>
                        "{jobQuery}"
                      </Box>
                    </>
                  )}
                  {jobLocation && (
                    <>
                      {" "}
                      in{" "}
                      <Box component="span" sx={{ color: "#7c6aff" }}>
                        {jobLocation}
                      </Box>
                    </>
                  )}
                </Typography>
                <Typography sx={{ fontSize: "0.78rem", color: "#555570" }}>
                  Page {jobPage}
                </Typography>
              </Box>

              {jobResults.jobs.map((job) => (
                <JobCard key={job.jobId} job={job} />
              ))}

              {/* Pagination */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 3,
                }}
              >
                {jobPage > 1 && (
                  <Button
                    onClick={() => handleJobSearch(jobQuery, jobPage - 1)}
                    sx={{
                      color: "#7c6aff",
                      textTransform: "none",
                      "&:hover": { bgcolor: "rgba(124,106,255,0.08)" },
                    }}
                  >
                    ← Previous
                  </Button>
                )}
                <Button
                  onClick={() => handleJobSearch(jobQuery, jobPage + 1)}
                  sx={{
                    color: "#7c6aff",
                    textTransform: "none",
                    "&:hover": { bgcolor: "rgba(124,106,255,0.08)" },
                  }}
                >
                  Next →
                </Button>
              </Box>
            </>
          )}

          {!jobResults && !jobLoading && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography sx={{ fontSize: "2rem", mb: 2 }}>🔍</Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#e8e8f0",
                  mb: 1,
                }}
              >
                Find your next role
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "#6b6b80" }}>
                Search by job title, or analyze your resume first and we'll
                suggest matching roles.
              </Typography>
            </Box>
          )}
        </Box>
      )}
      <Footer />
    </Box>
  );
}
