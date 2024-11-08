let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerScore = 0;
let winStreak = 0;
let wins = 0;
let draws = 0;
let losses = 0;
let playerTurn = true; // ตัวแปรสำหรับควบคุมการเลือก

window.onload = function () {
    // ตรวจสอบว่า userName มีค่าหรือไม่
    const userName = localStorage.getItem('userName');
    if (userName) {
        loadScore();
    } else {
        console.log("No username found in localStorage");
    }
};

function loadScore() {
    const storedData = JSON.parse(localStorage.getItem('userScores')) || {};
    if (storedData[userName]) {
        const {
            playerScore: savedScore,
            wins: savedWins,
            draws: savedDraws,
            losses: savedLosses
        } = storedData[userName];
        playerScore = savedScore || 0;
        wins = savedWins || 0;
        draws = savedDraws || 0;
        losses = savedLosses || 0;
        // updateScoreboard();
    }
    displayPlayerStats();
}
// ฟังก์ชันสำหรับการดึงข้อมูลจาก Local Storage เพื่อแสดงรายชื่อผู้เล่นทางด้านขวา
function displayPlayerStats() {
    // console.log(localStorage.getItem('userScores'));
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = ''; // เคลียร์รายชื่อเก่า

    const storedData = JSON.parse(localStorage.getItem('userScores')) || {};
    const userName = localStorage.getItem('userName'); // ดึงค่า userName จาก LocalStorage
    // เช็คว่ามีข้อมูลผู้เล่นใน storedData หรือไม่
    console.log(Object.keys(storedData).length);
    if (Object.keys(storedData).length > 0) {
        // แสดงปุ่ม Clear Scores
        $("#btnrmScore").show();
    } else {
        // ซ่อนปุ่ม Clear Scores ถ้าไม่มีข้อมูล
        $("#btnrmScore").hide();
    }
    // จัดเรียงผู้เล่นตามคะแนน (จากมากไปน้อย)
    const sortedPlayers = Object.entries(storedData).sort((a, b) => b[1].playerScore - a[1].playerScore);

    // แสดงรายชื่อผู้เล่นที่เรียงแล้ว
    for (const [name, stats] of sortedPlayers) {
        const playerLink = document.createElement('a');
        playerLink.href = '#';
        playerLink.classList.add('list-group-item', 'list-group-item-action');

        // ถ้าชื่อผู้เล่นตรงกับชื่อผู้ใช้งาน ให้เพิ่มคลาส 'highlight' เพื่อไฮไลท์
        if (name === userName) {
            playerLink.classList.add('active');
        }

        playerLink.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h5 class="username">${name}</h5>
                <h5 class="scoreuser">Score ${stats.playerScore}</h5>
            </div>
            <div class="w-100">
                Wins: <span class="wins">${stats.wins}</span> |
                Draws: <span class="draws">${stats.draws}</span> |
                Losses: <span class="losses">${stats.losses}</span>
            </div>
        `;

        playersList.appendChild(playerLink);
    }
    $("#btnrmScore").show();
}


function saveScore() {
    const storedData = JSON.parse(localStorage.getItem('userScores')) || {};
    storedData[userName] = {
        playerScore,
        wins,
        draws,
        losses
    };
    localStorage.setItem('userScores', JSON.stringify(storedData));
    displayPlayerStats();
}

function playerMove(cellIndex) {
    if (!gameActive || !playerTurn || board[cellIndex - 1] !== '') return;

    board[cellIndex - 1] = 'X';
    document.getElementById(`cell${cellIndex}`).textContent = 'X';

    // เรียกใช้ highlightWinningCells โดยระบุผู้ชนะ
    if (checkWinner('X')) {
        updateScore(1);
        document.getElementById('status').textContent = `Player wins!`;
        wins++;
        updateStats();
        saveScore();
        highlightWinningCells(checkWinner('X'), 'X'); // ไฮไลท์ช่องที่ชนะของผู้เล่น
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== '')) {
        draws++;
        updateStats();
        saveScore();
        document.getElementById('status').textContent = 'It\'s a draw!';
        gameActive = false;
        return;
    }

    playerTurn = false; // เปลี่ยนเป็นรอบของบอท
    document.getElementById('status').textContent = `Bot's turn`; // อัปเดตสถานะเป็นตาของบอท
    setTimeout(botMove, 500); // ดีเลย์การเล่นของบอท 0.5 วินาที
}

function botMove() {
    let emptyCells = board.map((cell, idx) => cell === '' ? idx : null).filter(idx => idx !== null);
    if (emptyCells.length === 0) return;

    let botChoice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[botChoice] = 'O';
    document.getElementById(`cell${botChoice + 1}`).textContent = 'O';

    if (checkWinner('O')) {
        updateScore(-1);
        document.getElementById('status').textContent = `Bot wins!`;
        losses++;
        updateStats();
        saveScore();
        highlightWinningCells(checkWinner('O'), 'O'); // ไฮไลท์ช่องที่ชนะของบอท
        gameActive = false;
        return;
    } else if (board.every(cell => cell !== '')) {
        draws++;
        updateStats();
        saveScore();
        document.getElementById('status').textContent = 'It\'s a draw!';
        gameActive = false;
    } else {
        playerTurn = true; // กลับไปให้ผู้เล่นเลือก
        document.getElementById('status').textContent = `Player's turn`; // อัปเดตสถานะเป็นตาของผู้เล่น
    }
}


function checkWinner(player) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // columns
        [0, 4, 8],
        [2, 4, 6] // diagonals
    ];

    for (let pattern of winPatterns) {
        if (pattern.every(index => board[index] === player)) {
            return pattern; // ส่งคืนแพทเทิร์นที่ชนะ
        }
    }
    return null;
}

