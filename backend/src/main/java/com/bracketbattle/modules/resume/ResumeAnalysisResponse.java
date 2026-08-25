package com.bracketbattle.modules.resume;

import java.util.List;

public class ResumeAnalysisResponse {

    private int overallScore;
    private String grade;
    private ScoreBreakdown scoreBreakdown;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> suggestions;
    private AtsAnalysis atsAnalysis;
    private KeywordMatch keywordMatch;
    private List<BulletRewrite> bulletRewrites;
    private String summary;

    // Constructors
    public ResumeAnalysisResponse() {}

    // Getters and Setters
    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public ScoreBreakdown getScoreBreakdown() { return scoreBreakdown; }
    public void setScoreBreakdown(ScoreBreakdown scoreBreakdown) { this.scoreBreakdown = scoreBreakdown; }

    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }

    public List<String> getWeaknesses() { return weaknesses; }
    public void setWeaknesses(List<String> weaknesses) { this.weaknesses = weaknesses; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public AtsAnalysis getAtsAnalysis() { return atsAnalysis; }
    public void setAtsAnalysis(AtsAnalysis atsAnalysis) { this.atsAnalysis = atsAnalysis; }

    public KeywordMatch getKeywordMatch() { return keywordMatch; }
    public void setKeywordMatch(KeywordMatch keywordMatch) { this.keywordMatch = keywordMatch; }

    public List<BulletRewrite> getBulletRewrites() { return bulletRewrites; }
    public void setBulletRewrites(List<BulletRewrite> bulletRewrites) { this.bulletRewrites = bulletRewrites; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    // --- Nested Classes ---

    public static class ScoreBreakdown {
        private int impactAndAchievements;
        private int keywordMatch;
        private int formattingAndClarity;
        private int atsCompatibility;
        private int quantifiedResults;

        public int getImpactAndAchievements() { return impactAndAchievements; }
        public void setImpactAndAchievements(int v) { this.impactAndAchievements = v; }

        public int getKeywordMatch() { return keywordMatch; }
        public void setKeywordMatch(int v) { this.keywordMatch = v; }

        public int getFormattingAndClarity() { return formattingAndClarity; }
        public void setFormattingAndClarity(int v) { this.formattingAndClarity = v; }

        public int getAtsCompatibility() { return atsCompatibility; }
        public void setAtsCompatibility(int v) { this.atsCompatibility = v; }

        public int getQuantifiedResults() { return quantifiedResults; }
        public void setQuantifiedResults(int v) { this.quantifiedResults = v; }
    }

    public static class AtsAnalysis {
        private int score;
        private String explanation;
        private List<String> issues;

        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }

        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }

        public List<String> getIssues() { return issues; }
        public void setIssues(List<String> issues) { this.issues = issues; }
    }

    public static class KeywordMatch {
        private List<String> present;
        private List<String> missing;

        public List<String> getPresent() { return present; }
        public void setPresent(List<String> present) { this.present = present; }

        public List<String> getMissing() { return missing; }
        public void setMissing(List<String> missing) { this.missing = missing; }
    }

    public static class BulletRewrite {
        private String before;
        private String after;

        public String getBefore() { return before; }
        public void setBefore(String before) { this.before = before; }

        public String getAfter() { return after; }
        public void setAfter(String after) { this.after = after; }
    }
}