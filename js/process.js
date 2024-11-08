let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let playerScore = 0;
let winStreak = 0;
let wins = 0;
let draws = 0;
let losses = 0;
let playerTurn = true; // ตัวแปรสำหรับควบคุมการเลือก

function playerMove(cellIndex) {
    if (!gameActive || !playerTurn || board[cellIndex - 1] !== '') return;

    board[cellIndex - 1] = 'X';
    document.getElementById(`cell${cellIndex}`).textContent = 'X';

    // เรียกใช้ highlightWinningCells โดยระบุผู้ชนะ
    if (checkWinner('X')) {
        updateScore(1);
        document.getElementById('status').textContent = `Player X wins!`;
        wins++;
        updateStats();
        highlightWinningCells(checkWinner('X'), 'X'); // ไฮไลท์ช่องที่ชนะของผู้เล่น
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== '')) {
        draws++;
        updateStats();
        document.getElementById('status').textContent = 'It\'s a draw!';
        gameActive = false;
        return;
    }

    playerTurn = false; // เปลี่ยนเป็นรอบของบอท
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
        highlightWinningCells(checkWinner('O'), 'O'); // ไฮไลท์ช่องที่ชนะของบอท
        gameActive = false;
        return;
    } else if (board.every(cell => cell !== '')) {
        draws++;
        updateStats();
        document.getElementById('status').textContent = 'It\'s a draw!';
        gameActive = false;
    } else {
        playerTurn = true; // กลับไปให้ผู้เล่นเลือก
        document.getElementById('status').textContent = `Player X's turn`;
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
            alert("Bonussssssssssss");
        }
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
    document.getElementById('status').textContent = `Player X's turn`;

    for (let i = 1; i <= 9; i++) {
        const cell = document.getElementById(`cell${i}`);
        cell.textContent = '';
        cell.classList.remove('highlight-player'); // ลบไฮไลท์ของผู้เล่น
        cell.classList.remove('highlight-bot'); // ลบไฮไลท์ของบอท
    }
}