import { useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { analyzeResume } from "../api/resume";
import type { ResumeAnalysisResponse } from "../api/resume";

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

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeAnalysisResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const onDragLeave = () => setDragging(false);

  // ── Analyze ────────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeResume(file, jobDescription);
      setResult(data);
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

  // ── Score ring (CSS conic-gradient via inline SVG approach) ───────────────
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0f", color: "#e8e8f0" }}>
      <Navbar />

      {/* ── HERO ── */}
      <Box
        sx={{
          textAlign: "center",
          pt: { xs: 6, md: 9 },
          pb: 6,
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
        {/* Eyebrow */}
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
            mb: 5,
            lineHeight: 1.7,
          }}
        >
          Upload your resume and get a detailed breakdown — score, gaps, ATS
          compatibility, and rewrite suggestions in seconds.
        </Typography>

        {/* ── Upload Zone ── */}
        <Box
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
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

        {/* ── Job Description ── */}
        <Box sx={{ maxWidth: 640, mx: "auto", mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
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
            placeholder="Paste the job description here to see how well your resume matches this specific role..."
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

        {/* Error */}
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

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!file || loading}
          sx={{
            maxWidth: 640,
            width: "100%",
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CircularProgress size={18} sx={{ color: "#fff" }} />
              Analyzing your resume...
            </Box>
          ) : (
            "✦  Analyze My Resume"
          )}
        </Button>
      </Box>

      {/* ── RESULTS ── */}
      {result && (
        <Box
          id="results-section"
          sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, md: 3 }, pb: 10 }}
        >
          <Box sx={{ borderTop: "1px solid #23232f", mb: 6 }} />

          {/* Header row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 4,
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

          {/* Summary */}
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

          {/* Row 1: Score breakdown + Strengths */}
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
                  <Typography sx={{ fontSize: "0.85rem", lineHeight: 1.55 }}>
                    {s}
                  </Typography>
                </Box>
              ))}
            </SectionCard>
          </Box>

          {/* Row 2: Weaknesses + Suggestions */}
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
                  <Typography sx={{ fontSize: "0.85rem", lineHeight: 1.55 }}>
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

          {/* Row 3: ATS + Keywords */}
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
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
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

          {/* Row 4: Bullet Rewrites */}
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

          {/* Analyze again */}
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
  );
}
