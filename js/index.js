let userName = ''; // ประกาศให้เป็นตัวแปรระดับ global
let score = 0,
    wins = 0,
    draws = 0,
    losses = 0,
    winStreak = 0;

window.onload = function () {
    const userLoggedIn = localStorage.getItem('userLoggedIn');

    // ถ้ายังไม่ได้เข้าสู่ระบบ, ไปหน้า auth.html
    if (!userLoggedIn) {
        window.location.href = 'auth.html';
    } else {
        userName = localStorage.getItem('userName'); // ดึง userName จาก Local Storage
        document.getElementById("welcome").innerText = `Welcome back, ${userName}`;
        document.getElementById("login-section").classList.add("hidden");
        document.getElementById("game-container").style.display = "block";
        loadScore();
    }
};

// ฟังก์ชันสำหรับการดึงข้อมูลจาก Local Storage เพื่อแสดงรายชื่อผู้เล่นทางด้านขวา
function displayPlayerStats() {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = ''; // เคลียร์รายชื่อเก่า
    const storedData = JSON.parse(localStorage.getItem('userScores')) || {};

    // ดึงค่า userName เสมอจาก Local Storage
    userName = localStorage.getItem('userName');

    for (const [name, stats] of Object.entries(storedData)) {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');

        // ถ้าชื่อผู้เล่นตรงกับชื่อผู้ใช้งาน ให้เพิ่มคลาส 'highlight' เพื่อไฮไลท์
        if (name === userName) {
            playerDiv.classList.add('highlightPlayer');
        }

        playerDiv.innerHTML = `
          <div class="player-name">${name}</div>
          <div>Score: ${stats.score}</div>
          <div>Wins: ${stats.wins}, Draws: ${stats.draws}, Losses: ${stats.losses}</div>
        `;
        playersList.appendChild(playerDiv);
    }
}



function loadScore() {
    const storedData = JSON.parse(localStorage.getItem('userScores')) || {};
    if (storedData[userName]) {
        const {
            score: savedScore,
            wins: savedWins,
            draws: savedDraws,
            losses: savedLosses
        } = storedData[userName];
        score = savedScore || 0;
        wins = savedWins || 0;
        draws = savedDraws || 0;
        losses = savedLosses || 0;
        updateScoreboard();
    }
    displayPlayerStats();
}

function saveScore() {
    const storedData = JSON.parse(localStorage.getItem('userScores')) || {};
    storedData[userName] = {
        score,
        wins,
        draws,
        losses
    };
    localStorage.setItem('userScores', JSON.stringify(storedData));
    displayPlayerStats();
}

function handleCredentialResponse(response) {
    const userInfo = JSON.parse(atob(response.credential.split('.')[1]));
    userName = userInfo.name;
    document.getElementById("welcome").innerText = `Welcome, ${userName}`;
    document.getElementById("login-section").classList.add("hidden"); // ซ่อนหน้าเข้าสู่ระบบ
    document.getElementById("game-container").style.display = "block"; // แสดงหน้าเกม
    loadScore();
}

let PLAYER = '';
let BOT = '';

function selectSide(playerSymbol, botSymbol) {
    PLAYER = `<i class='${playerSymbol}'></i>`;
    BOT = `<i class='${botSymbol}'></i>`;

    document.getElementById("side-selection").style.display = "none"; // ซ่อนเมนูเลือกฝ่ายหลังจากเลือกแล้ว
    resetGame(); // เริ่มเกมใหม่ด้วยสัญลักษณ์ที่เลือก
}

let board = Array(9).fill(null);
let isPlayerTurn = true;
let isBotMoving = false;

const cells = document.querySelectorAll('.cell');
const scoreDisplay = document.getElementById('score');
const winsDisplay = document.getElementById('wins');
const drawsDisplay = document.getElementById('draws');
const lossesDisplay = document.getElementById('losses');

// ... โค้ดฟังก์ชัน checkWinner, botMove, handlePlayerMove และ updateScoreboard จะเหมือนกับเดิม
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function checkWinner() {
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            cells[a].classList.add('highlight');
            cells[b].classList.add('highlight');
            cells[c].classList.add('highlight');
            return board[a];
        }
    }
    return null;
}

