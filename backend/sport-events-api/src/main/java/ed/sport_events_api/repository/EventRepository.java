package ed.sport_events_api.repository;

import ed.sport_events_api.model.Event;
import ed.sport_events_api.model.User;
import ed.sport_events_api.model.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatus(EventStatus status);
    List<Event> findByStartDateBetween(LocalDateTime start, LocalDateTime end);
    List<Event> findBySportTypeId(Long sportTypeId);
    List<Event> findByOrganizerId(Long organizerId);
    List<Event> findByVenueId(Long venueId);


    List<Event> findByStartDateAfter(LocalDateTime date);
    List<Event> findByStartDateBefore(LocalDateTime date);

    boolean existsByIdAndPlayersId(Long eventId, Long playerId);
    boolean existsByIdAndSpectatorsId(Long eventId, Long spectatorId);
    boolean existsByIdAndRefereesId(Long eventId, Long refereeId);
    @Modifying
    @Query("UPDATE Event e SET e.organizer = null WHERE e.organizer.id = :userId")
    void clearOrganizerForUser(@Param("userId") Long userId);
//    @Modifying
//    @Query("DELETE FROM Event e WHERE e.players. = :user")
//    void deleteEventPlayersByUser(@Param("user") User user);
}
