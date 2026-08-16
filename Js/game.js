// The Maze 2D array: 0 = path, 1 = wall, 2 = player spawn, 3 = enemy path, 4 = date, 5 = fish
const theMaze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 4, 4, 4, 4, 5, 1, 5, 4, 4, 4, 4, 4, 4, 5, 4, 1],
    [1, 4, 1, 1, 1, 4, 1, 1, 1, 4, 1, 1, 1, 4, 1, 1, 4, 1],
    [1, 4, 1, 4, 4, 4, 4, 4, 1, 4, 4, 4, 1, 4, 4, 4, 4, 1],
    [1, 4, 1, 4, 1, 1, 1, 4, 1, 1, 1, 4, 1, 1, 1, 4, 1, 1],
    [1, 4, 4, 4, 5, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 1],
    [1, 1, 1, 1, 4, 1, 1, 1, 1, 3, 1, 1, 1, 1, 4, 1, 4, 1],
    [1, 4, 5, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 1, 4, 1],
    [1, 4, 4, 4, 4, 5, 4, 1, 4, 4, 4, 4, 4, 4, 5, 5, 4, 1],
    [1, 5, 1, 1, 1, 4, 1, 1, 1, 4, 1, 1, 1, 4, 1, 1, 4, 1],
    [1, 4, 1, 4, 4, 4, 4, 5, 1, 4, 4, 4, 1, 4, 5, 4, 4, 1],
    [1, 4, 4, 5, 4, 4, 5, 4, 4, 4, 5, 4, 4, 4, 4, 4, 5, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
] 
const initialMaze = theMaze.map(row => [...row]) 



// Cache the maze container element from the HTML
const containerElement = document.querySelector("#maze-container") 
const resetButton = document.querySelector("#reset-btn") 
const scoreElement = document.querySelector("#score-board") 
const timerElement = document.querySelector("#time-board") 
const overlayElement = document.querySelector("#overlay") 
const finalScoreElement = document.querySelector("#final-score") 
const finalTimeElement = document.querySelector("#final-time") 
const messageElement = document.querySelector("#message") 


// Player default position based on the maze array (row, column)
const playerPos = { r: 1, c: 1 } 
const enemyPos = { r: 6, c: 9 } 
let enemyInterval = null 
let timerInterval = null 
let time = 0 

// Empty array to store references of all rendered tiles
const tileElements = [] 

let score = 0 
const item1_score = 10 
const item2_score = 20 
let isGameOver = false 

// Function to dynamically build and render the maze based on the 2D array
function drawMaze() {
    if (!containerElement) {
        console.error("Error: #maze-container element not found in HTML.") 
        return 
    }

    containerElement.innerHTML = "" 
    tileElements.length = 0 

    for (let r = 0 ; r < theMaze.length ; r++) {
        tileElements[r] = [] 

        for (let c = 0 ; c < theMaze[r].length ; c++) {
            const tile = document.createElement("div") 
            tile.classList.add("tile") 

            const cellType = theMaze[r][c] 

            if (cellType === 1) {
                tile.classList.add("wall") 
            }
            else if (cellType === 2) {
                tile.classList.add("path", "player-spawn") 
                const player = document.createElement("img") 
                player.src = "assets/pac-man.png" 
                player.classList.add("player") 
                tile.appendChild(player) 
            }
            else if (cellType === 3) {
                tile.classList.add("path", "enemy-path") 
                const ghost = document.createElement("img") 
                ghost.src = "assets/ghost.png" 
                ghost.classList.add("ghost") 
                tile.appendChild(ghost) 
            }
            else if (cellType === 4) {
                tile.classList.add("path", "date") 
                const date = document.createElement("img") 
                date.src = "assets/date-item1.png" 
                date.classList.add("date") 
                tile.appendChild(date) 
            }
            else if (cellType === 5) {
                tile.classList.add("path", "fish") 
                const fish = document.createElement("img") 
                fish.src = "assets/fish.png" 
                fish.classList.add("fish") 
                tile.appendChild(fish) 
            }
            else {
                tile.classList.add("path") 
            }

            tileElements[r][c] = tile 
            containerElement.appendChild(tile) 
        }
    }
}

function removePlayerFromTile(tile) {
    if (!tile) return 

    const player = tile.querySelector(".player") 
    if (player) {
        tile.removeChild(player) 
    }
}



function removeItemFromTile(tile) {
    if (!tile) return 

    const item = tile.querySelector(".date, .fish") 
    if (item) {
        tile.removeChild(item) 
    }
}

function isVaildMove(newR, newC) {
    if (newR < 0 || newR >= theMaze.length || newC < 0 || newC >= theMaze[0].length) {
        return false 
    }

    return theMaze[newR][newC] !== 1 
}

