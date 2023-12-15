// // High-level node for LaCAM
// class HighLevelNode {
//     constructor(config, tree, parent, order) {
//         this.config = config; // Array of agent positions
//         // or maybe the current agent objects position
//         this.tree = tree; // Queue of LowLevelNodes
//         this.parent = parent; // Reference to parent node
//         this.order = order; // Agent priority order remaining
//     }
// }

// // class LowLevelNodes {
// //     constructor(parent, agentId, position) {
// //         this.parent = parent; // Reference to parent node
// //         this.agentId = agentId; // Agent for which constraint is set
// //         this.position = position; // Agent's position in next config
// //     }
// // }

// class LowLevelNode {
//     constructor(parent, who, where) {
//         this.parent = parent;
//         this.who = who;
//         this.where = where;
//     }
// }

// export function lacam(grid, startNode, finishNode) {
//     let open = [];    // Open list for High-level nodes
//     let explored = [];   // Dictionary for explored configurations
//     //explored == closed

//     const A = 1;//number of agents in system, 1 for now

//     getNewConfig(){
//         ;
//     }

//     const Ninit = new HighLevelNode([startNode], [[Ninit]], null, grid.slice());
//     open.push(Ninit);
//     explored[startNode] = Ninit;

//     while (open.length !== 0) {
//         const N = open.top();
//         if (N.config.includes(finishNode)) {
//             //backtrack here and return
//         }
//         if (N.tree.length === 0) {
//             open.pop();
//             continue;
//         }
//         const C = N.tree.pop();
//         //depth of C ??
//         if (C.length <= A) {
//             let i = N.order(C.length);
//             let v = N.config[i];
//             const neighbors = this.getNeighbors(grid, v);
//             for (const neighbor of neighbors) {
//                 let Cnew = new LowLevelNode(C, i, neighbor);
//                 N.tree.push(Cnew);
//             }
//         }
//         let Qnew = getNewConfig(N, C);
//         if (Qnew === undefined)
//             continue;
//         if (explored[Qnew] === undefined) {
//             continue;
//         }

//         // let Nnew = new HighLevelNode(Qnew, [[]])

//     }

//     function getNeighbors(grid, node) {
//         const { row, col } = node;
//         const neighbors = [];

//         if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // the node below
//         if (row > 0) neighbors.push(grid[row - 1][col]); // the node above
//         if (col > 0) neighbors.push(grid[row][col - 1]); // the node to the left
//         if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // the node to the right

//         return neighbors;
//     }
// }

// class Queue {
//     constructor() {
//         this.items = {}
//         this.frontIndex = 0
//         this.backIndex = 0
//     }
//     enqueue(item) {
//         this.items[this.backIndex] = item
//         this.backIndex++
//         return item + ' inserted'
//     }
//     dequeue() {
//         const item = this.items[this.frontIndex]
//         delete this.items[this.frontIndex]
//         this.frontIndex++
//         return item
//     }
//     peek() {
//         return this.items[this.frontIndex]
//     }
//     get printQueue() {
//         return this.items;
//     }
// }

