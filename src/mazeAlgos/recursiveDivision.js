
export function recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls, type, currentRows, currentColumns) {
    // let wallsToAnimate = [];


    if (rowEnd < rowStart || colEnd < colStart) {
        return;
    }


    // setting boundaries
    if (!surroundingWalls) {
        console.log("recur div first call");
        //   let relevantIds = [board.start, board.target];
        //   if (board.object) relevantIds.push(board.object);
        //   Object.keys(board.nodes).forEach(node => {
        //     if (!relevantIds.includes(node)) {
        //       let r = parseInt(node.split("-")[0]);
        //       let c = parseInt(node.split("-")[1]);
        //       if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
        //         let currentHTMLNode = document.getElementById(node);
        //         board.wallsToAnimate.push(currentHTMLNode);
        //         if (type === "wall") {
        //           board.nodes[node].status = "wall";
        //           board.nodes[node].weight = 0;
        //         } else if (type === "weight") {
        //           board.nodes[node].status = "unvisited";
        //           board.nodes[node].weight = 15;
        //         }
        //       }
        //     }
        //   });
        for (let r = 0; r < currentRows; r++) {
            for (let c = 0; c < currentColumns; c++) {
                if (r == 0 || r == currentRows - 1 || c == 0 || c == currentColumns - 1) {
                    grid[r][c].isWall = true;
                    grid.wallsToAnimate.push(grid[r][c]);
                }
            }
        }
        console.log(grid.wallsToAnimate);
        surroundingWalls = true;
    }

    if (orientation === "horizontal") {
        let possibleRows = [];
        for (let number = rowStart; number <= rowEnd; number += 2) {
            possibleRows.push(number);
        }
        let possibleCols = [];
        for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
            possibleCols.push(number);
        }
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);
        let currentRow = possibleRows[randomRowIndex];
        let colRandom = possibleCols[randomColIndex];
        //   Object.keys(board.nodes).forEach(node => {
        //     let r = parseInt(node.split("-")[0]);
        //     let c = parseInt(node.split("-")[1]);
        //     if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
        //       let currentHTMLNode = document.getElementById(node);
        //       if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
        //         board.wallsToAnimate.push(currentHTMLNode);
        //         if (type === "wall") {
        //           board.nodes[node].status = "wall";
        //           board.nodes[node].weight = 0;
        //         } else if (type === "weight") {
        //           board.nodes[node].status = "unvisited";
        //           board.nodes[node].weight = 15;
        //         }        }
        //     }
        //   });
        grid.forEach(node => {
            if (node.row === currentRow && node.col !== colRandom && node.col >= colStart - 1 && node.col <= colEnd + 1) {
                if (!node.isStart && !node.isEnd) {
                    // wallsToAnimate.push(node);
                    grid.wallsToAnimate.push(node);
                    console.log(grid.wallsToAnimate);
                    if (node.isWall) {
                        node.distance = 0;
                    }
                }
            }
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
        // Object.keys(board.nodes).forEach(node => {
        //     let r = parseInt(node.split("-")[0]);
        //     let c = parseInt(node.split("-")[1]);
        //     if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
        //         let currentHTMLNode = document.getElementById(node);
        //         if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
        //             board.wallsToAnimate.push(currentHTMLNode);
        //             if (type === "wall") {
        //                 board.nodes[node].status = "wall";
        //                 board.nodes[node].weight = 0;
        //             } else if (type === "weight") {
        //                 board.nodes[node].status = "unvisited";
        //                 board.nodes[node].weight = 15;
        //             }
        //         }
        //     }
        // });
        grid.forEach(node => {
            if (node.col === currentCol && node.row !== rowRandom && node.row >= rowStart - 1 && node.row <= rowEnd + 1) {
                if (!node.isStart && !node.isEnd) {
                    grid.wallsToAnimate.push(node);
                    console.log(grid.wallsToAnimate);
                    if (node.isWall) {
                        node.distance = 0;
                    }
                }
            }
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
};