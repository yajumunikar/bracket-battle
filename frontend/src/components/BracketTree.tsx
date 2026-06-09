import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import type { MatchDto, BracketDto } from "../api/bracket";
import { reportResult } from "../api/bracket";
import { useAuth } from "../context/AuthContext";

interface Props {
  bracket: BracketDto;
  isOrganizer: boolean;
  onResultReported: () => void;
}

const MATCH_W = 180;
const MATCH_H = 80;
const ROUND_GAP = 80;
const MATCH_V_GAP = 24;

export default function BracketTree({
  bracket,
  isOrganizer,
  onResultReported,
}: Props) {
  const { user } = useAuth();
  const [selectedMatch, setSelectedMatch] = useState<MatchDto | null>(null);
  const [p1Score, setP1Score] = useState("");
  const [p2Score, setP2Score] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const rounds = bracket.totalRounds;
  const matchesByRound: Record<number, MatchDto[]> = {};
  for (let r = 1; r <= rounds; r++) {
    matchesByRound[r] = bracket.matches
      .filter((m) => m.roundNumber === r)
      .sort((a, b) => a.matchNumber - b.matchNumber);
  }

  // Calculate canvas size
  const round1Count = matchesByRound[1]?.length ?? 1;
  const totalH = round1Count * (MATCH_H + MATCH_V_GAP) + 60;
  const totalW = rounds * (MATCH_W + ROUND_GAP) + 40;

  const getMatchY = (roundNum: number, matchNum: number): number => {
    const round1Count = matchesByRound[1]?.length ?? 1;
    const matchesInRound = Math.ceil(round1Count / Math.pow(2, roundNum - 1));
    const totalH = round1Count * (MATCH_H + MATCH_V_GAP);
    const slotH = totalH / matchesInRound;
    return (matchNum - 1) * slotH + slotH / 2 - MATCH_H / 2 + 30;
  };

  const getMatchX = (roundNum: number): number => {
    return (roundNum - 1) * (MATCH_W + ROUND_GAP) + 20;
  };

  const handleMatchClick = (match: MatchDto) => {
    if (!isOrganizer) return;
    if (match.status === "COMPLETED" || match.status === "BYE") return;
    if (!match.player1Id || !match.player2Id) return;
    setSelectedMatch(match);
    setP1Score("");
    setP2Score("");
  };

  const handleSubmitResult = async (winnerId: number) => {
    if (!selectedMatch || !user) return;
    setSubmitting(true);
    try {
      await reportResult(
        bracket.tournamentId,
        selectedMatch.id,
        winnerId,
        Number(p1Score),
        Number(p2Score)
      );
      onResultReported();
      setSelectedMatch(null);
    } catch (e: any) {
      alert(e.response?.data?.message ?? "Failed to report result.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRoundLabel = (r: number): string => {
    if (r === rounds) return "Final";
    if (r === rounds - 1) return "Semi Finals";
    if (r === rounds - 2) return "Quarter Finals";
    return `Round ${r}`;
  };

  return (
    <Box sx={{ overflowX: "auto", overflowY: "auto" }}>
      <svg width={totalW} height={totalH} style={{ display: "block" }}>
        {/* Round labels */}
        {Array.from({ length: rounds }, (_, i) => i + 1).map((r) => (
          <text
            key={`label-${r}`}
            x={getMatchX(r) + MATCH_W / 2}
            y={20}
            textAnchor="middle"
            fill="#555570"
            fontSize={10}
            fontFamily="DM Sans, sans-serif"
            letterSpacing={2}
            style={{ textTransform: "uppercase" }}
          >
            {getRoundLabel(r).toUpperCase()}
          </text>
        ))}

        {/* Connector lines */}
        {Array.from({ length: rounds - 1 }, (_, i) => i + 1).map((r) => {
          const nextRound = matchesByRound[r + 1] ?? [];
          return (matchesByRound[r] ?? []).map((match, idx) => {
            const x1 = getMatchX(r) + MATCH_W;
            const y1 = getMatchY(r, match.matchNumber) + MATCH_H / 2;
            const nextMatchIdx = Math.floor(idx / 2);
            const nextMatch = nextRound[nextMatchIdx];
            if (!nextMatch) return null;
            const x2 = getMatchX(r + 1);
            const y2 = getMatchY(r + 1, nextMatch.matchNumber) + MATCH_H / 2;
            const midX = (x1 + x2) / 2;
            return (
              <g key={`conn-${match.id}`}>
                <path
                  d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke={match.winnerId ? "#00ffe040" : "#1f1f2e"}
                  strokeWidth={1.5}
                />
              </g>
            );
          });
        })}

        {/* Match cards */}
        {Array.from({ length: rounds }, (_, i) => i + 1).map((r) =>
          (matchesByRound[r] ?? []).map((match) => {
            const x = getMatchX(r);
            const y = getMatchY(r, match.matchNumber);
            const isCompleted = match.status === "COMPLETED";
            const isBye = match.status === "BYE";
            const isClickable =
              isOrganizer &&
              !isCompleted &&
              !isBye &&
              match.player1Id &&
              match.player2Id;

            const borderColor = isCompleted
              ? "#00ffe040"
              : isBye
              ? "#7b5ef840"
              : match.player1Id && match.player2Id
              ? "#1f1f2e"
              : "#13131c";

            return (
              <g
                key={match.id}
                onClick={() => handleMatchClick(match)}
                style={{ cursor: isClickable ? "pointer" : "default" }}
              >
                {/* Card background */}
                <rect
                  x={x}
                  y={y}
                  width={MATCH_W}
                  height={MATCH_H}
                  rx={6}
                  ry={6}
                  fill="#13131c"
                  stroke={borderColor}
                  strokeWidth={1}
                />

                {/* Top accent line */}
                {isCompleted && (
                  <rect
                    x={x}
                    y={y}
                    width={MATCH_W}
                    height={2}
                    rx={1}
                    fill="#00ffe0"
                  />
                )}

                {/* Match number */}
                <text
                  x={x + MATCH_W - 8}
                  y={y + 12}
                  textAnchor="end"
                  fill="#333350"
                  fontSize={9}
                  fontFamily="DM Sans, sans-serif"
                >
                  M{match.matchNumber}
                </text>

                {/* Divider */}
                <line
                  x1={x + 8}
                  y1={y + MATCH_H / 2}
                  x2={x + MATCH_W - 8}
                  y2={y + MATCH_H / 2}
                  stroke="#1f1f2e"
                  strokeWidth={0.5}
                />

                {/* Player 1 */}
                <text
                  x={x + 10}
                  y={y + MATCH_H / 2 - 12}
                  fill={
                    match.winnerId === match.player1Id
                      ? "#00ffe0"
                      : match.player1Id
                      ? "#e8e8f0"
                      : "#333350"
                  }
                  fontSize={12}
                  fontWeight={match.winnerId === match.player1Id ? 700 : 400}
                  fontFamily="DM Sans, sans-serif"
                >
                  {match.player1Username ?? "TBD"}
                </text>

                {/* Player 1 score */}
                {match.player1Score !== null &&
                  match.player1Score !== undefined && (
                    <text
                      x={x + MATCH_W - 10}
                      y={y + MATCH_H / 2 - 12}
                      textAnchor="end"
                      fill={
                        match.winnerId === match.player1Id
                          ? "#00ffe0"
                          : "#555570"
                      }
                      fontSize={12}
                      fontWeight={700}
                      fontFamily="DM Sans, sans-serif"
                    >
                      {match.player1Score}
                    </text>
                  )}

                {/* Player 2 */}
                <text
                  x={x + 10}
                  y={y + MATCH_H / 2 + 20}
                  fill={
                    match.winnerId === match.player2Id
                      ? "#00ffe0"
                      : match.player2Id
                      ? "#e8e8f0"
                      : "#333350"
                  }
                  fontSize={12}
                  fontWeight={match.winnerId === match.player2Id ? 700 : 400}
                  fontFamily="DM Sans, sans-serif"
                >
                  {isBye ? "BYE" : match.player2Username ?? "TBD"}
                </text>

                {/* Player 2 score */}
                {match.player2Score !== null &&
                  match.player2Score !== undefined && (
                    <text
                      x={x + MATCH_W - 10}
                      y={y + MATCH_H / 2 + 20}
                      textAnchor="end"
                      fill={
                        match.winnerId === match.player2Id
                          ? "#00ffe0"
                          : "#555570"
                      }
                      fontSize={12}
                      fontWeight={700}
                      fontFamily="DM Sans, sans-serif"
                    >
                      {match.player2Score}
                    </text>
                  )}

                {/* Hover indicator for organizer */}
                {isClickable && (
                  <rect
                    x={x}
                    y={y}
                    width={MATCH_W}
                    height={MATCH_H}
                    rx={6}
                    fill="transparent"
                    stroke="#00ffe020"
                    strokeWidth={0}
                    className="match-hover"
                  />
                )}
              </g>
            );
          })
        )}
      </svg>

      {/* Report Result Dialog */}
      <Dialog
        open={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        PaperProps={{
          sx: {
            background: "#13131c",
            border: "1px solid #1f1f2e",
            minWidth: 340,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 22,
            fontWeight: 900,
            color: "#fff",
            borderBottom: "1px solid #1f1f2e",
          }}
        >
          Report Match Result
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedMatch && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  sx={{ fontWeight: 600, color: "#e8e8f0", fontSize: 15 }}
                >
                  {selectedMatch.player1Username}
                </Typography>
                <Typography sx={{ color: "#555570", fontSize: 13 }}>
                  vs
                </Typography>
                <Typography
                  sx={{ fontWeight: 600, color: "#e8e8f0", fontSize: 15 }}
                >
                  {selectedMatch.player2Username}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                  label={`${selectedMatch.player1Username} Score`}
                  value={p1Score}
                  onChange={(e) => setP1Score(e.target.value)}
                  type="number"
                  inputProps={{ min: 0 }}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "#0d0d10",
                      "& fieldset": { borderColor: "#1f1f2e" },
                      "&.Mui-focused fieldset": { borderColor: "#00ffe0" },
                    },
                    "& .MuiInputLabel-root": { color: "#555570" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#00ffe0" },
                    "& .MuiInputBase-input": { color: "#e8e8f0" },
                  }}
                />
                <TextField
                  label={`${selectedMatch.player2Username} Score`}
                  value={p2Score}
                  onChange={(e) => setP2Score(e.target.value)}
                  type="number"
                  inputProps={{ min: 0 }}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "#0d0d10",
                      "& fieldset": { borderColor: "#1f1f2e" },
                      "&.Mui-focused fieldset": { borderColor: "#00ffe0" },
                    },
                    "& .MuiInputLabel-root": { color: "#555570" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#00ffe0" },
                    "& .MuiInputBase-input": { color: "#e8e8f0" },
                  }}
                />
              </Box>

              <Typography sx={{ fontSize: 12, color: "#555570", mb: 2 }}>
                Select the winner:
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                  onClick={() => handleSubmitResult(selectedMatch.player1Id!)}
                >
                  {selectedMatch.player1Username} Wins
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  disabled={submitting}
                  onClick={() => handleSubmitResult(selectedMatch.player2Id!)}
                  sx={{
                    borderColor: "#7b5ef8",
                    color: "#7b5ef8",
                    "&:hover": {
                      borderColor: "#9b7ef8",
                      background: "#7b5ef815",
                    },
                  }}
                >
                  {selectedMatch.player2Username} Wins
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #1f1f2e", p: 2 }}>
          <Button
            onClick={() => setSelectedMatch(null)}
            sx={{ color: "#555570" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
