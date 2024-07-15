CREATE DATABASE IF NOT EXISTS mydb
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;
USE mydb;

-- team 테이블 생성
CREATE TABLE IF NOT EXISTS team (
    id INTEGER PRIMARY KEY,
    team_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
    created_at int,
    region VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
    manager VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
    timeline text,
    photo text
);

INSERT INTO team (id, team_name, created_at, region, manager, timeline, photo) VALUES
(1, 'kia', 1982, 'busan', 'Manager', '', ''),
(2, 'samsung', 1982, 'daegu', 'Manager', '', ''),
(3, 'doosan', 1982, 'seoul', 'Manager', '', ''),
(4, 'lg', 1982, 'seoul', 'Manager', '', ''),
(5, 'ssg', 2000, 'incheon', 'Manager', '', ''),
(6, 'nc', 2011, 'changwon', 'Manager', '', ''),
(7, 'kt', 2013, 'suwon', 'Manager', '', ''),
(8, 'lotte', 1975, 'busan', 'Manager', '', ''),
(9, 'hanhwa', 1986, 'daejeon', 'Manager', '', ''),
(10, 'heroes', 2008, 'seoul', 'Manager', '', '');

-- players_info_pitcher 테이블 생성
CREATE TABLE IF NOT EXISTS players_info_pitcher (
    player_id INTEGER PRIMARY KEY,
    player_name VARCHAR(255),
    team_id INTEGER,
    birth DATE,
    hand VARCHAR(255), -- 우투우타, 좌투좌타 등..
    uni_num INTEGER, -- 등번호
    FOREIGN KEY (team_id) REFERENCES team(id)
);


-- players_info_hitter 테이블 생성
CREATE TABLE IF NOT EXISTS players_info_hitter (
    player_id INTEGER PRIMARY KEY,
    player_name VARCHAR(255),
    team_id INTEGER,
    birth DATE,
    hand VARCHAR(255), -- 우투우타, 좌투좌타 등..
    uni_num INTEGER, -- 등번호
    FOREIGN KEY (team_id) REFERENCES team(id)
);


INSERT INTO players_info_hitter (player_id, player_name, team_id, birth, hand, uni_num) VALUES
(1, 'doson', 1, '1995-05-19', 'RL', 27),
(2, 'eredia', 5, '1991-01-31', 'LR', 27),
(3, 'geonwoo park', 6, '1990-09-08', 'RR', 37),
(4, 'leiyes', 8, '1994-10-05', 'RS', 29),
(5, 'gyeongmin heo', 3, '1990-08-26', 'RR', 13),
(6, 'seongmoon song', 10, '1996-08-29', 'RL', 24),
(7, 'euiji yang', 3, '1987-06-05', 'RR', 25),
(8, 'doyoung kim', 1, '2003-10-02', 'RR', 5),
(9, 'hyeseong kim', 10, '1999-01-27', 'RL', 3),
(10, 'minwoo park', 6, '1993-02-06', 'RL', 2);


-- players_record_pitcher 테이블 생성
CREATE TABLE IF NOT EXISTS players_record_pitcher (
    record_id INTEGER PRIMARY KEY,
    player_id INTEGER,
    player_name VARCHAR(255),
    team_id INTEGER,
    team VARCHAR(255),
    season INTEGER,
    era DOUBLE, -- 평균자책점
    game_count INTEGER,
    win INTEGER, -- 승수
    lose INTEGER, -- 패수
    sv INTEGER, -- 세이브 수
    hld INTEGER, -- 홀드 수
    ip VARCHAR(255), -- 이닝 수
    hr INTEGER, -- 피홈런 수
    bb INTEGER, -- 볼넷 수
    hbp INTEGER, -- 사구 수
    so INTEGER, -- 삼진 수
    run INTEGER, -- 실점
    er INTEGER, -- 자책점
    whip DOUBLE, -- 이닝당 출루 허용률
    wpct DOUBLE, -- 승률
    FOREIGN KEY (player_id) REFERENCES players_info_pitcher(player_id)
);

