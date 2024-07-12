-- 데이터베이스 생성 및 사용
CREATE DATABASE IF NOT EXISTS mydb;
USE mydb;

-- players_info_pitcher 테이블 생성
CREATE TABLE IF NOT EXISTS players_info_pitcher (
    player_id INTEGER PRIMARY KEY,
    player_name VARCHAR(255),
    team VARCHAR(255),
    birth DATE,
    game_count INTEGER,
    hand VARCHAR(255), -- 우투우타, 좌투좌타 등..
    uni_num INTEGER -- 등번호
);

-- players_info_hitter 테이블 생성
CREATE TABLE IF NOT EXISTS players_info_hitter (
    player_id INTEGER PRIMARY KEY,
    player_name VARCHAR(255),
    team VARCHAR(255),
    birth DATE,
    game_count INTEGER,
    hand VARCHAR(255), -- 우투우타, 좌투좌타 등..
    uni_num INTEGER -- 등번호
);

-- players_record_pitcher 테이블 생성
CREATE TABLE IF NOT EXISTS players_record_pitcher (
    record_id INTEGER PRIMARY KEY,
    player_id INTEGER,
    player_name VARCHAR(255),
    team VARCHAR(255),
    season INTEGER,
    game_count INTEGER,
    era DOUBLE, -- 평균자책점
    win INTEGER, -- 승수
    lose INTEGER, -- 패수
    sv INTEGER, -- 세이브 수
    hld INTEGER, -- 홀드 수
    ip INTEGER, -- 이닝 수
    hr INTEGER, -- 피홈런 수
    bb INTEGER, -- 볼넷 수
    hbp INTEGER, -- 사구 수
    so INTEGER, -- 삼진 수
    run INTEGER, -- 실점
    er INTEGER, -- 자책점
    whip INTEGER, -- 이닝당 출루 허용률
    wpct DOUBLE, -- 승률
    FOREIGN KEY (player_id) REFERENCES players_info_pitcher(player_id)
);

-- players_record_hitter 테이블 생성
CREATE TABLE IF NOT EXISTS players_record_hitter (
    record_id INTEGER PRIMARY KEY,
    player_id INTEGER,
    player_name VARCHAR(255),
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
    sba INTEGER, -- 도루 시도
    sb INTEGER, -- 도루 성공
    sb_percent DOUBLE, -- 도루성공률
    FOREIGN KEY (player_id) REFERENCES players_info_hitter(player_id)
);

-- users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    user_name VARCHAR(255),
    user_password VARCHAR(255),
    user_role VARCHAR(50), -- manager, player, guest
    player_id INTEGER DEFAULT -1,
    player_code INTEGER DEFAULT -1, -- [1 : pitcher / 2 : hitter / 3 : both]
    team_name VARCHAR(255) DEFAULT NULL,
    team_id INTEGER DEFAULT -1,
    created_at TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players_info_pitcher(player_id),
    FOREIGN KEY (player_id) REFERENCES players_info_hitter(player_id)
);

-- team 테이블 생성
CREATE TABLE IF NOT EXISTS team (
    id INTEGER PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(50), -- manager, player, guest
    created_at TIMESTAMP
);

-- notices 테이블 생성
CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255),
    body TEXT, -- Content of the post
    user_id INTEGER,
    status VARCHAR(50),
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 관계 설정
ALTER TABLE players_record_pitcher
ADD CONSTRAINT fk_players_info_pitcher
FOREIGN KEY (player_id) REFERENCES players_info_pitcher(player_id);

ALTER TABLE players_record_hitter
ADD CONSTRAINT fk_players_info_hitter
FOREIGN KEY (player_id) REFERENCES players_info_hitter(player_id);

ALTER TABLE users
ADD CONSTRAINT fk_users_pitcher
FOREIGN KEY (player_id) REFERENCES players_info_pitcher(player_id);

ALTER TABLE users
ADD CONSTRAINT fk_users_hitter
FOREIGN KEY (player_id) REFERENCES players_info_hitter(player_id);
