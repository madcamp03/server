require('dotenv').config();
const fs = require('fs');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initializeDatabase } = require('./database/db'); // Adjust the path according to your project structure
//const auth = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


// 초기화 실행
initializeDatabase();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

function parseInnings(innings) {
  const parts = innings.split(' ');
  const wholeInnings = parseInt(parts[0], 10);
  let fractionInnings = 0;

  if (parts.length > 1) {
    if (parts[1] === '1/3') {
      fractionInnings = 1 / 3;
    } else if (parts[1] === '2/3') {
      fractionInnings = 2 / 3;
    }
  }

  return wholeInnings + fractionInnings;
}

function convertDecimalToInningString(decimal) {
  console.log("initial ining " + decimal);
  const wholeInnings = Math.floor(decimal);
  const fractionInnings = decimal - wholeInnings;

  if (fractionInnings.toFixed(3) === '0.333') {
    return `${wholeInnings} 1/3`;
  } else if (fractionInnings.toFixed(3) === '0.666') {
    return `${wholeInnings} 2/3`;
  } else {
    return `${wholeInnings}`;
  }
}

// API Endpoints
// -- test
app.get('/api', async (req, res) => {
  res.send("welcome")
});

// -- login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_name = ? AND user_password = ?', [username, password]);
    if (rows.length > 0) {
      const user = rows[0];
      res.json({
        user_id: user.user_id,
        user_name: user.user_name,
        real_name: user.real_name,
        user_role: user.user_role,
        team_id: user.team_id,
        created_at: user.created_at
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// -- all records : hitter
app.get('/api/hitter/records', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM players_record_hitter');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching players_record_hitter:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// -- all records : pitcher
app.get('/api/pitcher/records', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM players_record_pitcher');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching players_record_hitter:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// -- player details : hitter
app.post('/api/hitter/details', async (req, res) => {
  const { player_id } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM players_info_hitter WHERE player_id = ?', [player_id]);
    if (rows.length > 0) {
      const hitter = rows[0];
      res.json({
        player_name: hitter.player_name,
        birth: hitter.birth,
        player_height: hitter.player_height,
        player_weight: hitter.player_weight,
        career: hitter.career,
        position: hitter.position,
        hand: hitter.hand,
        uni_num: hitter.uni_num
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error during fetching player info:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// -- player details : pitcher
app.post('/api/pitcher/details', async (req, res) => {
  const { player_id } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM players_info_pitcher WHERE player_id = ?', [player_id]);
    if (rows.length > 0) {
      const hitter = rows[0];
      res.json({
        player_name: hitter.player_name,
        birth: hitter.birth,
        player_height: hitter.player_height,
        player_weight: hitter.player_weight,
        career: hitter.career,
        position: hitter.position,
        hand: hitter.hand,
        uni_num: hitter.uni_num
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error during fetching player info:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// API Endpoints
app.post('/api/game/result', async (req, res) => {
  const { game_id } = req.body;

  if (!game_id) {
    return res.status(400).json({ error: 'game_id is required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM game_result WHERE game_id = ?', [game_id]);

    if (rows.length > 0) {
      const gameResult = rows[0];
      res.json(gameResult);
    } else {
      return res.status(404).json({ error: `Game with id ${game_id} not found` });
    }
  } catch (error) {
    console.error('Error fetching game result:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// update game results
app.patch('/api/results/update', async (req, res) => {
  const {
    game_id, 
    winning_pitcher_id, 
    losing_pitcher_id, 
    hold_pitcher_ids, 
    save_pitcher_id, 
    winner_team_id, 
    loser_team_id, 
    winner_team_total_score, 
    winner_team_total_hits, 
    winner_team_total_home_runs, 
    winner_team_total_stolen_bases, 
    winner_team_total_strikeouts, 
    winner_team_total_double_plays, 
    winner_team_total_errors, 
    loser_team_total_score, 
    loser_team_total_hits, 
    loser_team_total_home_runs, 
    loser_team_total_stolen_bases, 
    loser_team_total_strikeouts, 
    loser_team_total_double_plays, 
    loser_team_total_errors, 
    deciding_hit, 
    home_run, 
    hit_base2, 
    hit_base3, 
    game_error, 
    base_running_out, 
    double_play_hit
  } = req.body;

  try {
    const query = `
      UPDATE game_result
      SET
        winning_pitcher_id = ?, 
        losing_pitcher_id = ?, 
        hold_pitcher_ids = ?, 
        save_pitcher_id = ?, 
        winner_team_id = ?, 
        loser_team_id = ?, 
        winner_team_total_score = ?, 
        winner_team_total_hits = ?, 
        winner_team_total_home_runs = ?, 
        winner_team_total_stolen_bases = ?, 
        winner_team_total_strikeouts = ?, 
        winner_team_total_double_plays = ?, 
        winner_team_total_errors = ?, 
        loser_team_total_score = ?, 
        loser_team_total_hits = ?, 
        loser_team_total_home_runs = ?, 
        loser_team_total_stolen_bases = ?, 
        loser_team_total_strikeouts = ?, 
        loser_team_total_double_plays = ?, 
        loser_team_total_errors = ?, 
        deciding_hit = ?, 
        home_run = ?, 
        hit_base2 = ?, 
        hit_base3 = ?, 
        game_error = ?, 
        base_running_out = ?, 
        double_play_hit = ?
      WHERE game_id = ?
    `;

    const values = [
      winning_pitcher_id, 
      losing_pitcher_id, 
      hold_pitcher_ids, 
      save_pitcher_id, 
      winner_team_id, 
      loser_team_id, 
      winner_team_total_score, 
      winner_team_total_hits, 
      winner_team_total_home_runs, 
      winner_team_total_stolen_bases, 
      winner_team_total_strikeouts, 
      winner_team_total_double_plays, 
      winner_team_total_errors, 
      loser_team_total_score, 
      loser_team_total_hits, 
      loser_team_total_home_runs, 
      loser_team_total_stolen_bases, 
      loser_team_total_strikeouts, 
      loser_team_total_double_plays, 
      loser_team_total_errors, 
      deciding_hit, 
      home_run, 
      hit_base2, 
      hit_base3, 
      game_error, 
      base_running_out, 
      double_play_hit, 
      game_id
    ];

    const [result] = await db.query(query, values);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Game result updated successfully' });
    } else {
      res.status(404).json({ error: 'Game result not found' });
    }
  } catch (error) {
    console.error('Error updating game result:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// update player records - hitters
app.patch('/api/hitter/update', async (req, res) => {
  const hitters = req.body.hitters;

  if (!Array.isArray(hitters)) {
    return res.status(400).json({ error: 'Invalid input: hitters should be an array' });
  }

  try {
    for (const hitter of hitters) {
      const { player_id, pa, ab, run, hit, hit_base2, hit_base3, homerun, rbi, sf, bb, so } = hitter;

      const [rows] = await db.query('SELECT * FROM players_record_hitter WHERE player_id = ?', [player_id]);

      if (rows.length > 0) {
        const player = rows[0];
        const new_pa = player.pa + pa;
        const new_ab = player.ab + ab;
        const new_run = player.run + run;
        const new_hit = player.hit + hit;
        const new_hit_base2 = player.hit_base2 + hit_base2;
        const new_hit_base3 = player.hit_base3 + hit_base3;
        const new_homerun = player.homerun + homerun;
        const new_rbi = player.rbi + rbi;
        const new_sf = player.sf + sf;
        const new_bb = player.bb + bb;
        const new_so = player.so + so;

        const new_bat_avg = new_hit / new_ab;
        const new_slg = (new_hit + (2 * new_hit_base2) + (3 * new_hit_base3) + (4 * new_homerun)) / new_ab;
        const new_obp = (new_hit + new_bb + new_sf) / (new_ab + new_bb + new_sf);
        const new_ops = new_obp + new_slg;

        await db.query(
          'UPDATE players_record_hitter SET pa = ?, ab = ?, run = ?, hit = ?, hit_base2 = ?, hit_base3 = ?, homerun = ?, rbi = ?, sf = ?, bb = ?, so = ?, bat_avg = ?, slg = ?, obp = ?, ops = ? WHERE player_id = ?',
          [new_pa, new_ab, new_run, new_hit, new_hit_base2, new_hit_base3, new_homerun, new_rbi, new_sf, new_bb, new_so, new_bat_avg.toFixed(3), new_slg.toFixed(3), new_obp.toFixed(3), new_ops.toFixed(3), player_id]
        );
      } else {
        return res.status(404).json({ error: `Player with id ${player_id} not found` });
      }
    }

    res.status(200).json({ message: 'Player records updated successfully' });
  } catch (error) {
    console.error('Error updating player records:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// update player records - pitchers
app.patch('/api/pitcher/update', async (req, res) => {
  const pitchers = req.body.pitchers;

  if (!Array.isArray(pitchers)) {
    return res.status(400).json({ error: 'Invalid input: pitchers should be an array' });
  }

  try {
    for (const pitcher of pitchers) {
      const { player_id, win, lose, sv, hld, hit, bb, hr, run, so, ip } = pitcher;

      const [rows] = await db.query('SELECT * FROM players_record_pitcher WHERE player_id = ?', [player_id]);

      if (rows.length > 0) {
        const player = rows[0];
        const new_win = player.win + win;
        const new_lose = player.lose + lose;
        const new_sv = player.sv + sv;
        const new_hld = player.hld + hld;
        const new_hit = player.hit + hit;
        const new_bb = player.bb + bb;
        const new_hr = player.hr + hr;
        const new_run = player.run + run;
        const new_so = player.so + so;
        const new_game_count = player.game_count + 1;

        const total_ip = (parseFloat(player.ip.replace(' 2/3', '.666').replace(' 1/3', '.333')) + parseFloat(ip.replace(' 2/3', '.666').replace(' 1/3', '.333'))).toFixed(3);
        const ip_in_decimal = Math.floor(total_ip) + (total_ip % 1).toFixed(3).slice(1);

        const updated_ip = convertDecimalToInningString(ip_in_decimal);

        const new_era = ((player.er + run) / ip_in_decimal) * 9;
        const new_whip = (new_bb + new_hit) / ip_in_decimal;

        await db.query(
          'UPDATE players_record_pitcher SET win = ?, lose = ?, sv = ?, hld = ?, hit = ?, bb = ?, hr = ?, run = ?, so = ?, game_count = ?, ip = ?, era = ?, whip = ? WHERE player_id = ?',
          [new_win, new_lose, new_sv, new_hld, new_hit, new_bb, new_hr, new_run, new_so, new_game_count, updated_ip, new_era.toFixed(2), new_whip.toFixed(2), player_id]
        );
      } else {
        return res.status(404).json({ error: `Player with id ${player_id} not found` });
      }
    }

    res.status(200).json({ message: 'Player records updated successfully' });
  } catch (error) {
    console.error('Error updating player records:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// -------------------------------------------------------------------------------------------------------------------------------
// 매니저가 팀 정보를 업데이트하는 엔드포인트
app.patch('/api/manager/update/team', async (req, res) => {
  const { team_profile_image, team_name, team_home_base, team_coach, team_id } = req.body;

  try {
    // team_id로 팀 정보 검색
    const [rows] = await db.query('SELECT * FROM team WHERE id = ?', [team_id]);

    if (rows.length > 0) {
      // 팀 정보 업데이트
      await db.query('UPDATE team SET photo = ?, team_name = ?, region = ?, manager = ? WHERE id = ?', 
      [team_profile_image, team_name, team_home_base, team_coach, team_id]);

      res.status(200).send({ message: 'Team information updated successfully' });
    } else {
      res.status(404).send({ message: 'Team not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Database error', error });
  }
});


// 매니저가 선수 정보를 업데이트하는 엔드포인트
app.patch('/api/manager/update/player', async (req, res) => {
  const { player_name, position, team_id } = req.body;

  try {
    const [rows] = await db.query('SELECT user_role FROM users WHERE team_id = ? AND user_role = "manager"', [team_id]);

    if (rows.length > 0) {
      // players_info_hitter 업데이트
      await connection.execute(
        'UPDATE players_info_hitter SET position = ? WHERE player_name = ? AND team = ?',
        [position, player_name, team_id]
      );
      res.status(200).send({ message: 'Player info updated successfully' });
    } else {
      res.status(403).send({ message: 'Unauthorized' });
    }

    await connection.end();
  } catch (error) {
    res.status(500).send({ message: 'Database error', error });
  }
});

// 매니저가 팀 소속 선수 목록을 조회하는 엔드포인트
app.post('/api/manager/get/players', async (req, res) => {
  const { team_id } = req.body;

  try {
    const [hitters] = await db.query('SELECT player_name, position FROM players_info_hitter WHERE team_id = ?', [team_id]);
    res.json(hitters);
  } catch (error) {
    res.status(500).send({ message: 'Database error', error });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});