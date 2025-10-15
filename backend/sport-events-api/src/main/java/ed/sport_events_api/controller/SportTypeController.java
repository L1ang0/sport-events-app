package ed.sport_events_api.controller;

import ed.sport_events_api.service.SportTypeService;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sport-types")
@CrossOrigin(origins = "http://localhost:3000")
public class SportTypeController {
    private final SportTypeService sportTypeService;

    public SportTypeController(SportTypeService sportTypeService) {
        this.sportTypeService = sportTypeService;
    }

    @GetMapping
    public ResponseEntity<?> getAll(){
        return new ResponseEntity<>(sportTypeService.getAll(), HttpStatusCode.valueOf(200));
    }
}
