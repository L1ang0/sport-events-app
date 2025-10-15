package ed.sport_events_api.service;

import ed.sport_events_api.exception.AlreadyExistsException;
import ed.sport_events_api.exception.ResourceNotFoundException;
import ed.sport_events_api.model.Venue;
import ed.sport_events_api.repository.VenueRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VenueService {
    private final VenueRepository venueRepository;

    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    public List<Venue> getAll() {
        return venueRepository.findAll();
    }

    public Venue getById(Long id) {
        return venueRepository.findById(id).orElse(null);
    }

    public Venue create(Venue venue) {
        Optional<Venue> newVenue = venueRepository.findByName(venue.getName());
        if (newVenue.isPresent()) {
            throw new AlreadyExistsException("Место проведения уже сущетсвует");
        }
        return venueRepository.save(venue);
    }

    public Venue update(Long id, Venue venueDetails) {
        Venue venue = getById(id);
        if (venue == null) {
            return null;
        }

        venue.setName(venueDetails.getName());
        venue.setAddress(venueDetails.getAddress());
        venue.setDescription(venueDetails.getDescription());
        venue.setCapacity(venueDetails.getCapacity());

        return venueRepository.save(venue);
    }

    public void delete(Long id) {
        venueRepository.deleteById(id);
    }
}