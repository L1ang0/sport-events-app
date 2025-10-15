package ed.sport_events_api.repository;

import ed.sport_events_api.model.Team;
import ed.sport_events_api.model.TeamMember;
import ed.sport_events_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    Optional<TeamMember> findByTeamAndUser(Team team, User user);
    boolean existsByTeamAndUser(Team team, User user);
    void deleteByTeamAndUser(Team team, User user);
}