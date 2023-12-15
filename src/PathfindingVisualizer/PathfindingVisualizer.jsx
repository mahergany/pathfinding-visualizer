import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { astar } from '../algorithms/astar';
import { bfs } from '../algorithms/bfs';
// import { lacam } from '../algorithms/lacam';
import { voronoiGeneration } from '../algorithms/dynamicfusion';
import { EventHandler } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import StatusLog from '../components/StatusLog';

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
            currentNode: 'Wall',
            currentRows: 20,
            currentColumns: 50,
            mousePosition: { x: 0, y: 0 },
            nodeSize: 20,
            currentPrompt: [],
            // multiplePaths: false,
        };
        this.handleOnDrag = this.handleOnDrag.bind(this);
        this.createNode = this.createNode.bind(this);
        this.getInitialGrid = this.getInitialGrid.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleOnDrop = this.handleOnDrop.bind(this);
        this.handleDragOver = this.handleDragOver.bind(this);
        this.changeAlgo = this.changeAlgo.bind(this);
        this.changeSpeed = this.changeSpeed.bind(this);
        this.setMousePosition = this.setMousePosition.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleOnVisualize = this.handleOnVisualize.bind(this);
        // this.setNeighbors = this.setNeighbors.bind(this);
    }

    setMousePosition(e) {
        const x = e.clientX;
        const y = e.clientY;
        // console.log(x, y);
        this.setState({ mousePosition: { x, y } });
    }

    useEffect = () => {
        const mouseMove = (e) => {
            this.setMousePosition(e);
        }

        window.addEventListener("mousemove", mouseMove);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
        }
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
            // neighbors: [],
            f: Infinity,
            g: 0,
            h: 0,
            xCoord: 0,
            yCoord: 0,
        };
    }


    getInitialGrid = () => {
        const { currentRows, currentColumns } = this.state;
        const grid = [];
        for (let row = 0; row < currentRows; row++) {
            const currentRow = [];
            for (let col = 0; col < currentColumns; col++) {
                const currentNode = this.createNode(row, col)
                currentNode.xCoord = currentRows - row - 1;
                currentNode.yCoord = col;
                currentRow.push(currentNode);
                // console.log(currentNode.xCoord, currentNode.yCoord);
            }
            grid.push(currentRow);
        }
        return grid;
    }

    componentDidMount() {
        const grid = this.getInitialGrid();
        this.setState({ grid });
    }

    componentDidUpdate() {
        // const mouseMove = (e) => {
        //     console.log(e);
        // }
        // window.addEventListener("mousemove", mouseMove);

    }

    // componentWillUnmount() {
    // }

    handleMouseDown(row, col) {
        if ((row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL) || (col === this.state.END_NODE_COL && row === this.state.END_NODE_ROW)) return;
        else {
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid, mouseIsPressed: true })
            // this.cursor.hide(); // Hide the cursor when mouse is pressed
        }
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed || this.state.grid[row][col].isStart || this.state.grid[row][col].isFinish) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false });
    }


    handleOnDrag(e, row, col) {
        const { grid } = this.state;
        // Save the current node being dragged
        e.dataTransfer.setData("node", JSON.stringify(grid[row][col]));
        // Set the dragging state to true
        this.setState({ dragging: true });
    }


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
        console.log("animation started");
        // working till here 
        const { currentSpeed } = this.state;
        let speed;
        if (currentSpeed == "1x")
            speed = 10;
        else if (currentSpeed == "2x")
            speed = 2;
        else if (currentSpeed == "0.5x")
            speed = 15;
        else if (currentSpeed == "1.5x")
            speed = 5;
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, speed * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                //so that the colors of the start and finish ones don't get marked
                if (!node.isFinish && !node.isStart)
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, speed * i);
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

    visualizeAStar() {
        console.log("visualize a star reached");
        const { grid, START_NODE_ROW, START_NODE_COL, END_NODE_COL, END_NODE_ROW } = this.state;
        const updatedGrid = grid.map(row => row.slice());

        const startNode = updatedGrid[START_NODE_ROW][START_NODE_COL];
        const finishNode = updatedGrid[END_NODE_ROW][END_NODE_COL];
        // console.log(startNode, finishNode);
        const visitedNodes = astar(updatedGrid, startNode, finishNode);
        // console.log(visitedNodes)
        const path = getNodesInShortestPathOrder(finishNode);
        // console.log(path);
        this.animateDijkstra(visitedNodes, path);
    }

    handleClearBtnClick() {
        // const newGrid = this.getInitialGrid();
        const { grid, START_NODE_COL, START_NODE_ROW, END_NODE_COL, END_NODE_ROW, currentRows, currentColumns } = this.state;
        for (let row = 0; row < currentRows; row++) {
            //const currentRow=[];
            for (let col = 0; col < currentColumns; col++) {
                const currentNode = grid[row][col];
                if (row == START_NODE_ROW && col == START_NODE_COL) {
                    currentNode.isStart = true;
                    // document.getElementById(`node-${row}-${col}`).className = 'node-finish';
                }
                else if (row == END_NODE_ROW && col == END_NODE_COL) {
                    currentNode.isFinish = true;
                    // document.getElementById(`node-${row}-${col}`).className = 'node-start';
                }
                else {
                    currentNode.isWall = false;
                    document.getElementById(`node-${row}-${col}`).className = 'node-unvisited';
                    // document.getElementById(`node-${row}-${col}`).className = 'node';
                }
                currentNode.isVisited = false;
                currentNode.previousNode = null;
                currentNode.f = Infinity;
                currentNode.g = 0;
                currentNode.h = 0;
                currentNode.distance = Infinity;
            }
        }
        // this.setState({ grid: grid });
        // this.componentDidMount()
    }

    handleOnVisualize() {
        const { grid, START_NODE_ROW, START_NODE_COL, END_NODE_COL, END_NODE_ROW, startNode, finishNode, currentRows, currentColumns, currentPrompt } = this.state;
        const { currentAlgo } = this.state;
        let timeTaken = 0;

        if (currentAlgo === "Dijkstra's") {
            let start = Date.now();
            this.visualizeDijkstra();
            timeTaken = Date.now() - start;
        }
        else if (currentAlgo === "A*") {
            let start = Date.now();
            this.visualizeAStar();
            timeTaken = Date.now() - start;
        }
        else if (currentAlgo === "Breadth First Search") {
            let start = Date.now();
            this.visualize(currentAlgo);
            timeTaken = Date.now() - start;
        }
        else if (currentAlgo === "Dynamic Fusion") {
            let start = Date.now();
            const obstacles = voronoiGeneration(grid, currentRows, currentColumns);
            console.log(obstacles);
            timeTaken = Date.now() - start;
        }
        else if (currentAlgo === "LaCAM") {
            // this.setState({ multiplePaths: true });
            //make an option for multiple start and end nodes
            //assign different colors to each and change their path color asw
            let start = Date.now();
            // lacam(grid, startNode, finishNode);
            timeTaken = Date.now() - start;
        }
        currentPrompt.unshift(currentAlgo + " took " + timeTaken);
        this.setState(currentPrompt);
        console.log(currentPrompt);
    }

    visualize(currentAlgo) {
        const { grid, START_NODE_ROW, START_NODE_COL, END_NODE_COL, END_NODE_ROW, currentRows, currentColumns } = this.state;
        const updatedGrid = grid.map(row => row.slice());

        const startNode = updatedGrid[START_NODE_ROW][START_NODE_COL];
        const finishNode = updatedGrid[END_NODE_ROW][END_NODE_COL];
        // console.log(startNode, finishNode);
        const visitedNodes = bfs(updatedGrid, startNode, finishNode, currentRows, currentColumns);
        // console.log(visitedNodes)
        const path = getNodesInShortestPathOrder(finishNode);
        console.log(path);
        this.animateDijkstra(visitedNodes, path);
    }

    changeAlgo(newAlgo) {
        //when the algo is changed, the grid is reset but the walls, the starting and the ending nodes are retained
        this.setState({ currentAlgo: newAlgo }, () => {
            // console.log("currentAlgo: " + this.state.currentAlgo);
            const { grid, START_NODE_COL, START_NODE_ROW, END_NODE_COL, END_NODE_ROW, currentRows, currentColumns } = this.state;
            for (let row = 0; row < currentRows; row++) {
                //const currentRow=[];
                for (let col = 0; col < currentColumns; col++) {
                    const currentNode = grid[row][col];
                    if (row == START_NODE_ROW && col == START_NODE_COL) {
                        currentNode.isStart = true;
                        // document.getElementById(`node-${row}-${col}`).className = 'node-finish';
                    }
                    else if (row == END_NODE_ROW && col == END_NODE_COL) {
                        currentNode.isFinish = true;
                        // document.getElementById(`node-${row}-${col}`).className = 'node-start';
                    }
                    else if (!currentNode.isWall) {
                        document.getElementById(`node-${row}-${col}`).className = 'node-unvisited';
                        // document.getElementById(`node-${row}-${col}`).className = 'node';
                    }
                    currentNode.isVisited = false;
                    currentNode.previousNode = null;
                    currentNode.f = Infinity;
                    currentNode.g = 0;
                    currentNode.h = 0;
                    currentNode.distance = Infinity;
                }
            }
        });
    }

    changeSpeed(newSpeed) {
        this.setState({ currentSpeed: newSpeed });
    }

    changeNode(newNode) {
        this.setState({ currentNode: newNode });
    }

    handleSliderChange(event) {
        // need to redefine start and end nodes
        // need to redefine size of nodes
        // need to redefine number of columns
        const selectedNoOfRows = event.target.value;
        this.setState({ currentRows: selectedNoOfRows, currentColumns: Math.floor(1000 / (400 / selectedNoOfRows)) }, () => {
            //, currentColumns: Math.floor(2.5 * event.target.value) ^^^^
            const { currentRows, currentColumns, START_NODE_COL, START_NODE_ROW, END_NODE_COL, END_NODE_ROW } = this.state;
            const size = 400 / selectedNoOfRows;
            // const columns = Math.floor(1000 / size);
            // const size = Math.min(1500 / currentColumns, 500 / currentRows);
            // console.log(currentRows, currentColumns, nodeSize);
            const startRow = Math.floor(currentRows / 2);
            const startCol = Math.floor(currentColumns / 3);
            const endRow = Math.floor(currentRows / 2);
            const endColumn = Math.floor(2 * currentColumns / 3);
            console.log(currentRows, currentColumns, startRow, startCol, size);
            this.setState({ START_NODE_COL: startCol, START_NODE_ROW: startRow, END_NODE_COL: endColumn, END_NODE_ROW: endRow, nodeSize: size });
            // this.handleClearBtnClick();
            const newGrid = this.getInitialGrid();
            this.setState({ grid: newGrid });
        });
    }


    render() {

        const { grid, mouseIsPressed, mousePosition, currentRows, nodeSize, currentPrompt } = this.state;
        const variants = {
            default: {
                x: mousePosition.x - 12,
                y: mousePosition.y - 12
            }
        }

        return (
            <>
                <Router>
                    <NavBar className="NavBar" currentAlgo={this.currentAlgo}
                        currentSpeed={this.currentSpeed}
                        currentRows={currentRows}
                        currentNode={this.currentNode}
                        setState={this.setState}
                        onClick={() => this.handleClearBtnClick()}
                        changeSpeed={this.changeSpeed}
                        changeAlgo={this.changeAlgo}
                        changeNode={this.changeNode}
                        handleSliderChange={this.handleSliderChange}
                        handleOnVisualize={this.handleOnVisualize}
                    // multiplePaths={this.multiplePaths}
                    />
                </Router>
                {/* <button className='visualizeButton' onClick={() => this.handleOnVisualize()}>
                    Visualize
                </button> */}
                <container>
                    <div className="grid"
                        onMouseMove={this.setMousePosition}>
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
                                            nodeSize={nodeSize}
                                        >
                                        </Node>
                                    );
                                })}
                            </div>
                            );
                        })}
                    </div>
                    <div className='status-log-container'>
                        <StatusLog
                            currentPrompt={currentPrompt}
                        >

                        </StatusLog>
                    </div>

                </container>
                <motion.div className='cursor'
                    variants={variants}
                    animate="default"
                ></motion.div>
            </>
        );
    }

}


const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.map(row => row.slice());
    const node = newGrid[row][col];
    const newNode = { ...node, isWall: !node.isWall, isVisited: false, previousNode: null, f: Infinity, g: 0, h: 0 };
    newGrid[row][col] = newNode;
    return newGrid;
}

