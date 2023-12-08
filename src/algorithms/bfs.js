
//the adjacency matrix here will have to do with 1 distance between every node and its neighbors

export function bfs(grid, startNode, finishNode, rows, columns) {
    // 2d array for keeping track of visited nodes
    const visited = [];
    for (let i = 0; i < rows; i++) {
        visited[i] = [];
        for (let j = 0; j < columns; j++) {
            visited[i][j] = false;
        }
    }
    console.log(startNode);
    //queue for keeping track of to be visited nodes
    const q = [];
    visited[startNode.row][startNode.col] = true;
    q.push(startNode);
    const visitedNodes = [];

    while (q.length > 0) {
        const temp = q.shift();
        if (temp === finishNode) {
            return visitedNodes;
        }
        const neighbors = getNeighbors(grid, temp);
        for (const neighbor of neighbors) {
            if (neighbor.isWall)
                continue;
            if (!visited[neighbor.row][neighbor.col]) {
                q.push(neighbor);
                visited[neighbor.row][neighbor.col] = true;
                visitedNodes.push(neighbor);
                neighbor.previousNode = temp;
                if (neighbor === finishNode) {
                    return visitedNodes;
                }
            }
        }
    }
    function getNeighbors(grid, node) {
        const { row, col } = node;
        const neighbors = [];

        if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // the node below
        if (row > 0) neighbors.push(grid[row - 1][col]); // the node above
        if (col > 0) neighbors.push(grid[row][col - 1]); // the node to the left
        if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // the node to the right

        return neighbors;
    }

}