function updateScore(change) {
    if (change === 1) {
        winStreak++;
        playerScore++;
        if (winStreak === 3) {
            playerScore++; // โบนัสสำหรับการชนะติดต่อกัน 3 ครั้ง
            winStreak = 0; // รีเซ็ตสตรีค
            Swal.fire({
                title: "คุณชนะ 3 ครั้งติดต่อกัน เอาโบนัสไปเลยอีก 1 คะแนน",
                width: 600,
                padding: "3em",
                color: "#716add",
                confirmButtonText: "รับโบนัส 🎉",
                confirmButtonColor: "#716add",
                imageUrl: "assets/img/illustrations/bonus.gif",
                imageHeight: 300,
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("assets/img/illustrations/pixeltrue-giveaway-1.svg")
                  right
                  no-repeat
                `
            });
        }
        saveScore();
    } else {
        winStreak = 0;
        playerScore--;
    }
    $("#score").html(playerScore);
}

function updateStats() {
    document.getElementById('stats').textContent = `Wins: ${wins} | Draws: ${draws} | Losses: ${losses}`;
}

function highlightWinningCells(pattern, player) {
    if (pattern) {
        pattern.forEach(index => {
            const cell = document.getElementById(`cell${index + 1}`);
            // ใช้สีต่างกันระหว่างผู้เล่นและบอท
            if (player === 'X') {
                cell.classList.add('highlight-player'); // สีสำหรับผู้เล่น
            } else {
                cell.classList.add('highlight-bot'); // สีสำหรับบอท
            }
        });
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    playerTurn = true;
    document.getElementById('status').textContent = `Player's turn`;

    for (let i = 1; i <= 9; i++) {
        const cell = document.getElementById(`cell${i}`);
        cell.textContent = '';
        cell.classList.remove('highlight-player'); // ลบไฮไลท์ของผู้เล่น
        cell.classList.remove('highlight-bot'); // ลบไฮไลท์ของบอท
    }


}
//----------------------------------------//
function clearScores() {
    Swal.fire({
        title: "Are you sure you want to clear scores?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, clear it!"
    }).then((result) => {
        if (result.isConfirmed) {
            // ลบข้อมูลคะแนนจาก localStorage
            localStorage.removeItem('userScores');

            // ไม่ต้องรีเซ็ต userName
            // userName = ''; // ไม่ต้องทำการรีเซ็ตค่า userName

            // รีเซ็ตค่าตัวแปรคะแนนและสถิติ
            playerScore = 0;
            wins = 0;
            draws = 0;
            losses = 0;
            winStreak = 0;
            // รีเฟรชการแสดงผล
            displayPlayerStats();
            updateStats();
            // resetGame();
            Swal.fire({
                title: "Cleared!",
                text: "All scores have been cleared.",
                icon: "success"
            });
        }
    });

}