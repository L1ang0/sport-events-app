package ed.sport_events_api.dto;

public class ParticipationRequest {
    private Long userId;
    private String role; // "player", "spectator", or "referee"

    // getters and setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}