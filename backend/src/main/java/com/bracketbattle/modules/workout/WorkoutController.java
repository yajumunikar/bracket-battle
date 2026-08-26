package com.bracketbattle.modules.workout;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/workout")
@CrossOrigin(origins = "*")
public class WorkoutController {

    private static final Logger log = LoggerFactory.getLogger(WorkoutController.class);

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateWorkout(@RequestBody WorkoutRequest request) {
        log.info("Workout plan request — goal: {}, level: {}, days: {}",
                request.getGoal(), request.getFitnessLevel(), request.getDaysPerWeek());

        if (request.getGoal() == null || request.getGoal().isBlank()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Goal is required."));
        }
        if (request.getFitnessLevel() == null || request.getFitnessLevel().isBlank()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Fitness level is required."));
        }
        if (request.getDaysPerWeek() < 1 || request.getDaysPerWeek() > 7) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Days per week must be between 1 and 7."));
        }

        try {
            String plan = workoutService.generate(request);
            return ResponseEntity.ok(java.util.Map.of("plan", plan));
        } catch (Exception e) {
            log.error("Workout generation failed: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(java.util.Map.of("error", "Generation failed. Please try again."));
        }
    }
}