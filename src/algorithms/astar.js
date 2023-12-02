//uses the manhattan distance heuristics
export function dijkstra(grid, startNode, finishNode) {
    getHeuristics(grid, startNode, finishNode);
    const open = [];
    const closed = [];
    open.push(startNode);
    //in f=g+h, we assume f is the node's distance property 
    startNode.f = 0;

    //while the open list is not empty
    while (open.length !== 0) {
        //finding the node with the smallest f:
        let currentNode = open[0];
        let currentIndex = 0;
        open.forEach((element, index) => {
            if (element.f < currentNode.f) {
                currentNode = element;
                currentIndex = index;
            }
        })

        closed.push(open.pop(currentIndex)); //removing the currentNode from open and adding it to closed

        if (currentNode == finishNode) {
            //backtracking:
            path = []
            current = currentNode;
            while (current !== null) {
                path.push(current);
                current = current.previousNode;
            }
            path = path.reverse();
            return path; //returns array directly
        }

        //finding children/neighbors of currentNode
        children = getNeighbors(grid, currentNode);
        for (let child in children) {
            //if child is in closed list
            if (closed.includes(child)) {
                continue;
            }

            tentativeG = currentNode.g + 1;// the distance between child and current/a node and its neighbors in this case will always be 1
            //calculating manhattan heuristic:
            child.h = Math.abs(child.row - finishNode.row) + Math.abs(child.col - finishNode.col);
            child.f = child.g + child.h;

            if (open.includes(child)) {
                // for(open_node in open_list){
                //     if(child==open_node && child.g>open_node.g)
                //         continue;
                // }
                if (tentativeG < child.g) {
                    child.g = tentativeG;
                    child.previousNode = currentNode;
                }
            }
            else {
                open.push(child);
                child.previousNode = currentNode;
            }
        }
    }
}

function getNeighbors(grid, node) { //up,down,right,left ONLY
    const { row, col } = node;
    const neighbors = []
    if (row < grid.length - 1) neighbors.push(grid[row + 1, col]);//the node below
    if (row > 0) neighbors.push(grid[row - 1][col]); //the node above
    if (col > 0) neighbors.push(grid[row][col - 1]);//the node to the left
    if (col < grid[0].length - 1) neighbors.push(grid[row + 1][col]);//the node to the right

    return neighbors;
}

// //call this when the a* option is selected, before visualizing the a* algorithm
// //manhattan distance heuristics
// function getHeuristics(grid, start, end) {
//     for (const row in grid) {
//         for (const node in row) {
//             node.h = Math.abs(node.row - end.row) + Math.abs(node.col - end.col);
//         }
//     }
// }