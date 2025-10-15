package ed.sport_events_api.controller;

import ed.sport_events_api.model.Event;
import ed.sport_events_api.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "http://localhost:3000")
public class ResultController {
    private final EventService eventService;

    public ResultController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<Event>> getFinishedEvents() {
        return ResponseEntity.ok(eventService.getFinishedEvents());
    }
}
