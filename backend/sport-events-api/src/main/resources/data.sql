CREATE DATABASE IF NOT EXISTS `sport-events.db`;

-- Отключаем проверку внешних ключей
SET FOREIGN_KEY_CHECKS = 0;

-- Очистка таблиц (опционально, только для тестов!)
TRUNCATE TABLE `users`;
TRUNCATE TABLE `roles`;
TRUNCATE TABLE `sport_types`;
TRUNCATE TABLE `events_t`;
TRUNCATE TABLE `venues`;
TRUNCATE TABLE `teams`;
TRUNCATE TABLE `team_members`;
TRUNCATE TABLE `user_roles`;
TRUNCATE TABLE `event_spectators`;
TRUNCATE TABLE `event_players`;
TRUNCATE TABLE `event_referees`;

-- Включаем проверку обратно
SET FOREIGN_KEY_CHECKS = 1;

-- Добавляем роли
INSERT INTO `roles` (`name`) VALUES
                                 ('ADMIN'),
                                 ('ORGANIZER'),
                                 ('PLAYER'),
                                 ('REFEREE'),
                                 ('SPECTATOR');

-- Добавляем пользователей
INSERT INTO `users` (`email`, `password`, `name`, `phone`, `avatar_url`) VALUES
                                                                             ('admin', '1', 'Иван Админов', '+3759110000001', 'https://example.com/avatars/1.jpg'),
                                                                             ('organizer', '1', 'Алексей Организатор', '+3759110000002', 'https://example.com/avatars/2.jpg'),
                                                                             ('12345', '12345', '12345', '12345', 'https://example.com/avatars/1.jpg'),
                                                                             ('player', '1', 'Сергей Игроков', '+3759110000003', 'https://example.com/avatars/3.jpg'),
                                                                             ('player1', '1', 'Мария Спортсменова', '+3759110000004', 'https://example.com/avatars/4.jpg'),
                                                                             ('referee', '1', 'Артем Судьин', '+3759110000005', 'https://example.com/avatars/5.jpg');

-- Добавляем связи пользователей с ролями
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
                                                    (1, 1), -- admin
                                                    (2, 2), -- organizer
                                                    (3, 3), -- player
                                                    (4, 3), -- player
                                                    (5, 4), -- referee
                                                    (6, 4); -- referee

-- Добавляем виды спорта
INSERT INTO `sport_types` (`name`, `category`, `rules`, `min_players`, `max_players`, `icon_url`) VALUES
                                                                                                      ('Футбол', 'TEAM', '{"duration": "90 минут", "goals": "3 очка за победу"}', 5, 11, 'https://img.freepik.com/free-photo/soccer-players-action-professional-stadium_654080-1746.jpg?semt=ais_hybrid&w=740'),
                                                                                                      ('Баскетбол', 'TEAM', '{"duration": "48 минут", "points": "2 за попадание"}', 3, 5, 'https://example.com/icons/basketball.png'),
                                                                                                      ('Бег 10 км', 'INDIVIDUAL', '{"distance": "10 км", "timeLimit": "1 час"}', 1, 1, 'https://example.com/icons/running.png'),
                                                                                                      ('Шахматы', 'INDIVIDUAL', '{"timeControl": "5 минут", "format": "рапид"}', 1, 2, 'https://be.m.wikipedia.org/wiki/%D0%A4%D0%B0%D0%B9%D0%BB:Chess_set_of_the_USSR.jpg'),
                                                                                                      ('Волейбол', 'TEAM', '{"sets": "3 до 25 очков", "timeout": "2 на сет"}', 4, 6, 'https://example.com/icons/volleyball.png');

-- Добавляем команды
INSERT INTO `teams` (`name`, `captain_id`, `logo_url`) VALUES
                                                           ('Динамо', 3, 'https://upload.wikimedia.org/wikipedia/ru/4/4e/Dinmin.png'),
                                                           ('Спартак', 4, 'https://static.mk.ru/upload/entities/2021/08/27/14/articles/detailPicture/3c/a3/0c/66/cd2d7cfa8a41fbca0456b441ecbbc8c8.jpg'),
                                                           ('Легенды паркета', 3, 'https://polov.ru/f/articles/parket-istorija-main.jpg'),
                                                           ('Быстрые ласты', 4, 'https://185504.selcdn.ru/static/sportextreme.reshop.by/catalog/2352/lasty-dlya-plavaniya-snap_1_medium.jpg'),
                                                           ('Бегуны', 3, 'https://www.artans.ru/upload/iblock/1b4/g2tfxlev27ffq4iemm4uyo54i6cvr79z/1319_050_000.jpg');

