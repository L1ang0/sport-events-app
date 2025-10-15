package ed.sport_events_api.controller;

import ed.sport_events_api.model.User;
import ed.sport_events_api.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    private final User testUser = new User(
            1L,
            "test@example.com",
            "encodedPassword123",
            "John Doe",
            "+123456789",
            "https://example.com/avatar.jpg",
            new HashSet<>(),
            new ArrayList<>()
    );

    private final String userJson = """
            {
                "email": "test@example.com",
                "password": "rawPassword123",
                "name": "John Doe",
                "phone": "+123456789",
                "avatar_url": "https://example.com/avatar.jpg"
            }
            """;

    @Test
    public void getAllUsers_ReturnsListOfUsers() throws Exception {
        List<User> users = List.of(testUser);
        Mockito.when(userService.getAllUsers()).thenReturn(users);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("John Doe"))
                .andExpect(jsonPath("$[0].phone").value("+123456789"));
    }

    @Test
    public void getUserById_UserExists_ReturnsUser() throws Exception {
        Mockito.when(userService.getUserById(1L)).thenReturn(Optional.of(testUser));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.avatar_url").value("https://example.com/avatar.jpg"));
    }

    @Test
    public void createUser_ValidUser_ReturnsCreatedUser() throws Exception {
        Mockito.when(userService.createUser(Mockito.any(User.class))).thenReturn(testUser);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(header().exists("Location"));
    }

    @Test
    public void deleteUser_ValidId_ReturnsNoContent() throws Exception {
        Mockito.doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/users/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void removeRoleFromUser_ValidIds_ReturnsUserWithoutRole() throws Exception {
        User userWithoutRole = new User(
                1L,
                "test@example.com",
                "encodedPassword123",
                "John Doe",
                "+123456789",
                "https://example.com/avatar.jpg",
                new HashSet<>(),
                new ArrayList<>()
        );

        Mockito.when(userService.removeRoleFromUser(1L, 2L)).thenReturn(userWithoutRole);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/users/1/roles/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roles").isEmpty());
    }

    @Test
    public void getUserByEmail_UserExists_ReturnsUser() throws Exception {
        Mockito.when(userService.getUserByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/email/test@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phone").value("+123456789"));
    }

    @Test
    public void corsHeaders_ShouldBePresent() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/users")
                        .header("Origin", "http://localhost:3000"))
                .andExpect(header().exists("Access-Control-Allow-Origin"))
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"));
    }
}