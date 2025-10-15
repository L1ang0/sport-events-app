package ed.sport_events_api.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications_t")
public class Notification {
   @Id
   @GeneratedValue (strategy = GenerationType.IDENTITY)
   Long id;

   private String topic;
   private String message;
   private Boolean isRead = false;
   private LocalDateTime creationDate;

   public Notification() {
      LocalDateTime.now();
   }

   public Notification(String topic, String message) {
      this.topic = topic;
      this.message = message;
      this.creationDate = LocalDateTime.now();
   }

   public LocalDateTime getCreationDate() {
      return creationDate;
   }

   public void setCreationDate(LocalDateTime creationDate) {
      this.creationDate = creationDate;
   }

   public Boolean getRead() {
      return isRead;
   }

   public void setRead(Boolean read) {
      isRead = read;
   }

   public Long getId() {
      return id;
   }

   public void setId(Long id) {
      this.id = id;
   }

   public String getTopic() {
      return topic;
   }

   public void setTopic(String topic) {
      this.topic = topic;
   }

   public String getMessage() {
      return message;
   }

   public void setMessage(String message) {
      this.message = message;
   }
}
