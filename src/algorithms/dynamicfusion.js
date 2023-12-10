
// export function voronoiGeneration(grid, rows, columns) {

//     // createObstacles = (obstacle) => {
//     //     return {
//     //         edges,//array of edges
//     //         centerX,
//     //         centerY,

//     //     }
//     // }
//     function findEdges(obstacle) {
//         const edges = [];
//         const commonRow = false;
//         const commonColumn = false;
//         const edgeCount = 0;
//         // Iterate through each pair of consecutive nodes in the obstacle
//         for (let i = 0; i < obstacle.length; i++) {
//             const nodeA = obstacle[i];
//             const nodeB = obstacle[(i + 1) % obstacle.length]; // Wrap around for the last edge

//             // // Calculate the unique line segment defined by two consecutive nodes
//             // const lineSegment = calculateUniqueLineSegment(nodeA, nodeB, edges);

//             // // Add the line segment to the edges array
//             // edges.push(lineSegment);
//             if (nodeA.xCoord == nodeB.xCoord) {
//                 commonRow = true;
//                 commonColumn = false;
//             }
//             if (nodeA.yCoord == nodeB.yCoord) {
//                 commonColumn = true;
//                 commonRow = false;
//             }
//             if (commonRow) {
//                 if (edgeCount !== 0) {
//                     for (const edge in edges[edgeCount]) {
//                         if (areNeighbors(edge, nodeA) && edge.xCoord === nodeA.xCoord) {
//                             edges[edgeCount].splice(edge, 1);
//                             edges.push(nodeA);
//                         }
//                         else if (areNeighbors(edge, nodeB) && edge.xCoord === nodeB.xCoord) {
//                             edges[edgeCount].splice(edge, 1);
//                             edges.push(nodeB);
//                         }
//                     }
//                 }
//             }
//             else if (commonColumn) {
//                 if (edgeCount !== 0) {
//                     for (const edge in edges[edgeCount]) {
//                         if (areNeighbors(edge, nodeA) && edge.yCoord === nodeA.yCoord) {
//                             edges[edgeCount].splice(edge, 1);
//                             edges.push(nodeA);
//                         }
//                         else if (areNeighbors(edge, nodeB) && edge.yCoord === nodeB.yCoord) {
//                             edges[edgeCount].splice(edge, 1);
//                             edges.push(nodeB);
//                         }
//                     }
//                 }
//             }
//             else {
//                 edges.push(nodeA);
//                 edges.push(nodeB);
//                 edgeCount++;
//             }
//         }

//         return edges;
//     }

//     // function calculateLineSegment(nodeA, nodeB) {
//     //     const lineSegment = [];

//     //     // // Calculate the line segment based on the cells covered by the edge
//     //     // const deltaX = nodeB.col - nodeA.col;
//     //     // const deltaY = nodeB.row - nodeA.row;
//     //     // const steps = Math.max(Math.abs(deltaX), Math.abs(deltaY));

//     //     // for (let step = 0; step <= steps; step++) {
//     //     //     const x = nodeA.col + (deltaX / steps) * step;
//     //     //     const y = nodeA.row + (deltaY / steps) * step;
//     //     //     lineSegment.push({ x: x, y: y });
//     //     // }    

//     //     if (nodeA.xCoord == nodeB.xCoord || nodeA.yCoord == nodeB.yCoord) {
//     //         lineSegment.push(nodeA);
//     //         lineSegment.push(nodeB);
//     //         return lineSegment;
//     //     }
//     //     else
//     //         return null;

//     // }

