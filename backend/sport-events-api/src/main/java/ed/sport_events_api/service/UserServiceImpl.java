package ed.sport_events_api.service;

import ed.sport_events_api.exception.ResourceNotFoundException;
import ed.sport_events_api.model.Role;
import ed.sport_events_api.model.User;
import ed.sport_events_api.model.enums.ERole;
import ed.sport_events_api.repository.EventRepository;
import ed.sport_events_api.repository.RoleRepository;
import ed.sport_events_api.repository.TeamRepository;
import ed.sport_events_api.repository.UserRepository;
import ed.sport_events_api.util.PasswordEncoderImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(TeamRepository teamRepository,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           EventRepository eventRepository,
                           PasswordEncoder passwordEncoder) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.eventRepository = eventRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User createUser(User user) {
        if (existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Почта уже используется");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> getUsersByRole(ERole role) {
        return userRepository.findAllByRole(role);
        // или: return userRepository.findByRoles_Name(role);
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден c id: " + id));

        if (userDetails.getName() != null) {
            user.setName(userDetails.getName());
        }
        if (userDetails.getPhone() != null) {
            user.setPhone(userDetails.getPhone());
        }
        if (userDetails.getAvatar_url() != null) {
            user.setAvatar_url(userDetails.getAvatar_url());
        }
        if (userDetails.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        if (userDetails.getEmail() != null && !userDetails.getEmail().equals(user.getEmail())) {
            if (existsByEmail(userDetails.getEmail())) {
                throw new IllegalArgumentException("Почта уже используется");
            }
            user.setEmail(userDetails.getEmail());
        }

        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден с id: " + userId));

        // 1. Очищаем связи, где пользователь является капитаном
        teamRepository.clearCaptainForUser(userId);

        // 2. Очищаем связи, где пользователь является организатором
        eventRepository.clearOrganizerForUser(userId);

        // 4. Очищаем роли пользователя
        user.getRoles().clear();
        userRepository.save(user);

        // 5. Очищаем уведомления пользователя
        user.getNotifications().clear();
        userRepository.save(user);

        // 6. Удаляем самого пользователя
        userRepository.deleteById(userId);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public User assignRoleToUser(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден с id: " + userId));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Роль не найдена с id: " + roleId));

        user.getRoles().add(role);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User removeRoleFromUser(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден с id: " + userId));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Роль не найдена с id: " + roleId));

        user.getRoles().remove(role);
        return userRepository.save(user);
    }
}