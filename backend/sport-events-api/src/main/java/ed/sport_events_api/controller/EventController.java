package ed.sport_events_api.controller;

import ed.sport_events_api.dto.ParticipationRequest;
import ed.sport_events_api.model.Event;
import ed.sport_events_api.service.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping("/{eventId}/participate")
    public ResponseEntity<Event> participateInEvent(
            @PathVariable Long eventId,
            @RequestBody ParticipationRequest participationRequest) {
        return ResponseEntity.ok(eventService.participateInEvent(
                eventId,
                participationRequest.getUserId(),
                participationRequest.getRole()));
    }

    @PostMapping
//    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public ResponseEntity<Event> createEvent(@RequestBody Event event,  @RequestHeader("Authorization") String token) {
        return new ResponseEntity<>(eventService.createOne(event, token), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        return ResponseEntity.ok(eventService.updateOne(id, eventDetails));
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteOne(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{eventId}/players/{userId}")
//    @PreAuthorize("hasRole('PLAYER')")
    public ResponseEntity<Event> registerPlayer(@PathVariable Long eventId, @PathVariable Long userId) {
        return ResponseEntity.ok(eventService.registerPlayer(eventId, userId));
    }

    @PostMapping("/{eventId}/spectators/{userId}")
//    @PreAuthorize("hasRole('SPECTATOR')")
    public ResponseEntity<Event> registerSpectator(@PathVariable Long eventId, @PathVariable Long userId) {
        return ResponseEntity.ok(eventService.registerSpectator(eventId, userId));
    }

    @PostMapping("/{eventId}/referees/{userId}")
//    @PreAuthorize("hasRole('REFEREE') or hasRole('ADMIN')")
    public ResponseEntity<Event> registerReferee(@PathVariable Long eventId, @PathVariable Long userId) {
        return ResponseEntity.ok(eventService.registerReferee(eventId, userId));
    }

    @GetMapping("/sport-type/{sportTypeId}")
    public ResponseEntity<List<Event>> getEventsBySportType(@PathVariable Long sportTypeId) {
        return ResponseEntity.ok(eventService.getEventsBySportType(sportTypeId));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }
}