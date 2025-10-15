package ed.sport_events_api.service;

import ed.sport_events_api.dto.LoginDTO;
import ed.sport_events_api.dto.RegisterDTO;
import ed.sport_events_api.model.Notification;
import ed.sport_events_api.model.User;
import ed.sport_events_api.repository.RoleRepository;
import ed.sport_events_api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthServiceImpl {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final Map<String, User> activeSessions = new ConcurrentHashMap<>();

    public AuthServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public User register(RegisterDTO request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.getRoles().add(roleRepository.findById(3l).get());
        user.setPassword(request.getPassword()); // В реальном приложении пароль нужно хэшировать!
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAvatar_url("https://example.com/avatars/random.jpg");

        return userRepository.save(user);
    }

    public String login(LoginDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.getNotifications().add(new Notification("Успешная авторизация!", "Здраствуйте!!"));

        userRepository.save(user);

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        String token = UUID.randomUUID().toString();
        activeSessions.put(token, user);

        return token;
    }

    public User getCurrentUser(String token) {
        System.out.println(token);
        if (token == null || !token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid token");
        }

        String cleanToken = token.substring(7);

        User user = activeSessions.get(cleanToken);

        if (user == null) {
            throw new IllegalArgumentException("Session expired");
        }

        return user;
    }
}