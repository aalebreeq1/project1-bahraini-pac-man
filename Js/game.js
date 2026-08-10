// The Maze 2D array: 0 = path, 1 = wall, 2 = player spawn, 3 = enemy path
const theMaze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Cache the maze container element from the HTML
const containerElement = document.querySelector("#maze-container");
const resetButton = document.querySelector("#reset-btn");

// Player default position based on the maze array (row, column)
const playerPos = { r: 1, c: 1 };

// empty array to store refrence of all rendered tiles 
const tileElements = [];

// Function to dynamically build and render the maze based on the 2D array
function drawMaze() {
    if (!containerElement) {
        console.error("Error: #maze-container element not found in HTML.");
        return;
    }

    for (let r = 0; r < theMaze.length; r++) {
        tileElements[r] = [];

        for (let c = 0; c < theMaze[r].length; c++) {
            const tile = document.createElement('div');
            // Add the base tile class for CSS styling
            tile.classList.add('tile');

            // Store the value of the current cell
            const cellType = theMaze[r][c];


            // check if its wall "1" or palyer spawn "2" or enemy path "3" or default its palyer path "0"
            if (cellType === 1) {
                tile.classList.add("wall");
            }
            else if (cellType === 2) {
                tile.classList.add("path", "player-spawn");
                const player = document.createElement('img');
                player.src = "assets/pac-man.png";
                player.classList.add("player");
                tile.appendChild(player);
            }
            else if (cellType === 3) {
                tile.classList.add("path", "enemy-path");
                const ghost = document.createElement('img');
                ghost.src = "assets/ghost.png";
                ghost.classList.add("ghost");
                tile.appendChild(ghost);
            }

            else {
                tile.classList.add('path');
            }

            tileElements[r][c] = tile;
            // Append the created tile to the container in the DOM
            containerElement.appendChild(tile);
        }
    }
}


function removePlayerFromTile(tile) {
    if (!tile) return;

    const player = tile.querySelector('.player');
    if (player) {
        tile.removeChild(player);
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

    const oldTile = tileElements[playerPos.r][playerPos.c];
    removePlayerFromTile(oldTile);

    playerPos.r = newR;
    playerPos.c = newC;

    const newTile = tileElements[playerPos.r][playerPos.c];
    const player = document.createElement('img');
    player.src = "assets/pac-man.png";
    player.classList.add("player");
    newTile.appendChild(player);
}

function handleKeyPress(event) {
    let newR = playerPos.r;
    let newC = playerPos.c;
    const key = event.key;

    if (key === "ArrowUp" || key === "w" || key === "W") {
        newR--;
        theMaze[1][1]=0

    }
    else if (key === "ArrowDown" || key === "s" || key === "S") {
        newR++;
        theMaze[1][1]=0

    }
    else if (key === "ArrowLeft" || key === "a" || key === "A") {
        newC--;
        theMaze[1][1]=0

    }
    else if (key === "ArrowRight" || key === "d" || key === "D") {
        newC++;
        theMaze[1][1]=0

    }
    else {
        return;
    }

    event.preventDefault();
    updatePlayerPosition(newR, newC);
}


function resetGame() {
    const oldTile = tileElements[playerPos.r][playerPos.c];
    playerPos.r = 1;
    playerPos.c = 1;
    const newTile = tileElements[playerPos.r][playerPos.c];
    const player = document.createElement('img');
    player.src = "assets/pac-man.png";
    player.classList.add("player");
    newTile.appendChild(player);
    removePlayerFromTile(oldTile);
}
drawMaze();
resetButton.addEventListener("click", resetGame);
document.addEventListener("keydown", handleKeyPress);
