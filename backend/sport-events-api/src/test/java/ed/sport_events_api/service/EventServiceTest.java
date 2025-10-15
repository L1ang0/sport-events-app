package ed.sport_events_api.service;

import ed.sport_events_api.exception.ResourceNotFoundException;
import ed.sport_events_api.model.*;
import ed.sport_events_api.model.enums.EventStatus;
import ed.sport_events_api.model.enums.SportCategory;
import ed.sport_events_api.repository.EventRepository;
import ed.sport_events_api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {

    @Mock private EventRepository eventRepository;
    @Mock private UserRepository userRepository;
    @InjectMocks private EventService eventService;

    private User organizer;
    private SportType footballSport;
    private Venue stadiumVenue;
    private Event footballMatch;

    @BeforeEach
    void setUp() {
        organizer = new User(1L, "org@test.com", "pass", "Organizer", "+123", null, new HashSet<>(), new ArrayList<>());
        footballSport = new SportType(1L, "Football", SportCategory.TEAM, "{}", "football.png", 10, 22);
        stadiumVenue = new Venue(1L, "National Stadium", "City, Street 1", "Main stadium", 50000L, "stadium.jpg");
        footballMatch = new Event(
                1L, "Championship Final", "Football match", LocalDateTime.now(), "cup.png",
                LocalDateTime.now().plusDays(1), LocalDateTime.now().plusDays(1).plusHours(2), null,
                footballSport, organizer, new ArrayList<>(), new ArrayList<>(), new ArrayList<>(),
                EventStatus.CREATED, stadiumVenue
        );
    }

    @Test
    void registerPlayer_ForTeamSport_AddsPlayer() {
        User player = new User(2L, "player@test.com", "pass", "Player", "+456", null, new HashSet<>(), new ArrayList<>());

        when(eventRepository.findById(1L)).thenReturn(Optional.of(footballMatch));
        when(userRepository.findById(2L)).thenReturn(Optional.of(player));
        when(eventRepository.save(any(Event.class))).thenReturn(footballMatch);

        Event result = eventService.registerPlayer(1L, 2L);

        assertTrue(result.getPlayers().contains(player));
        assertEquals(1, result.getPlayers().size());
        verify(eventRepository).save(footballMatch);
    }

    @Test
    void registerSpectator_AddsToSpectatorsList() {
        User spectator = new User(3L, "spec@test.com", "pass", "Spectator", "+789", null, new HashSet<>(), new ArrayList<>());

        when(eventRepository.findById(1L)).thenReturn(Optional.of(footballMatch));
        when(userRepository.findById(3L)).thenReturn(Optional.of(spectator));
        when(eventRepository.save(any(Event.class))).thenReturn(footballMatch);

        Event result = eventService.registerSpectator(1L, 3L);

        assertTrue(result.getSpectators().contains(spectator));
        verify(eventRepository).save(footballMatch);
    }

    @Test
    void getEventsBySportType_ReturnsFilteredList() {
        SportType chessSport = new SportType(2L, "Chess", SportCategory.INDIVIDUAL, "{}", "chess.png", 1, 2);
        Event chessTournament = new Event(
                2L, "Chess Championship", "Tournament", LocalDateTime.now(), "chess.png",
                LocalDateTime.now().plusDays(3), LocalDateTime.now().plusDays(5), null,
                chessSport, organizer, new ArrayList<>(), new ArrayList<>(), new ArrayList<>(),
                EventStatus.CREATED, null
        );

        when(eventRepository.findBySportTypeId(1L)).thenReturn(List.of(footballMatch));

        List<Event> result = eventService.getEventsBySportType(1L);

        assertEquals(1, result.size());
        assertEquals("Football", result.get(0).getSportType().getName());
    }

    @Test
    void participateInEvent_WithInvalidRole_ThrowsException() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(footballMatch));
        when(userRepository.findById(1L)).thenReturn(Optional.of(organizer));

        assertThrows(IllegalArgumentException.class,
                () -> eventService.participateInEvent(1L, 1L, "invalid_role"));
    }

    @Test
    void deleteEvent_WithExistingId_ReturnsDeletedId() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(footballMatch));

        Long result = eventService.deleteOne(1L);

        assertEquals(1L, result);
        verify(eventRepository).delete(footballMatch);
    }

    @Test
    void getUpcomingEvents_ReturnsOnlyFutureEvents() {
        Event pastEvent = new Event(
                3L, "Past Event", "Completed", LocalDateTime.now(), "icon.png",
                LocalDateTime.now().minusDays(1), LocalDateTime.now().minusDays(1).plusHours(2), "1-0",
                footballSport, organizer, new ArrayList<>(), new ArrayList<>(), new ArrayList<>(),
                EventStatus.FINISHED, stadiumVenue
        );

        when(eventRepository.findByStartDateAfter(any(LocalDateTime.class))).thenReturn(List.of(footballMatch));

        List<Event> result = eventService.getUpcomingEvents();

        assertEquals(1, result.size());
        assertTrue(result.get(0).getStartDate().isAfter(LocalDateTime.now()));
    }

    @Test
    void registerReferee_AddsToRefereesList() {
        User referee = new User(4L, "ref@test.com", "pass", "Referee", "+321", null, new HashSet<>(), new ArrayList<>());

        when(eventRepository.findById(1L)).thenReturn(Optional.of(footballMatch));
        when(userRepository.findById(4L)).thenReturn(Optional.of(referee));
        when(eventRepository.save(any(Event.class))).thenReturn(footballMatch);

        Event result = eventService.registerReferee(1L, 4L);

        assertTrue(result.getReferees().contains(referee));
        verify(eventRepository).save(footballMatch);
    }

}