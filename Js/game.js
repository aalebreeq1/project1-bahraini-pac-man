// The Maze 2D array: 0 = path, 1 = wall, 2 = player spawn, 3 = enemy path
const theMaze = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 3, 0],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
];

// Cache the maze container element from the HTML
const containerElement = document.querySelector("#maze-container");

// Function to dynamically build and render the maze based on the 2D array
function drawMaze() {
    if (!containerElement) {
        console.error("Error: #maze-container element not found in HTML.");
        return;
    }
    for (let r = 0; r < theMaze.length; r++) {
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
            }
            else if (cellType === 3) {
                tile.classList.add("path", "enemy-path");
            }

            else {
                tile.classList.add('path');
            }

            // Append the created tile to the container in the DOM
            containerElement.appendChild(tile);
        }
    }
}
drawMaze();