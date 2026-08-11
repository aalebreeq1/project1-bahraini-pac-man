// The Maze 2D array: 0 = path, 1 = wall, 2 = player spawn, 3 = enemy path, 4 = date, 5 = fish
const initialMaze = [
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
];

const theMaze = initialMaze.map((row) => [...row]);

// Cache the maze container element from the HTML
const containerElement = document.querySelector("#maze-container");
const resetButton = document.querySelector("#reset-btn");
const scoreElement   = document.querySelector("#score-board");

// Player default position based on the maze array (row, column)
const playerPos = { r: 1, c: 1 };
const enemyPos = { r: 6, c: 9 };
let enemyInterval = null;

// Empty array to store references of all rendered tiles
const tileElements = [];

let score = 0;
const item1_score = 10;
const item2_score = 20;
let isGameOver = false;

// Function to dynamically build and render the maze based on the 2D array
function drawMaze() {
    if (!containerElement) {
        console.error("Error: #maze-container element not found in HTML.");
        return;
    }

    containerElement.innerHTML = "";
    tileElements.length = 0;

    for (let r = 0; r < theMaze.length; r++) {
        tileElements[r] = [];

        for (let c = 0; c < theMaze[r].length; c++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");

            const cellType = theMaze[r][c];

            if (cellType === 1) {
                tile.classList.add("wall");
            }
            else if (cellType === 2) {
                tile.classList.add("path", "player-spawn");
                const player = document.createElement("img");
                player.src = "assets/pac-man.png";
                player.classList.add("player");
                tile.appendChild(player);
            }
            else if (cellType === 3) {
                tile.classList.add("path", "enemy-path");
                const ghost = document.createElement("img");
                ghost.src = "assets/ghost.png";
                ghost.classList.add("ghost");
                tile.appendChild(ghost);
            }
            else if (cellType === 4) {
                tile.classList.add("path", "date");
                const date = document.createElement("img");
                date.src = "assets/date-item1.png";
                date.classList.add("date");
                tile.appendChild(date);
            }
            else if (cellType === 5) {
                tile.classList.add("path", "fish");
                const fish = document.createElement("img");
                fish.src = "assets/fish.png";
                fish.classList.add("fish");
                tile.appendChild(fish);
            }
            else {
                tile.classList.add("path");
            }

            tileElements[r][c] = tile;
            containerElement.appendChild(tile);
        }
    }
}

function removePlayerFromTile(tile) {
    if (!tile) return;

    const player = tile.querySelector(".player");
    if (player) {
        tile.removeChild(player);
    }
}



function removeItemFromTile(tile) {
    if (!tile) return;

    const item = tile.querySelector(".date, .fish");
    if (item) {
        tile.removeChild(item);
    }
}

function isVaildMove(newR, newC) {
    if (newR < 0 || newR >= theMaze.length || newC < 0 || newC >= theMaze[0].length) {
        return false;
    }

    return theMaze[newR][newC] !== 1;
}

function updatePlayerPosition(newR, newC) {
    if (!isVaildMove(newR, newC)) {
        return;
    }

    const oldRow = playerPos.r;
    const oldCol = playerPos.c;
    const oldTile = tileElements[oldRow][oldCol];

    removePlayerFromTile(oldTile);

    const targetTile = tileElements[newR][newC];
    const cellType = theMaze[newR][newC];

    if (cellType === 4) {
        theMaze[newR][newC] = 0;
        score += item1_score;
        removeItemFromTile(targetTile);
        scoreElement.textContent = Number(score);
    }
    else if (cellType === 5) {
        theMaze[newR][newC] = 0;
        score += item2_score;
        removeItemFromTile(targetTile);
        scoreElement.textContent = Number(score);
    }

    playerPos.r = newR;
    playerPos.c = newC;

    removePlayerFromTile(targetTile);
    const player = document.createElement("img");
    player.src = "assets/pac-man.png";
    player.classList.add("player");
    targetTile.appendChild(player);
}

function removeEnemyFromTile(tile) {
    if (!tile) return;

    const enemy = tile.querySelector(".ghost");
    if (enemy) {
        tile.removeChild(enemy);
    }
}

function handleKeyPress(event) {
    let newR = playerPos.r;
    let newC = playerPos.c;
    const key = event.key;

    if (key === "ArrowUp" || key === "w" || key === "W") {
        newR--;
    }
    else if (key === "ArrowDown" || key === "s" || key === "S") {
        newR++;
    }
    else if (key === "ArrowLeft" || key === "a" || key === "A") {
        newC--;
    }
    else if (key === "ArrowRight" || key === "d" || key === "D") {
        newC++;
    }
    else {
        return;
    }

    event.preventDefault();
    updatePlayerPosition(newR, newC);
}

// function moveEnemy() {
//     const directions = [
//         { r: -1, c: 0 },
//         { r: 1, c: 0 },
//         { r: 0, c: -1 },
//         { r: 0, c: 1 }
//     ];

// }

function resetGame() {
    for (let r = 0; r < initialMaze.length; r++) {
        for (let c = 0; c < initialMaze[r].length; c++) {
            theMaze[r][c] = initialMaze[r][c];
        }
    }

    score = 0;
    isGameOver = false;
    playerPos.r = 1;
    playerPos.c = 1;
    drawMaze();
}

drawMaze();
resetButton.addEventListener("click", resetGame);
document.addEventListener("keydown", handleKeyPress);

