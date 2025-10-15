package ed.sport_events_api.service;

import ed.sport_events_api.dto.TeamCreateRequest;
import ed.sport_events_api.exception.ResourceNotFoundException;
import ed.sport_events_api.exception.UnauthorizedException;
import ed.sport_events_api.model.Team;
import ed.sport_events_api.model.TeamMember;
import ed.sport_events_api.model.User;
import ed.sport_events_api.repository.TeamMemberRepository;
import ed.sport_events_api.repository.TeamRepository;
import ed.sport_events_api.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final AuthServiceImpl authService;


    public TeamServiceImpl(TeamRepository teamRepository, UserRepository userRepository, TeamMemberRepository teamMemberRepository, AuthServiceImpl authService) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.authService = authService;
    }

    @Override
    @Transactional(readOnly = true)
    public Team getTeamById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Team> getAllTeams(Pageable pageable) {
        return teamRepository.findAll(pageable);
    }

    @Override
    public Team updateTeam(Long id, Team teamDetails) {
        Team team = getTeamById(id);

        team.setName(teamDetails.getName());
        team.setLogoUrl(teamDetails.getLogoUrl());

        if (teamDetails.getCaptain() != null &&
                (team.getCaptain() == null || !teamDetails.getCaptain().getId().equals(team.getCaptain().getId()))) {
            User captain = userRepository.findById(teamDetails.getCaptain().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден: " + teamDetails.getCaptain().getId()));
            team.setCaptain(captain);
        }

        return teamRepository.save(team);
    }

    @Override
    public void deleteTeam(Long id) {
        Team team = getTeamById(id);
        teamRepository.delete(team);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return teamRepository.existsById(id);
    }

    @Transactional
    public Team joinTeam(Long teamId, String token) {
        // Получаем текущего пользователя из токена
        User user = authService.getCurrentUser(token);

        // Получаем команду
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Team not found with id: " + teamId));

        // Проверяем, что пользователь еще не в команде
        boolean isAlreadyMember = teamMemberRepository.existsByTeamAndUser(team, user);
        if (isAlreadyMember) {
            throw new IllegalStateException("User is already a member of this team");
        }

        // Создаем запись TeamMember
        TeamMember teamMember = new TeamMember();
        teamMember.setTeam(team);
        teamMember.setUser(user);
        teamMember.setJoinDate(LocalDateTime.now());
        teamMember.setRole("Представитель");

        teamMemberRepository.save(teamMember);

        // Обновляем список членов команды
        team.getMembers().add(teamMember);
        return teamRepository.save(team);
    }

    @Transactional
    public Team leaveTeam(Long teamId, String token) {
        // Получаем текущего пользователя из токена
        User user = authService.getCurrentUser(token);

        // Получаем команду
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        // Проверяем, что пользователь является участником команды
        TeamMember teamMember = teamMemberRepository.findByTeamAndUser(team, user)
                .orElseThrow(() -> new IllegalStateException("User is not a member of this team"));

        // Проверяем, что пользователь не капитан (капитан не может просто выйти)
        if (team.getCaptain() != null && team.getCaptain().getId().equals(user.getId())) {
            throw new IllegalStateException("Captain cannot leave the team directly. Transfer captaincy first.");
        }

        // Удаляем пользователя из команды
        teamMemberRepository.delete(teamMember);

        // Обновляем список участников команды
        team.getMembers().remove(teamMember);

        return teamRepository.save(team);
    }

    public Team createTeamWithCaptain(TeamCreateRequest request) {
        // Находим капитана
        User captain = userRepository.findById(request.getCaptainId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getCaptainId()));

        // Создаем команду
        Team team = new Team();
        team.setName(request.getName());
        team.setLogoUrl(request.getLogoUrl());

        // Сохраняем команду
        Team savedTeam = teamRepository.save(team);

        // Устанавливаем капитана
        savedTeam.setCaptain(captain);
        teamRepository.save(savedTeam);

        // Добавляем капитана в участники команды
        TeamMember teamMember = new TeamMember();
        teamMember.setUser(captain);
        teamMember.setTeam(savedTeam);
        teamMember.setRole("Капитан");
        teamMember.setJoinDate(LocalDateTime.now());
        teamMemberRepository.save(teamMember);

        return savedTeam;
    }
}