//     // function calculateUniqueLineSegment(nodeA, nodeB, existingEdges) {
//     //     // Check if the line segment already exists in the edges array
//     //     for (const existingEdge of existingEdges) {
//     //         // if (
//     //         //     (existingEdge.start.row === nodeA.row && existingEdge.start.col === nodeA.col &&
//     //         //         existingEdge.end.row === nodeB.row && existingEdge.end.col === nodeB.col) ||
//     //         //     (existingEdge.start.row === nodeB.row && existingEdge.start.col === nodeB.col &&
//     //         //         existingEdge.end.row === nodeA.row && existingEdge.end.col === nodeA.col)
//     //         // ) {
//     //         //     // Return the existing edge if found
//     //         //     return existingEdge;
//     //         // }
//     //         // for (const )
//     //     }

//     //     // If the line segment does not exist, calculate it
//     //     const lineSegment = calculateLineSegment(nodeA, nodeB);

//     //     return lineSegment;
//     // }


//     // Function to get neighbors of a given node
//     function getNeighbors(node) {
//         const { row, col } = node;
//         const neighbors = [];

//         if (row < rows - 1) neighbors.push(grid[row + 1][col]); // the node below
//         if (row > 0) neighbors.push(grid[row - 1][col]); // the node above
//         if (col > 0) neighbors.push(grid[row][col - 1]); // the node to the left
//         if (col < columns - 1) neighbors.push(grid[row][col + 1]); // the node to the right

//         return neighbors;
//     }

//     // check if two nodes are neighbors
//     function areNeighbors(node1, node2) {
//         return Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col) === 1;
//     }

//     // find the obstacle containing a node, if any
//     function findObstacle(node) {
//         for (const obstacle of obstacles) {
//             if (obstacle.some(obstacleNode => areNeighbors(obstacleNode, node))) {
//                 return obstacle;
//             }
//         }
//         return null;
//     }

//     // Initializing the obstacles
//     const obstacles = [];

//     // Iterating through the grid to find walls and group them into obstacles
//     for (let i = 0; i < rows; i++) {
//         for (let j = 0; j < columns; j++) {
//             const currentNode = grid[i][j];
//             if (currentNode.isWall) {
//                 // Check if the wall is part of an existing obstacle
//                 const existingObstacle = findObstacle(currentNode);
//                 if (existingObstacle) {
//                     if (!existingObstacle.includes(currentNode))
//                         existingObstacle.push(currentNode);
//                 } else {
//                     // If not, create a new obstacle
//                     const newObstacle = [currentNode];
//                     const neighbors = getNeighbors(currentNode);

//                     // Check neighbors to add them to the same obstacle
//                     for (const neighbor of neighbors) {
//                         if (neighbor.isWall) {
//                             newObstacle.push(neighbor);
//                         }
//                     }

//                     obstacles.push(newObstacle);
//                 }
//             }
//         }
//     }
//     // return obstacles;

//     for (const obstacle in obstacles) {
//         obstacle.edges = findEdges(obstacle);
//     }
//     return obstacles;


//     //obstacles have successfully been grouped into an array



//     // // Additional logic for voronoiPoints and voronoiEdges
//     // const voronoiPoints = [];
//     // const voronoiEdges = [];

//     // obstacles.forEach((obstacle) => {
//     //     // Assuming findDelaunayTriangulation, makeTricenter, and other related functions are defined
//     //     const trimat = findDelaunayTriangulation(obstacle);
//     //     const voronoiedge = makeTricenter(trimat); // Replace with actual logic
//     //     voronoiPoints.push(voronoiedge);
//     //     voronoiEdges.push([voronoiedge[0], voronoiedge[1]]);
//     // });

//     // return { voronoiPoints, voronoiEdges };
// }

