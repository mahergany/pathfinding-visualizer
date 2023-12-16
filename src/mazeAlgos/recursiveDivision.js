let walls = [];
export function recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls, type, currentRows, currentColumns) {


    if (rowEnd < rowStart || colEnd < colStart) {
        return;
    }

    if (rowEnd < rowStart - 2 || colEnd < colStart - 2)
        return;


    // setting boundaries
    if (!surroundingWalls) {
        // console.log("recur div first call");
        walls.splice(0, walls.length);
        for (let r = 0; r < currentRows; r++) {
            for (let c = 0; c < currentColumns; c++) {
                if (r == 0 || r == currentRows - 1 || c == 0 || c == currentColumns - 1) {
                    let currentNode = grid[r][c];
                    currentNode.isWall = true;
                    walls.push(currentNode);
                }
            }
        }
        // console.log(walls);
        surroundingWalls = true;
    }

    if (orientation === "horizontal") {
        // console.log("horizontall");
        let possibleRows = [];
        for (let number = rowStart; number <= rowEnd; number += 2) {
            possibleRows.push(number);
        }
        let possibleCols = [];
        for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
            possibleCols.push(number);
        }
        // console.log(possibleRows, possibleCols);
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);
        let currentRow = possibleRows[randomRowIndex];
        let colRandom = possibleCols[randomColIndex];

        grid.forEach(cRow => {
            cRow.forEach(node => {
                if (node.row === currentRow && node.col !== colRandom && node.col >= colStart - 1 && node.col <= colEnd + 1) {
                    if (!node.isStart && !node.isEnd) {
                        walls.push(node);
                        // console.log(walls);
                        node.isWall = true;
                        // console.log(node);
                        if (node.isWall) {
                            node.distance = 0;
                        }
                    }
                }
            })
        })
        if (currentRow - 2 - rowStart > colEnd - colStart) {
            recursiveDivisionMaze(grid, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls, type, currentRows, currentColumns);
        } else {
            recursiveDivisionMaze(grid, rowStart, currentRow - 2, colStart, colEnd, "vertical", surroundingWalls, type, currentRows, currentColumns);
        }
        if (rowEnd - (currentRow + 2) > colEnd - colStart) {
            recursiveDivisionMaze(grid, currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls, type, currentRows, currentColumns);
        } else {
            recursiveDivisionMaze(grid, currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls, type, currentRows, currentColumns);
        }
    } else {
        // console.log("verticalll");
        let possibleCols = [];
        for (let number = colStart; number <= colEnd; number += 2) {
            possibleCols.push(number);
        }
        let possibleRows = [];
        for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
            possibleRows.push(number);
        }
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let currentCol = possibleCols[randomColIndex];
        let rowRandom = possibleRows[randomRowIndex];

        //for each grid will give each row !!!
        grid.forEach(cRow => {
            cRow.forEach(node => {
                if (node.col === currentCol && node.row !== rowRandom && node.row >= rowStart - 1 && node.row <= rowEnd + 1) {
                    if (!node.isStart && !node.isEnd) {
                        walls.push(node);
                        node.isWall = true;
                        if (node.isWall) {
                            node.distance = 0;
                        }
                    }
                }
            })
        })
        if (rowEnd - rowStart > currentCol - 2 - colStart) {
            recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls, type, currentRows, currentColumns);
        } else {
            recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls, type, currentRows, currentColumns);
        }
        if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
            recursiveDivisionMaze(grid, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls, type, currentRows, currentColumns);
        } else {
            recursiveDivisionMaze(grid, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls, type, currentRows, currentColumns);
        }
    }
    return walls;
};