-- Добавляем места проведения
INSERT INTO `venues` (`name`, `address`, `capacity`, `description`, `image_url`) VALUES
                                                                        ('Стадион "Олимпийский"', 'г. Москва, ул. Спортивная, 1', 30000, 'Крупнейший стадион города', 'https://football-stadiums.ru/wp-content/uploads/2023/07/nsk-olimpiyskiy-01.jpg'),
                                                                        ('Парк "Победа"', 'г. Москва, ул. Парковая, 5', 500, 'Живописный парк с беговыми дорожками', 'https://cdn.belarus.travel/Files/park-chelyuskintsev.jpg'),
                                                                        ('Шахматный клуб "Гамбит"', 'г. Москва, ул. Ломоносова, 12', 100, 'Профессиональный шахматный клуб', 'https://p1.zoon.by/preview/6_NNgMO_XpOD29cJ5ElnHg/630x384x85/0/7/5/5722ca0bd37bc9db238b456c_5722ca88b9c47.jpg'),
                                                                        ('Спорткомплекс "Волей"', 'г. Москва, ул. Атлетическая, 7', 2000, 'Современный спортивный комплекс', 'https://skcn.kz/data/media/news/images/497a6e08d9057c3fbf342c82ef1cd457.jpg'),
                                                                        ('Баскетбольный зал "Кольцо"', 'г. Москва, ул. Кольцевая, 15', 1500, 'Специализированный зал для баскетбола', 'https://scmolodezhka.ru/upload/iblock/9ce/7a3umpp6cg02qevlja89bo8hynpkfvo2.jpg');

-- Добавляем события
INSERT INTO `events_t` (`title`, `description`, `start_date`, `end_date`, `organizer_id`, `sport_type_id`, `status`, `venue_id`, `icon_url`, `result`) VALUES
                                                                                                                                                           ('Футбольный турнир', 'Ежегодный турнир среди любителей', '2025-06-01 10:00:00', '2025-06-01 18:00:00', 2, 1, 'CREATED', 1, 'https://r55.ru/wp-content/uploads/2022/05/22-5.png', NULL),
                                                                                                                                                           ('Бег на 10 км', 'Городские соревнования', '2025-07-15 09:00:00', '2025-07-15 12:00:00', 2, 3, 'CREATED', 2, 'https://www.coachray.nz/wp-content/uploads/2022/02/R039.png', NULL),
                                                                                                                                                           ('Шахматный блиц', 'Быстрые шахматы для всех', '2025-05-20 14:00:00', '2025-05-20 16:00:00', 2, 4, 'FINISHED', 3, 'https://kartinkof.club/uploads/posts/2022-09/1662277645_18-kartinkof-club-p-novie-i-krasivie-kartinki-shakhmati-20.jpg', 'Победитель: Иванов А.'),
                                                                                                                                                           ('Волейбольный матч', 'Дружеская встреча', '2025-08-10 17:00:00', '2025-08-10 19:00:00', 2, 5, 'CANCELED', 4, 'https://sport5.by/upload/iblock/d24/3toa4tbfyf2wkq4rir2wxs587hru5s3h.jpg', 'Отменен из-за дождя'),
                                                                                                                                                           ('Баскетбольный чемпионат', 'Лига профессионалов', '2025-09-05 11:00:00', '2025-09-05 15:00:00', 2, 2, 'STARTED', 5, 'https://basket.ru/wp-content/uploads/2023/03/79.jpg', 'Идет игра');

-- Добавляем участников событий
INSERT INTO `event_players` (`event_id`, `user_id`) VALUES
                                                        (1, 3), (1, 4), -- Футбольный турнир
                                                        (2, 3), (2, 4), -- Бег на 10 км
                                                        (3, 3),        -- Шахматный блиц
                                                        (4, 3), (4, 4), -- Волейбольный матч
                                                        (5, 3), (5, 4); -- Баскетбольный чемпионат

-- Добавляем зрителей событий
INSERT INTO `event_spectators` (`event_id`, `user_id`) VALUES
                                                           (1, 6), (1,5), (2, 6), (3, 6), (4, 6), (5, 6);

-- Добавляем судей событий
INSERT INTO `event_referees` (`event_id`, `user_id`) VALUES
                                                         (1, 5), (2, 5), (3, 5), (4, 5), (5, 5);