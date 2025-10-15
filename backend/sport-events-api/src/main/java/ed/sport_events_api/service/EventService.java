package ed.sport_events_api.service;

import ed.sport_events_api.exception.ResourceNotFoundException;
import ed.sport_events_api.model.Event;
import ed.sport_events_api.model.User;
import ed.sport_events_api.model.enums.EventStatus;
import ed.sport_events_api.repository.EventRepository;
import ed.sport_events_api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final AuthServiceImpl authService;

    public EventService(EventRepository eventRepository, UserRepository userRepository, AuthServiceImpl authService) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    @Transactional
    public Event createOne(Event event, String token) {
        User user = authService.getCurrentUser(token);
        event.setOrganizer(userRepository.findById(user.getId()).get());
        event.setCreationDate(LocalDateTime.now());
//        event.setOrganizer(authService.getCurrentUser());
        event.setStatus(EventStatus.CREATED);
        return eventRepository.save(event);
    }

    @Transactional
    public Event updateOne(Long id, Event eventDetails) {
        Event event = getEventById(id);

        System.out.println(eventDetails);

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setStatus(eventDetails.getStatus());
        event.setStartDate(eventDetails.getStartDate());
        event.setEndDate(eventDetails.getEndDate());
        event.setResult(eventDetails.getResult());

        return eventRepository.save(event);
    }

    @Transactional
    public Long deleteOne(Long id) {
        Event event = getEventById(id);

        // Очищаем все связи перед удалением
        event.getPlayers().clear();
        event.getSpectators().clear();
        event.getReferees().clear();
        eventRepository.saveAndFlush(event); // Сохраняем изменения

        eventRepository.delete(event);
        return id;
    }

    @Transactional
    public Event registerPlayer(Long eventId, Long userId) {
        Event event = getEventById(eventId);
        User player = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        event.getPlayers().add(player);
        return eventRepository.save(event);
    }

    @Transactional
    public Event registerSpectator(Long eventId, Long userId) {
        Event event = getEventById(eventId);
        User spectator = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        event.getSpectators().add(spectator);
        return eventRepository.save(event);
    }

    @Transactional
    public Event registerReferee(Long eventId, Long userId) {
        Event event = getEventById(eventId);
        User referee = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        event.getReferees().add(referee);
        return eventRepository.save(event);
    }

    public List<Event> getEventsBySportType(Long sportTypeId) {
        return eventRepository.findBySportTypeId(sportTypeId);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByStartDateAfter(LocalDateTime.now());
    }

    public List<Event> getFinishedEvents() {
        return eventRepository.findByStatus(EventStatus.FINISHED);
    }

    public Event participateInEvent(Long eventId, Long userId, String role) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        switch (role.toLowerCase()) {
            case "player":
                return registerPlayer(event, user);
            case "spectator":
                return registerSpectator(event, user);
            case "referee":
                return registerReferee(event, user);
            default:
                throw new IllegalArgumentException("Invalid role: " + role);
        }
    }

    private Event registerPlayer(Event event, User user) {
        if (event.getPlayers() == null) {
            event.setPlayers(new ArrayList<>());
        }
        if (!event.getPlayers().contains(user)) {
            event.getPlayers().add(user);
        }
        return eventRepository.save(event);
    }

    private Event registerSpectator(Event event, User user) {
        if (event.getSpectators() == null) {
            event.setSpectators(new ArrayList<>());
        }
        if (!event.getSpectators().contains(user)) {
            event.getSpectators().add(user);
        }
        return eventRepository.save(event);
    }

    private Event registerReferee(Event event, User user) {
        if (event.getReferees() == null) {
            event.setReferees(new ArrayList<>());
        }
        if (!event.getReferees().contains(user)) {
            event.getReferees().add(user);
        }
        return eventRepository.save(event);
    }
}