package ed.sport_events_api.service;

import ed.sport_events_api.exception.ResourceNotFoundException;
import ed.sport_events_api.model.Role;
import ed.sport_events_api.model.User;
import ed.sport_events_api.model.enums.ERole;
import ed.sport_events_api.repository.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {
    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private TeamRepository teamRepository;
    @Mock private EventRepository eventRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private UserServiceImpl userService;

    private final User testUser = new User(1L, "test@example.com", "encodedPass", "John", "+123", "avatar.jpg", new HashSet<>(), new ArrayList<>());
    private final Role testRole = new Role(1L, ERole.PLAYER);

    @Test void getAllUsers_ReturnsUsersList() {
        when(userRepository.findAll()).thenReturn(List.of(testUser));
        List<User> result = userService.getAllUsers();
        assertEquals(1, result.size());
        verify(userRepository).findAll();
    }

    @Test void getUserById_Exists_ReturnsUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        Optional<User> result = userService.getUserById(1L);
        assertTrue(result.isPresent());
        verify(userRepository).findById(1L);
    }

    @Test void getUserByEmail_Exists_ReturnsUser() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        Optional<User> result = userService.getUserByEmail("test@example.com");
        assertTrue(result.isPresent());
        verify(userRepository).findByEmail("test@example.com");
    }

    @Test void createUser_Valid_SavesEncodedPassword() {
        User newUser = new User(null, "new@test.com", "rawPass", "New", "+111", null, new HashSet<>(), new ArrayList<>());
        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("rawPass")).thenReturn("encodedPass");
        when(userRepository.save(any())).thenReturn(newUser);

        User result = userService.createUser(newUser);
        assertEquals("encodedPass", result.getPassword());
        verify(userRepository).save(any());
    }

    @Test void updateUser_Valid_UpdatesFields() {
        User existing = testUser;
        User updates = new User(null, "new@test.com", "newPass", "NewName", "+999", "new.jpg", null, null);

        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(passwordEncoder.encode("newPass")).thenReturn("encodedNewPass");
        when(userRepository.save(any())).thenReturn(existing);

        User result = userService.updateUser(1L, updates);
        assertEquals("NewName", result.getName());
        assertEquals("encodedNewPass", result.getPassword());
        verify(userRepository).save(existing);
    }

    @Test void deleteUser_Valid_CleansAllRelations() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        userService.deleteUser(1L);
        verify(teamRepository).clearCaptainForUser(1L);
        verify(eventRepository).clearOrganizerForUser(1L);
        verify(userRepository).deleteById(1L);
    }

    @Test void assignRoleToUser_Valid_AddsRole() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roleRepository.findById(1L)).thenReturn(Optional.of(testRole));
        when(userRepository.save(any())).thenReturn(testUser);

        User result = userService.assignRoleToUser(1L, 1L);
        assertTrue(result.getRoles().contains(testRole));
        verify(userRepository).save(testUser);
    }

    @Test void removeRoleFromUser_Valid_RemovesRole() {
        testUser.getRoles().add(testRole);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(roleRepository.findById(1L)).thenReturn(Optional.of(testRole));
        when(userRepository.save(any())).thenReturn(testUser);

        User result = userService.removeRoleFromUser(1L, 1L);
        assertFalse(result.getRoles().contains(testRole));
        verify(userRepository).save(testUser);
    }

    @Test void createUser_DuplicateEmail_ThrowsException() {
        User duplicate = new User(null, "test@example.com", "pass", "Dup", "+1", null, new HashSet<>(), new ArrayList<>());
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);
        assertThrows(IllegalArgumentException.class, () -> userService.createUser(duplicate));
    }

    @Test void updateUser_InvalidId_ThrowsNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> userService.updateUser(999L, new User()));
    }
}