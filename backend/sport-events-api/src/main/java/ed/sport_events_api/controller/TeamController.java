package ed.sport_events_api.controller;

import ed.sport_events_api.dto.TeamCreateRequest;
import ed.sport_events_api.exception.ResourceNotFoundException;
import ed.sport_events_api.exception.UnauthorizedException;
import ed.sport_events_api.model.Team;
import ed.sport_events_api.service.AuthService;
import ed.sport_events_api.service.AuthServiceImpl;
import ed.sport_events_api.service.TeamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "http://localhost:3000")
public class TeamController {

    private final TeamService teamService;
    private final AuthServiceImpl authService;

    public TeamController(TeamService teamService, AuthServiceImpl authService) {
        this.teamService = teamService;
        this.authService = authService;
    }

//    @PostMapping("/create")
//    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
//        Team createdTeam = teamService.createTeam(team);
//        return ResponseEntity.ok(createdTeam);
//    }

    @PostMapping("/create")
    public ResponseEntity<Team> createTeam(@RequestBody TeamCreateRequest request) {
        Team createdTeam = teamService.createTeamWithCaptain(request);
        return ResponseEntity.ok(createdTeam);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable Long id, @RequestBody Team teamDetails) {
        return ResponseEntity.ok(teamService.updateTeam(id, teamDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{teamId}/join")
    public ResponseEntity<?> joinTeam(
            @PathVariable Long teamId,
            @RequestHeader("Authorization") String token) {

        try {
            Team updatedTeam = teamService.joinTeam(teamId, token);
            return ResponseEntity.ok(updatedTeam);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error joining team");
        }
    }

    @PostMapping("/{teamId}/leave")
    public ResponseEntity<?> leaveTeam(
            @PathVariable Long teamId,
            @RequestHeader("Authorization") String token) {

        try {
            Team updatedTeam = teamService.leaveTeam(teamId, token);
            return ResponseEntity.ok(updatedTeam);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error leaving team: " + e.getMessage());
        }
    }
}
