//uses the manhattan distance heuristics
export function astar(grid, startNode, finishNode) {
    // getHeuristics(grid, startNode, finishNode);
    const open = []; //unvisited nodes
    const closed = []; //visited nodes
    const visitedNodes = [];

    //in f=g+h, we assume f is the node's distance property 
    startNode.f = 0;
    open.push(startNode);

    //while the open list is not empty
    while (open.length > 0) {

        let lowestIndex = 0;
        for (let i = 0; i < open.length; i++) {
            if (open[i].f < open[lowestIndex].f)
                lowestIndex = i;
        }

        let currentNode = open[lowestIndex];
        closed.push(currentNode);
        if (currentNode.f === Infinity)
            return [];
        if (currentNode === finishNode) {
            return closed;
        }

        //removing the currentNode from open and adding it to closed
        open.splice(lowestIndex, 1);


        const neighbors = getNeighbors(grid, currentNode);
        // console.log(neighbors);

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            if (neighbor.isWall)
                continue;
            if (!closed.includes(neighbor)) {
                let possibleG = currentNode.g + 1;

                if (!open.includes(neighbor)) {
                    open.push(neighbor);
                } else if (possibleG >= neighbor.g) {
                    continue;
                }
                neighbor.g = possibleG;
                neighbor.h = Math.abs(neighbor.row - finishNode.row) + Math.abs(neighbor.col - finishNode.col);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previousNode = currentNode;
            }
        }

        function getNeighbors(grid, node) {
            const { row, col } = node;
            const neighbors = [];

            if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // the node below
            if (row > 0) neighbors.push(grid[row - 1][col]); // the node above
            if (col > 0) neighbors.push(grid[row][col - 1]); // the node to the left
            if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // the node to the right
            // console.log(neighbors);//neighbors are of type node np

            const validNeighbors = neighbors.filter(neighbor => !neighbor.isWall);
            return validNeighbors;
            // return neighbors;
        }
    }
}
