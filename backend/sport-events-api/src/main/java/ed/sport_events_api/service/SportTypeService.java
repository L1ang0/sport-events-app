package ed.sport_events_api.service;

import ed.sport_events_api.model.SportType;
import ed.sport_events_api.repository.SportTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SportTypeService {
    private final SportTypeRepository sportTypeRepository;


    public SportTypeService(SportTypeRepository sportTypeRepository) {
        this.sportTypeRepository = sportTypeRepository;
    }

    public List<SportType> getAll(){
        return sportTypeRepository.findAll();
    }
}
