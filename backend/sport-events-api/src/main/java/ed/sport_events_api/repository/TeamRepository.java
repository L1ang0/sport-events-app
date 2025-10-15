package ed.sport_events_api.repository;

import ed.sport_events_api.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByCaptainId(Long captainId);

    @Modifying
    @Query("UPDATE Team t SET t.captain = null WHERE t.captain.id = :userId")
    void clearCaptainForUser(@Param("userId") Long userId);
}
