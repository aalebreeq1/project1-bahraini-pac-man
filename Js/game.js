// the Mzae its an 2D array that represent:
// "0" represent a walkable path
// "1" represent a Wall
// "2" represent a player spawn point
// "3" represent a enemy path
const theMaze = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 3, 0],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
]

// cashed the maze-container element
const containerElement = document.querySelector("#maze-container")

// function drawMaze: that dynamiclly build the maze in side the HTML based on theMaze 2d array 

function drawMaze() {
    for (let r = 0; r < theMaze.length; r++) {
        for (let c = 0; c < theMaze[r].length; c++) {
            const tile = document.createElement('div')
            tile.classList.add('tile')

            if (theMaze[r][c] === 1) {
                tile.classList.add("wall")
            } else {
                tile.classList.add('path')
            }
        }
    }
}