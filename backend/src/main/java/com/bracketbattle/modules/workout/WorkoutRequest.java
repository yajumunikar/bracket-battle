package com.bracketbattle.modules.workout;

public class WorkoutRequest {
    private String goal;
    private String fitnessLevel;
    private int daysPerWeek;
    private String sessionLength;
    private String equipment;
    private Integer age;
    private Double weight;
    private String weightUnit;
    private String height;
    private String gender;
    private String limitations;

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public String getFitnessLevel() { return fitnessLevel; }
    public void setFitnessLevel(String fitnessLevel) { this.fitnessLevel = fitnessLevel; }

    public int getDaysPerWeek() { return daysPerWeek; }
    public void setDaysPerWeek(int daysPerWeek) { this.daysPerWeek = daysPerWeek; }

    public String getSessionLength() { return sessionLength; }
    public void setSessionLength(String sessionLength) { this.sessionLength = sessionLength; }

    public String getEquipment() { return equipment; }
    public void setEquipment(String equipment) { this.equipment = equipment; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public String getWeightUnit() { return weightUnit; }
    public void setWeightUnit(String weightUnit) { this.weightUnit = weightUnit; }

    public String getHeight() { return height; }
    public void setHeight(String height) { this.height = height; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getLimitations() { return limitations; }
    public void setLimitations(String limitations) { this.limitations = limitations; }
}