-- players_record_hitter 테이블 생성
CREATE TABLE IF NOT EXISTS players_record_hitter (
    record_id INTEGER PRIMARY KEY,
    player_id INTEGER,
    player_name VARCHAR(255),
    team_id INTEGER,
    team VARCHAR(255),
    season INTEGER,
    game_count INTEGER,
    bat_avg DECIMAL(5, 3), -- 타율
    slg DECIMAL(5, 3), -- 출루율
    obp DECIMAL(5, 3), -- 장타율
    ops DECIMAL(5, 3), -- ops
    pa INTEGER, -- 타석
    ab INTEGER, -- 타수
    run INTEGER, -- 득점
    hit INTEGER, -- 안타
    hit_base2 INTEGER, -- 2루타
    hit_base3 INTEGER, -- 3루타
    homerun INTEGER, -- 홈런
    rbi INTEGER, -- 타점
    sac INTEGER, -- 희생번트
    sf INTEGER, -- 희생플라이
    bb INTEGER, -- 볼넷
    so INTEGER, -- 삼진
    risp DECIMAL(5, 3), -- 득점권 타율
    sb INTEGER, -- 도루 성공
    sb_percent DOUBLE, -- 도루성공률
    FOREIGN KEY (player_id) REFERENCES players_info_hitter(player_id)
);

-- users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    user_name VARCHAR(255),
    real_name VARCHAR(255),
    user_password VARCHAR(255),
    user_role VARCHAR(50),
    team_id INTEGER DEFAULT -1,
    created_at TIMESTAMP
);

-- 유저 데이터 삽입
INSERT INTO users VALUES
(1, 'heo', 'gyeongmin heo', 'password', 'player', 3, NOW()),
(2, 'yang', 'euiji yang', 'password', 'player', 3, NOW()),
(3, 'park', 'geonwoo park', 'password', 'player', 6, NOW()),
(4, 'manager', 'manager name', 'password', 'manager', 3, NOW())



-- notices 테이블 생성
CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
    body TEXT, -- Content of the post
    user_id INTEGER,
    status VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);



-- INSERT INTO players_record_hitter (record_id, player_id, player_name, team_id, team, season, game_count, bat_avg, slg, obp, ops, pa, ab, run, hit, hit_base2, hit_base3, homerun, rbi, sac, sf, bb, so, risp, sb, sb_percent) VALUES
-- (1, 1, '도슨', 10, '키움증권고등학교', 2024, 80, 0.363, 0.56, 0.427, 0.987, 363, 325, 64, 118, 30, 2, 10, 48, 0, 1, 32, 47, 0.333, 2, 50),
-- (2, 2, '에레디아', 5, 'SGG상업고등학교', 2024, 79, 0.36, 0.5, 0.397, 0.897, 343, 314, 43, 113, 15, 1, 9, 62, 0, 6, 15, 42, 0.417, 3, 50),
-- (3, 3, '박건우', 6, 'NC특성화고등학교', 2024, 79, 0.354, 0.546, 0.415, 0.961, 325, 291, 52, 103, 21, 1, 11, 46, 0, 2, 30, 49, 0.372, 3, 100),
-- (4, 4, '레이예스', 8, '롯데고등학교', 2024, 83, 0.352, 0.498, 0.392, 0.89, 360, 327, 47, 115, 23, 2, 7, 69, 0, 7, 25, 50, 0.411, 4, 100),
-- (5, 5, '허경민', 3, '두산고등학교', 2024, 73, 0.348, 0.481, 0.412, 0.893, 301, 264, 49, 92, 17, 0, 6, 42, 0, 5, 21, 17, 0.317, 3, 100),
-- (6, 6, '송성문', 10, '키움증권고등학교', 2024, 82, 0.345, 0.507, 0.413, 0.92, 329, 284, 41, 98, 13, 3, 9, 58, 0, 7, 37, 33, 0.364, 7, 100),
-- (7, 7, '양의지', 3, '두산고등학교', 2024, 77, 0.342, 0.507, 0.389, 0.896, 324, 292, 38, 100, 12, 0, 12, 73, 0, 6, 21, 32, 0.448, 2, 100),
-- (8, 8, '김도영', 1, '기아고등학교', 2024, 84, 0.339, 0.613, 0.407, 1.02, 379, 333, 84, 113, 14, 4, 23, 61, 1, 4, 38, 65, 0.318, 27, 90),
-- (9, 9, '김혜성', 10, '키움증권고등학교', 2024, 76, 0.338, 0.518, 0.402, 0.92, 343, 305, 56, 103, 19, 3, 10, 50, 0, 3, 31, 28, 0.392, 20, 83.3),
-- (10, 10, '박민우', 6, 'NC특성화고등학교', 2024, 68, 0.326, 0.455, 0.419, 0.874, 311, 264, 43, 86, 15, 2, 5, 23, 3, 1, 35, 46, 0.238, 22, 81.5),

