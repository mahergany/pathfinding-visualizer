let visited = [];

export function dfs(grid, startNode, finishNode) {
    console.log("dfs reached");
    // let stack = new Stack();
    // let visited = [];
    // startNode.isVisited = true;
    // stack.push(startNode);
    // while (stack.length !== 0) {
    //     let x = stack.peek();
    //     stack.pop();
    //     const neighbors = getNeighbors(grid, x);
    //     for (const neighbor of neighbors) {
    //         neighbor.previousNode = x;
    //         if (neighbor === finishNode) {
    //             console.log(visited);
    //             return visited;
    //         }
    //         if (neighbor.isWall)
    //             continue;
    //         if (!neighbor.isVisited) {
    //             stack.push(neighbor);
    //             neighbor.isVisited = true;
    //             visited.push(neighbor);
    //         }
    //     }
    // }
    // return [];

    // let stack = new Stack();
    // stack.push(startNode);
    // console.log("before while");

    // while (!stack.isEmpty()) {
    //     let u = stack.peek();
    //     console.log(u);
    //     stack.pop();
    //     if (u.isVisited)
    //         continue;
    //     visited.push(u);
    //     u.isVisited = true;
    //     const neighbors = getNeighbors(grid, u);
    //     for (const neighbor of neighbors) {
    //         if (neighbor.isWall)
    //             continue;
    //         neighbor.previousNode = u;
    //         if (neighbor === finishNode)
    //             return visited;
    //         if (!neighbor.isVisited) {
    //             dfs(grid, neighbor, finishNode);
    //         }
    //     }
    // }
    // return visited;

    let stack = [];
    stack.push(startNode);
    let visited = [];
    // const visited = new Set();
    // const result = [];
    let visitedNodes = [];

    while (stack.length) {
        const x = stack.pop();
        // console.log(x);
        // if (!x.isVisited) {
        //     x.isVisited = true;

        if (!visited.includes(x)) {
            visited.push(x);

            const neighbors = getNeighbors(grid, x);
            console.log(neighbors);
            for (const neighbor of neighbors) {

                visitedNodes.push(neighbor);
                // if (neighbor.isWall)
                //     continue;
                if (neighbor === finishNode) {
                    finishNode.previousNode = x;
                    // console.log(visitedNodes);
                    return visitedNodes;
                }
                neighbor.previousNode = x;
                stack.push(neighbor);
            }
        }
    }

    return visitedNodes;



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

// class Stack {

//     // Array is used to implement stack
//     constructor() {
//         this.items = [];
//     }

//     push(element) {
//         // push element into the items
//         this.items.push(element);
//     }

//     pop() {
//         // return top most element in the stack
//         // and removes it from the stack
//         // Underflow if stack is empty
//         if (this.items.length == 0)
//             return "Underflow";
//         return this.items.pop();
//     }
//     // peek function
//     peek() {
//         // return the top most element from the stack
//         // but does'nt delete it.
//         return this.items[this.items.length - 1];
//     }
//     isEmpty() {
//         // return true if stack is empty
//         return this.items.length == 0;
//     }
//     printStack() {
//         var str = "";
//         for (var i = 0; i < this.items.length; i++)
//             str += this.items[i] + " ";
//         return str;
//     }

//     // Functions to be implemented
//     // push(item)
//     // pop()
//     // peek()
//     // isEmpty()
//     // printStack()
// }