package ed.sport_events_api.service;

import ed.sport_events_api.model.User;
import ed.sport_events_api.model.enums.ERole;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    Optional<User> getUserByEmail(String email);
    User createUser(User user);
    User updateUser(Long id, User userDetails);
    void deleteUser(Long id);
    boolean existsByEmail(String email);
    User assignRoleToUser(Long userId, Long roleId);
    User removeRoleFromUser(Long userId, Long roleId);
    List<User> getUsersByRole(ERole role);
}