-- INSERT INTO players_record_pitcher (record_id, player_id, player_name, team_id, team, season, era, game_count, win, lose, sv, hld, ip, hr, bb, hbp, so, run, er, whip, wpct) VALUES
-- (1, 1, '하트', 6, 'NC특성화고등학교', 2024, 2.74, 17, 7, 2, 0, 0, '105', 0.778, 92, 6, 24, 4, 111, 36, 32, 1.1),
-- (2, 2, '네일', 1, '기아고등학교', 2024, 2.86, 18, 8, 2, 0, 0, '107', 0.8, 105, 9, 22, 7, 107, 51, 34, 1.19),
-- (3, 3, '헤이수스', 10, '키움증권고등학교', 2024, 3.14, 18, 10, 5, 0, 0, '103 1/3', 0.667, 91, 10, 28, 8, 107, 42, 36, 1.15),
-- (4, 4, '원태인', 2, '삼성공업고등학교', 2024, 3.16, 16, 7, 4, 0, 0, '91', 0.636, 82, 8, 31, 4, 70, 35, 32, 1.24),
-- (5, 5, '후라도', 10, '키움증권고등학교', 2024, 3.36, 18, 8, 4, 0, 0, '112 1/3', 0.667, 116, 11, 21, 4, 97, 44, 42, 1.22),
-- (6, 6, '곽빈', 3, '두산고등학교', 2024, 3.59, 17, 7, 6, 0, 0, '97 2/3', 0.538, 83, 4, 38, 3, 92, 40, 39, 1.24),
-- (7, 7, '레예스', 2, '삼성공업고등학교', 2024, 3.64, 18, 8, 3, 0, 0, '99', 0.727, 112, 9, 21, 3, 79, 44, 40, 1.34),
-- (8, 8, '윌커슨', 8, '롯데고등학교', 2024, 3.64, 19, 8, 7, 0, 0, '118 2/3', 0.533, 127, 15, 12, 2, 102, 52, 48, 1.17),
-- (9, 9, '류현진', 9, '한화고등학교', 2024, 3.67, 17, 5, 5, 0, 0, '98', 0.5, 107, 5, 21, 1, 83, 48, 40, 1.31),
-- (10, 10, '양현종', 1, '기아고등학교', 2024, 3.81, 17, 6, 3, 0, 0, '101 2/3', 0.667, 102, 12, 22, 4, 72, 45, 43, 1.22),
-- (11, 11, '코너', 2, '삼성공업고등학교', 2024, 3.97, 19, 7, 5, 0, 0, '106 2/3', 0.583, 96, 17, 29, 15, 110, 52, 47, 1.17),
-- (12, 12, '카스타노', 6, 'NC특성화고등학교', 2024, 4.26, 17, 7, 5, 0, 0, '99 1/3', 0.583, 102, 10, 21, 7, 84, 58, 47, 1.24),
-- (13, 13, '엔스', 4, '엘지디지털고등학교', 2024, 4.3, 19, 8, 3, 0, 0, '104 2/3', 0.727, 107, 8, 32, 2, 104, 55, 50, 1.33),
-- (14, 14, '쿠에바스', 7, 'kt인터넷고등학교', 2024, 4.32, 18, 4, 8, 0, 0, '106 1/3', 0.333, 95, 12, 35, 3, 101, 53, 51, 1.22),
-- (15, 15, '김광현', 5, 'ssg상업고등학교', 2024, 4.66, 18, 6, 6, 0, 0, '96 2/3', 0.5, 90, 14, 37, 2, 93, 52, 50, 1.31),
-- (16, 16, '켈리', 4, '엘지디지털고등학교', 2024, 4.68, 18, 4, 8, 0, 0, '107 2/3', 0.333, 123, 13, 24, 5, 63, 63, 56, 1.37),
-- (17, 17, '신민혁', 6, 'NC특성화고등학교', 2024, 5.06, 18, 6, 7, 0, 0, '85 1/3', 0.462, 107, 16, 9, 4, 52, 52, 48, 1.36),
-- (18, 18, '엄상백', 7, 'kt인터넷고등학교', 2024, 5.18, 17, 7, 7, 0, 0, '88 2/3', 0.5, 95, 16, 25, 1, 100, 53, 51, 1.35),
-- (19, 19, '박세웅', 8, '롯데고등학교', 2024, 5.36, 17, 6, 6, 0, 0, '94', 0.5, 113, 6, 33, 5, 67, 63, 56, 1.55);