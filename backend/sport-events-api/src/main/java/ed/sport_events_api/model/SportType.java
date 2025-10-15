package ed.sport_events_api.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import ed.sport_events_api.model.enums.SportCategory;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "sport_types")
public class SportType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Например: "Футбол", "Шахматы", "Бег 10 км"

    @Enumerated(EnumType.STRING)
    private SportCategory category; // Индивидуальный, командный, смешанный

    @Column(columnDefinition = "TEXT")
    private String rules; // Правила в формате JSON или текста

    private String iconUrl; // Иконка для UI
    private Integer minPlayers; // Минимальное число участников
    private Integer maxPlayers; // Максимальное (для команд — игроков в команде)

    public SportType() {
    }

    public SportType(Long id, String name, SportCategory category, String rules, String iconUrl, Integer minPlayers, Integer maxPlayers) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.rules = rules;
        this.iconUrl = iconUrl;
        this.minPlayers = minPlayers;
        this.maxPlayers = maxPlayers;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SportCategory getCategory() {
        return category;
    }

    public void setCategory(SportCategory category) {
        this.category = category;
    }

    public String getRules() {
        return rules;
    }

    public void setRules(String rules) {
        this.rules = rules;
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public Integer getMinPlayers() {
        return minPlayers;
    }

    public void setMinPlayers(Integer minPlayers) {
        this.minPlayers = minPlayers;
    }

    public Integer getMaxPlayers() {
        return maxPlayers;
    }

    public void setMaxPlayers(Integer maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }

    @OneToMany(mappedBy = "sportType")
    @JsonIgnore
    private List<Event> events; // События этого типа
}