function handlePlayerMove(index) {
    if (board[index] || !isPlayerTurn || isBotMoving) return;
    board[index] = PLAYER;
    cells[index].innerHTML = PLAYER; // ใช้ innerHTML แทน innerText
    isPlayerTurn = false;

    if (checkWinner()) {
        wins++;
        score += 1;
        updateScoreboard();
        saveScore();
        setTimeout(() => {
            alert("You win!");
            resetGame();
        }, 500);
    } else if (board.every(cell => cell !== null)) {
        draws++;
        score += 1;
        updateScoreboard();
        saveScore();
        setTimeout(() => {
            alert("It's a draw!");
            resetGame();
        }, 500);
    } else {
        botMove();
    }
}

function botMove() {
    isBotMoving = true;
    const availableMoves = board
        .map((val, index) => val === null ? index : null)
        .filter(val => val !== null);

    if (availableMoves.length > 0) {
        setTimeout(() => {
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            board[randomMove] = BOT;
            cells[randomMove].innerHTML = BOT; // ใช้ innerHTML แทน innerText
            isBotMoving = false;

            if (checkWinner()) {
                losses++;
                score -= 5;
                updateScoreboard();
                saveScore();
                setTimeout(() => {
                    alert("You lose!");
                    resetGame();
                }, 500);
            } else if (board.every(cell => cell !== null)) {
                draws++;
                score += 1;
                updateScoreboard();
                saveScore();
                setTimeout(() => {
                    alert("It's a draw!");
                    resetGame();
                }, 500);
            } else {
                isPlayerTurn = true;
            }
        }, 500);
    }
}



function updateScoreboard() {
    scoreDisplay.innerText = score;
    winsDisplay.innerText = wins;
    drawsDisplay.innerText = draws;
    lossesDisplay.innerText = losses;
}

let gameOver = false; // ตัวแปรตรวจสอบสถานะเกม

function checkGameStatus() {
    const winner = checkWinner();

    if (winner && !gameOver) {
        gameOver = true;
        setTimeout(() => {
            if (winner === PLAYER) {
                alert('You win!');
                score++;
                winStreak++;
                wins++;

                if (winStreak >= 3) {
                    score++; // บวกคะแนนโบนัสเพียงครั้งเดียวเมื่อชนะแบบติดกันครบ 3 ครั้ง
                    winStreak = 0;
                    alert('Bonus point for winning 3 times in a row!');
                }
            } else {
                alert('You lost!');
                score--;
                winStreak = 0;
                losses++;
            }
            updateScoreboard();
            saveScore(); // บันทึกคะแนนเมื่อจบเกม
            resetGame();
        }, 500);
    } else if (!board.includes(null) && !gameOver) {
        gameOver = true;
        setTimeout(() => {
            alert('Draw!');
            draws++;
            updateScoreboard();
            saveScore(); // บันทึกคะแนนเมื่อจบเกม
            resetGame();
        }, 500);
    } else if (!isPlayerTurn && !gameOver) {
        botMove();
    }
}


function resetGame() {
    board.fill(null);
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('highlight');
    });
    isPlayerTurn = true;
    gameOver = false;
}


cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handlePlayerMove(index));
});

function clearScores() {
    // ลบข้อมูลคะแนนจาก localStorage
    localStorage.removeItem('userScores');

    // รีเซ็ตค่าตัวแปรทั้งหมด
    userName = '';
    score = 0;
    wins = 0;
    draws = 0;
    losses = 0;
    winStreak = 0;

    // แสดงข้อความแจ้งเตือนให้ผู้ใช้ทราบ
    alert('All scores have been cleared.');

    // รีเฟรชการแสดงผล
    displayPlayerStats();
    updateScoreboard();
}
document.getElementById('clear-scores-button').addEventListener('click', clearScores);

//------------------------------------------------------------//
function logout() {
    Swal.fire({
        title: "Are you sure?",
        text: "You want to logout!",
        imageUrl: "assets/img/illustrations/sammy-no-connection.gif",
        imageWidth: 300,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, Logout!",
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("userLoggedIn");
            window.location.reload();
        }
    });
}