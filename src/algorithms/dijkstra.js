//need to return an array of visited nodes and an array of shortest path route
//in the main algo ill be updating the costs/weights/distances of each node visited
//and will push the visited nodes onto the vistednodes array


export function dijkstra(grid, startNode, finishNode) {

    const visitedNodesInOrder = []; //to keep track of visited nodes
    startNode.distance = 0; // distance of starting node to itself is 0
    //need to update neighbor's distance
    //ok no nvm in the first run the smallest distance will be the startNode itself and it will be marked as visited


    //all the unvisited nodes (initially has all the nodes in the grid)
    const unvisitedNodes = getAllNodes(grid);

    while (unvisitedNodes.length !== 0) {

        sortNodesByDistance(unvisitedNodes);
        const nearestNode = unvisitedNodes.shift();

        //the node with the smallest distance
        // const nearestNode = (unvisitedNodes) => {     //sorting the unvisited nodes array in ascending order of distance
        //     unvisitedNodes.sort((nodeA, nodeB) => {
        //         if (nodeA.distance > nodeB.distance) return 1;
        //         else if (nodeA.distance < nodeB.distance) return -1;
        //         return 0;
        //     }
        //     )
        //     return unvisitedNodes.shift(); //returns node with smallest distance and removes from unvisitednodes
        // }

        //on encountering a wall, we skip that node and move on to the next nearest
        if (nearestNode.isWall) continue;
        //if the nearest distance is infinity, there is no further path
        if (nearestNode.distance == Infinity) return visitedNodesInOrder;
        //push nearestNode into visited
        nearestNode.isVisited = true;
        visitedNodesInOrder.push(nearestNode);

        //if we reach the last node
        if (nearestNode === finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(nearestNode, grid);
    }
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

//returns all the nodes in the grid by extracting them through each row of the grid
function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

function updateUnvisitedNeighbors(node, grid) {
    //getting an array of the nodes up,down,left,right from the node passed to this function
    const unvisitedNeighbors = (node, grid) => {
        const neighbors = [];
        const { col, row } = node;
        if (row > 0) neighbors.push(grid[row - 1][col]); //checking for and pushing node above
        if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); //checking for and pushing node below
        if (col > 0) neighbors.push(grid[row][col - 1]); //checking for and pushing node to the left
        if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);//checking for and pushing node to the right

        return neighbors.filter(neighbor => !neighbor.isVisited);
    };

    const n = unvisitedNeighbors(node, grid);

    for (const neighbor of n) { //like a for each loop

        //if the distance of a neighboring node is greater than the new potential distance
        //we update the distance
        //alternatively we could check if isVisited is set to false and then update 
        //as all costs between nodes in this application  are 1
        if (neighbor.distance > node.distance + 1) {
            neighbor.distance = node.distance + 1;
            neighbor.previousNode = node;
        }
    }
}

//to get the shortest path, we use the previousNode property to backtrack from the finish node
export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        console.log("unshifting");
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

