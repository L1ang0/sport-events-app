package ed.sport_events_api.dto;

import ed.sport_events_api.model.enums.EventStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String sportTypeName;
    private Long organizerId;
    private EventStatus status;
}