function updatePlayerPosition(newR, newC) {
    if (!isVaildMove(newR, newC)) {
        return 
    }

    const oldRow = playerPos.r 
    const oldCol = playerPos.c 
    const oldTile = tileElements[oldRow][oldCol] 

    removePlayerFromTile(oldTile) 

    const targetTile = tileElements[newR][newC] 
    const cellType = theMaze[newR][newC] 

    if (cellType === 4) {
        theMaze[newR][newC] = 0 
        score += item1_score 
        removeItemFromTile(targetTile) 
        scoreElement.textContent = Number(score) 
    }
    else if (cellType === 5) {
        theMaze[newR][newC] = 0 
        score += item2_score 
        removeItemFromTile(targetTile) 
        scoreElement.textContent = Number(score) 
    }

    playerPos.r = newR 
    playerPos.c = newC 

    removePlayerFromTile(targetTile) 
    const player = document.createElement("img") 
    player.src = "assets/pac-man.png" 
    player.classList.add("player") 
    targetTile.appendChild(player) 

    checkGameOver() 
    if (isGameOver) return 

    winGame() 
}

function removeEnemyFromTile(tile) {
    if (!tile) return 

    const enemy = tile.querySelector(".ghost") 
    if (enemy) {
        tile.removeChild(enemy) 
    }
}

function handleKeyPress(event) {
    let newR = playerPos.r 
    let newC = playerPos.c 
    const key = event.key 

    if (key === "ArrowUp" || key === "w" || key === "W") {
        newR-- 
    }
    else if (key === "ArrowDown" || key === "s" || key === "S") {
        newR++ 
    }
    else if (key === "ArrowLeft" || key === "a" || key === "A") {
        newC-- 
    }
    else if (key === "ArrowRight" || key === "d" || key === "D") {
        newC++ 
    }
    else {
        return 
    }

    event.preventDefault() 
    updatePlayerPosition(newR, newC) 
}

function checkGameOver() {
    if (playerPos.r === enemyPos.r && playerPos.c === enemyPos.c) {
        isGameOver = true 
        clearInterval(enemyInterval) 
        clearInterval(timerInterval) 
        overlayElement.style.display = "flex" 
        messageElement.textContent = "lose!" 
        finalScoreElement.textContent = `${score} XP` 
        finalTimeElement.textContent = time + " seconds" 
    }

}

function winGame() {
    const hasItemsLeft = theMaze.some(row => row.some(cell => cell === 4 || cell === 5)) 
    if (!hasItemsLeft) {
        clearInterval(enemyInterval) 

        overlayElement.style.display = "flex" 
        messageElement.textContent = "You Win!" 
        finalScoreElement.textContent = score +"XP"
        finalTimeElement.textContent = time + " seconds" 

    }
}

function updateEnemyPosition() {
    const directions = [
        { r: -1, c: 0 },
        { r: 1, c: 0 },
        { r: 0, c: -1 },
        { r: 0, c: 1 }
    ] 

    const validMoves = directions.filter(d => isVaildMove(enemyPos.r + d.r, enemyPos.c + d.c)) 
    if (validMoves.length === 0) {
        return 
    }

    const randomDirection = validMoves[Math.floor(Math.random() * validMoves.length)] 
    const oldTile = tileElements[enemyPos.r][enemyPos.c] 
    removeEnemyFromTile(oldTile) 
    enemyPos.r += randomDirection.r 
    enemyPos.c += randomDirection.c 
    const newTile = tileElements[enemyPos.r][enemyPos.c] 
    const ghost = document.createElement("img") 
    ghost.src = "assets/ghost.png" 
    ghost.classList.add("ghost") 
    newTile.prepend(ghost) 
    checkGameOver() 

}

function resetGame() {
    clearInterval(enemyInterval) 
    clearInterval(timerInterval) 

    for (let r = 0 ; r < theMaze.length ; r++) {
        for (let c = 0 ; c < theMaze[r].length  ;c++) {
            theMaze[r][c] = initialMaze[r][c] 
        }
    }

    score = 0 
    scoreElement.textContent = Number(0) 
    isGameOver = false 
    time = 0 
    timerElement.textContent = Number(0) 
    overlayElement.style.display = "none" 
    enemyPos.r = 6 
    enemyPos.c = 9 
    playerPos.r = 1 
    playerPos.c = 1 

    drawMaze() 
    enemyInterval = setInterval(updateEnemyPosition, 750) 
    startTimer() 
}
window.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-audio') 
    const muteBtn = document.getElementById('mute-btn') 
    if (audio) {
        audio.volume = 0.3 
        audio.loop = true 
        audio.play().catch(() => {
        }) 
    }

    if (audio && muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().catch(() => {
                }) 
                muteBtn.style.backgroundImage = "url('assets/sound-on.png')" 
            }
            else {
                audio.pause() 
                muteBtn.style.backgroundImage = "url('assets/sound-off.png')" 
            }
        }) 
    }


}) 
function startTimer() {
    clearInterval(timerInterval) 
    time = 0 
    timerElement.textContent = Number(time) 

    timerInterval = setInterval(() => {
        time++ 
        timerElement.textContent = time 
    }, 1000) 
}
function startGame() {
    drawMaze() 
    startTimer() 
    enemyInterval = setInterval(updateEnemyPosition, 750) 
    resetButton.addEventListener("click", resetGame) 
    document.addEventListener("keydown", handleKeyPress) 
}


startGame() 