export function voronoiGeneration(grid, rows, columns) {

    // Function to find edges of an obstacle
    // function findEdges(obstacle) {
    //     const edges = [];
    //     let commonRow = false;
    //     let commonColumn = false;
    //     let edgeCount = 0;
    //     // Iterate through each pair of consecutive nodes in the obstacle
    //     for (let i = 0; i < obstacle.nodes.length; i++) {
    //         const nodeA = obstacle.nodes[i];
    //         const nodeB = obstacle.nodes[(i + 1) % obstacle.nodes.length]; // Wrap around for the last edge

    //         if (nodeA.xCoord === nodeB.xCoord) {
    //             commonRow = true;
    //             commonColumn = false;
    //         }
    //         if (nodeA.yCoord === nodeB.yCoord) {
    //             commonColumn = true;
    //             commonRow = false;
    //         }

    //         if (commonRow && edgeCount !== 0) {
    //             for (let edgeCount = 0; edgeCount < edges.length; edgeCount++) {
    //                 const edge = edges[edgeCount];
    //                 if (areNeighbors(edge, nodeA) && edge.xCoord === nodeA.xCoord) {
    //                     // edges[edgeCount].splice(edge, 1);
    //                     edges.push(nodeA);
    //                 }
    //                 else if (areNeighbors(edge, nodeB) && edge.xCoord === nodeB.xCoord) {
    //                     // edges[edgeCount].splice(edge, 1);
    //                     edges.push(nodeB);
    //                 }
    //             }
    //         }
    //         else if (commonColumn && edgeCount !== 0) {
    //             for (let edgeCount = 0; edgeCount < edges.length; edgeCount++) {
    //                 const edge = edges[edgeCount];
    //                 if (areNeighbors(edge, nodeA) && edge.yCoord === nodeA.yCoord) {
    //                     // edges[edgeCount].splice(edge, 1);
    //                     edges.push(nodeA);
    //                 }
    //                 else if (areNeighbors(edge, nodeB) && edge.yCoord === nodeB.yCoord) {
    //                     // edges[edgeCount].splice(edge, 1);
    //                     edges.push(nodeB);
    //                 }
    //             }
    //         }
    //         else {
    //             edges.push(nodeA);
    //             edges.push(nodeB);
    //             edgeCount++;
    //         }
    //     }

    //     return edges;
    // }

    // Function to get neighbors of a given node
    function getNeighbors(node) {
        const { row, col } = node;
        const neighbors = [];

        if (row < rows - 1) neighbors.push(grid[row + 1][col]); // the node below
        if (row > 0) neighbors.push(grid[row - 1][col]); // the node above
        if (col > 0) neighbors.push(grid[row][col - 1]); // the node to the left
        if (col < columns - 1) neighbors.push(grid[row][col + 1]); // the node to the right

        return neighbors;
    }

    // Check if two nodes are neighbors
    function areNeighbors(node1, node2) {
        return Math.abs(node1.row - node2.row) + Math.abs(node1.col - node2.col) === 1;
    }

    // Find the obstacle containing a node, if any
    function findObstacle(node) {
        for (const obstacle of obstacles) {
            if (obstacle.nodes.some(obstacleNode => areNeighbors(obstacleNode, node))) {
                return obstacle;
            }
        }
        return null;
    }

    // Initializing the obstacles
    const obstacles = [];

    // Iterating through the grid to find walls and group them into obstacles
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const currentNode = grid[i][j];
            if (currentNode.isWall) {
                // Check if the wall is part of an existing obstacle
                const existingObstacle = findObstacle(currentNode);
                if (existingObstacle) {
                    if (!existingObstacle.nodes.includes(currentNode))
                        existingObstacle.nodes.push(currentNode);
                } else {
                    // If not, create a new obstacle
                    const newObstacle = { nodes: [currentNode], edges: [] };
                    const neighbors = getNeighbors(currentNode);

                    // Check neighbors to add them to the same obstacle
                    for (const neighbor of neighbors) {
                        if (neighbor.isWall) {
                            newObstacle.nodes.push(neighbor);
                        }
                    }

                    obstacles.push(newObstacle);
                }
            }
        }
    }
    // findGeometricCenter = () => {

    // }

    // Calculate edges for each obstacle
    obstacles.forEach(obstacle => {
        // obstacle.edges = findEdges(obstacle);
    });

    return obstacles;
}
