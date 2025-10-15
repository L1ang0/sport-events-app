package ed.sport_events_api.model;

import ed.sport_events_api.model.enums.EventStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events_t")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private LocalDateTime creationDate;
    private String icon_url;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    private String result;

    @ManyToOne
    @JoinColumn(name = "sport_type_id")
    private SportType sportType;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private User organizer;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "event_spectators",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> spectators;

    @ManyToMany (cascade = CascadeType.ALL)
    @JoinTable(
            name = "event_players",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> players;
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "event_referees",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> referees = new ArrayList<>();
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(20) default 'CREATED'")
    private EventStatus status = EventStatus.CREATED;

    @ManyToOne
    @JoinColumn(name = "venue_id")
    private Venue venue;

    public Event(Long id, String title, String description, LocalDateTime creationDate, String icon_url, LocalDateTime startDate, LocalDateTime endDate, String result, SportType sportType, User organizer, List<User> spectators, List<User> players, List<User> referees, EventStatus status, Venue venue) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.creationDate = creationDate;
        this.icon_url = icon_url;
        this.startDate = startDate;
        this.endDate = endDate;
        this.result = result;
        this.sportType = sportType;
        this.organizer = organizer;
        this.spectators = spectators;
        this.players = players;
        this.referees = referees;
        this.status = status;
        this.venue = venue;
    }

    public String getIcon_url() {
        return icon_url;
    }

    public void setIcon_url(String icon_url) {
        this.icon_url = icon_url;
    }

    public List<User> getReferees() {
        return referees;
    }

    public void setReferees(List<User> referees) {
        this.referees = referees;
    }

    public Event() {
        this.creationDate = LocalDateTime.now();
    }


    public List<User> getPlayers() {
        return players;
    }

    public void setPlayers(List<User> players) {
        this.players = players;
    }

    public List<User> getSpectators() {
        return spectators;
    }

    public void setSpectators(List<User> spectators) {
        this.spectators = spectators;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    @Override
    public String toString() {
        return "Event{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", sportType=" + sportType +
                ", organizer=" + organizer +
                ", status=" + status +
                '}';
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public SportType getSportType() {
        return sportType;
    }

    public void setSportType(SportType sportType) {
        this.sportType = sportType;
    }

    public User getOrganizer() {
        return organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }
}
