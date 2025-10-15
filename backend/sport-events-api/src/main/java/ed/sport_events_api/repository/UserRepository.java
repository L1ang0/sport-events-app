package ed.sport_events_api.repository;

import ed.sport_events_api.model.User;
import ed.sport_events_api.model.enums.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :role")
    List<User> findAllByRole(@Param("role") ERole role);
    boolean existsByEmail(String email);
}
