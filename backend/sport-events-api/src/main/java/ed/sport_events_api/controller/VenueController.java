package ed.sport_events_api.controller;

import ed.sport_events_api.model.Venue;
import ed.sport_events_api.service.VenueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/venues")
@CrossOrigin(origins = "http://localhost:3000")
public class VenueController {
    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @GetMapping
    public ResponseEntity<List<Venue>> getAll() {
        List<Venue> venues = venueService.getAll();
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venue> getById(@PathVariable Long id) {
        Venue venue = venueService.getById(id);
        if (venue == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(venue);
    }

    @PostMapping("/create")
    public ResponseEntity<Venue> create(@RequestBody Venue venue) {
        Venue createdVenue = venueService.create(venue);
        return ResponseEntity.ok(createdVenue);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venue> update(@PathVariable Long id, @RequestBody Venue venueDetails) {
        Venue updatedVenue = venueService.update(id, venueDetails);
        if (updatedVenue == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedVenue);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Venue venue = venueService.getById(id);
        if (venue == null) {
            return ResponseEntity.notFound().build();
        }
        venueService.delete(id);
        return ResponseEntity.noContent().build();
    }
}