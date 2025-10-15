package ed.sport_events_api.service;

import ed.sport_events_api.dto.TeamCreateRequest;
import ed.sport_events_api.model.Team;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TeamService {
    Team getTeamById(Long id);
    List<Team> getAllTeams();
    Page<Team> getAllTeams(Pageable pageable);
    Team updateTeam(Long id, Team teamDetails);
    void deleteTeam(Long id);
    boolean existsById(Long id);

    Team joinTeam(Long teamId, String token);
    Team leaveTeam(Long teamId, String token);

    Team createTeamWithCaptain(TeamCreateRequest request);
}