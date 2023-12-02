import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { EventHandler } from 'react';

import './PathfindingVisualizer.css';
import NavBar from '../components/NavBar';

//subtract one from each so that there is consistency with the array form
// var START_NODE_ROW = 9
// var START_NODE_COL = 9
// var END_NODE_ROW = 9
// var END_NODE_COL = 39

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            dragging: false,
            START_NODE_ROW: 9,
            START_NODE_COL: 9,
            END_NODE_ROW: 9,
            END_NODE_COL: 39,
            currentAlgo: "Dijkstra's",
            currentSpeed: "1x",
        };
        this.handleOnDrag = this.handleOnDrag.bind(this);
        this.createNode = this.createNode.bind(this);
        this.getInitialGrid = this.getInitialGrid.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleOnDrop = this.handleOnDrop.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
    }

    //this approach works as the grid is being mounted
    createNode = (row, col) => {
        return {
            col,
            row,
            isStart: row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL,
            isFinish: row === this.state.END_NODE_ROW && col === this.state.END_NODE_COL,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null,
            f: Infinity,
            g: 0,
            h: 0
        };
    }


    getInitialGrid = () => {
        const grid = [];
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                currentRow.push(this.createNode(row, col));
            }
            grid.push(currentRow);
            console.log(row, "  done");
        }
        return grid;
    }

    componentDidMount() {
        const grid = this.getInitialGrid();
        this.setState({ grid });
    }

    handleMouseDown(row, col) {
        if ((row == this.state.START_NODE_ROW && col == this.state.START_NODE_COL) || (col == this.state.END_NODE_COL && row == this.state.END_NODE_ROW)) return;
        else {
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid, mouseIsPressed: true })
        }
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed || this.state.grid[row][col].isStart || this.state.grid[row][col].isFinish) return;
        // if (!this.state.mouseIsPressed || (this.START_NODE_COL === null) || (this.END_NODE_COL === null)) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false });
    }


    handleOnDrag(e, row, col) {
        const { grid } = this.state;
        // $(jQuery.e.props.push('dataTransfer'));
        // Save the current node being dragged
        e.dataTransfer.setData("node", JSON.stringify(grid[row][col]));
        // Set the dragging state to true
        this.setState({ dragging: true });
    }

    // handleOnDrop(e, row, col) {
    //     const { grid } = this.state;
    //     // Prevent the default behavior of the drop event
    //     e.preventDefault();

    //     // Get the node data from the data transfer
    //     const nodeData = JSON.parse(e.dataTransfer.getData("node"));

    //     // Check if it's the start or end node being dropped
    //     if (nodeData.isStart) {
    //         // Update the old start node
    //         grid[this.START_NODE_ROW][this.START_NODE_COL].isStart = false;
    //         // Update the new start node
    //         grid[row][col].isStart = true;
    //         // START_NODE_ROW = row;
    //         // START_NODE_COL = col;
    //         this.setState({ START_NODE_COL: col, START_NODE_ROW: row });
    //     } else if (nodeData.isFinish) {
    //         // Update the old end node
    //         grid[this.END_NODE_ROW][this.END_NODE_COL].isFinish = false;
    //         // Update the new end node
    //         grid[row][col].isFinish = true;
    //         // END_NODE_ROW = row;
    //         // END_NODE_COL = col;
    //         this.setState({ END_NODE_COL: col, END_NODE_ROW: row });
    //     }


    //     // Update the grid in the state
    //     this.setState({ grid, dragging: false });
    // }

    // handleOnDrop(e, row, col) {
    //     const { grid } = this.state;
    //     // Prevent the default behavior of the drop event
    //     e.preventDefault();

    //     // Get the node data from the data transfer
    //     const nodeData = JSON.parse(e.dataTransfer.getData("node"));

    //     // Check if it's the start or end node being dropped
    //     if (nodeData.isStart) {
    //         // Update the old start node
    //         grid[this.START_NODE_ROW][this.START_NODE_COL].isStart = false;
    //         // Update the new start node
    //         grid[row][col].isStart = true;
    //         // START_NODE_ROW = row;
    //         // START_NODE_COL = col;
    //         this.setState({ START_NODE_COL: col, START_NODE_ROW: row });
    //     } else if (nodeData.isFinish) {
    //         // Update the old end node
    //         grid[this.END_NODE_ROW][this.END_NODE_COL].isFinish = false;
    //         // Update the new end node
    //         grid[row][col].isFinish = true;
    //         // END_NODE_ROW = row;
    //         // END_NODE_COL = col;
    //         this.setState({ END_NODE_COL: col, END_NODE_ROW: row });
    //     }

    //     // Update the grid in the state
    //     this.setState({ grid, dragging: false });
    // }

    handleOnDrop(e, row, col) {
        const { grid, START_NODE_ROW, START_NODE_COL, END_NODE_ROW, END_NODE_COL } = this.state;

        // Prevent the default behavior of the drop event
        e.preventDefault();

        // Get the node data from the data transfer
        const nodeData = JSON.parse(e.dataTransfer.getData("node"));

        // Check if it's the start or end node being dropped
        if (nodeData.isStart) {
            // Update the old start node
            grid[START_NODE_ROW][START_NODE_COL].isStart = false;
            // Update the new start node
            grid[row][col].isStart = true;
            this.setState({ START_NODE_COL: col, START_NODE_ROW: row });
        } else if (nodeData.isFinish) {
            // Update the old end node
            grid[END_NODE_ROW][END_NODE_COL].isFinish = false;
            // Update the new end node
            grid[row][col].isFinish = true;
            this.setState({ END_NODE_COL: col, END_NODE_ROW: row });
        }

        // Update the grid in the state
        this.setState({ grid, dragging: false });
    }

    handleDragOver(e) {
        e.preventDefault();
    }


    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        //console.log("animation started");
        // working till here 
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 5 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                //so that the colors of the start and finish ones don't get marked
                if (!node.isFinish && !node.isStart)
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 5 * i);
        }
    }

    //will be reused by other weighted algorithms
    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    }

    visualizeDijkstra() {
        //console.log("visualizing started");
        const { grid, START_NODE_ROW, START_NODE_COL, END_NODE_COL, END_NODE_ROW } = this.state;
        const updatedGrid = grid.map(row => row.slice());

        const startNode = updatedGrid[START_NODE_ROW][START_NODE_COL];
        const finishNode = updatedGrid[END_NODE_ROW][END_NODE_COL];
        //console.log(startNode, finishNode);
        //works till here
        const visitedNodesInOrder = dijkstra(updatedGrid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    handleClearBtnClick() {
        const newGrid = this.getInitialGrid();
        this.setState({ grid: newGrid });
    }

    render() {

        const { grid, mouseIsPressed } = this.state;

        return (
            <>
                <NavBar currentAlgo={this.currentAlgo}
                    currentSpeed={this.currentSpeed}
                    setState={this.setState}
                    onClick={() => this.handleClearBtnClick()}
                />
                <div className="menu"></div>
                <button className='visualizeButton' onClick={() => this.visualizeDijkstra()}>
                    Visualize
                </button>
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (<div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                const { row, col, isStart, isFinish, isWall, draggable } = node;
                                return (
                                    <Node
                                        key={nodeIdx}
                                        row={row}
                                        col={col}
                                        isStart={isStart}
                                        isFinish={isFinish}
                                        isWall={isWall}
                                        mouseIsPressed={this.mouseIsPressed}
                                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                        onMouseUp={() => this.handleMouseUp()}
                                        draggable={draggable}
                                        onDragStart={(e) => this.handleOnDrag(e, row, col)}  // Corrected prop name
                                        onDrop={(e) => this.handleOnDrop(e, row, col)}  // Corrected prop name
                                        onDragOver={(e) => this.handleDragOver(e)}  // Corrected prop name
                                    >
                                    </Node>
                                );
                            })}
                        </div>
                        );
                    })}
                </div>
            </>
        );
    }

}

// const getInitialGrid = () => {
//     const grid = [];
//     for (let row = 0; row < 20; row++) {
//         const currentRow = [];
//         for (let col = 0; col < 50; col++) {
//             currentRow.push(createNode(row, col));
//         }
//         grid.push(currentRow);
//     }
//     return grid;
// }


// const createNode = (row, col) => {
//     const { START_NODE_ROW, START_NODE_COL, END_NODE_ROW, END_NODE_COL } = this.state;
//     return {
//         col,  //since the parameters passed are not the column and row numbers 
//         row,  //but the indices of the array where they lie
//         isStart: row == START_NODE_ROW && col == START_NODE_COL,
//         isFinish: row == END_NODE_ROW && col == END_NODE_COL,
//         distance: Infinity,
//         isVisited: false,
//         isWall: false,
//         previousNode: null,
//         f: 0, //f,g,h for a*
//         g: 0,
//         h: 0
//     };
// }

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = { ...node, isWall: !node.isWall, };
    newGrid[row][col] = newNode;
    return newGrid;
}



