import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { astar } from '../algorithms/astar';
import { bfs } from '../algorithms/bfs';
// import { lacam } from '../algorithms/lacam';
import { recursiveDivisionMaze } from '../mazeAlgos/recursiveDivision';
// import { voronoiGeneration } from '../algorithms/dynamicfusion';
import { EventHandler } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import StatusLog from '../components/StatusLog';

import './PathfindingVisualizer.css';
import NavBar from '../components/NavBar';


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
            currentMaze: "None",
            currentSpeed: "1x",
            currentNode: 'Wall',
            currentRows: 20,
            currentColumns: 50,
            mousePosition: { x: 0, y: 0 },
            nodeSize: 20,
            currentPrompt: [],
            wallsToAnimate: [],
            isMouseOverGrid: false,
            showCursor: false,
            mazeEnabled: false,



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
        this.changeMaze = this.changeMaze.bind(this);
        // this.setIsMouseOver = this.setIsMouseOver.bind(this);
    }

    setMousePosition(e) {
        if (!this.state.mazeEnabled) {
            const x = e.clientX;
            const y = e.clientY;
            // console.log(x, y);
            this.setState({ mousePosition: { x, y } });
        }
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
    }

    handleMouseDown(row, col) {
        // const { isMouseOverGrid } = this.state;
        //|| !isMouseOverGrid
        if ((row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL) || (col === this.state.END_NODE_COL && row === this.state.END_NODE_ROW)) return;
        else {
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({ grid: newGrid, mouseIsPressed: true })
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
        console.log('Clear clicked');
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
        this.setState({ grid: grid });
        // this.setState({ grid: grid });
        // this.componentDidMount()
    }

    handleGenerateBtnClick() {
        const { grid, START_NODE_COL, START_NODE_ROW, END_NODE_COL, END_NODE_ROW, currentRows, currentColumns, currentMaze } = this.state;
        console.log("generate clicked");
        const newGrid = this.getInitialGrid();
        this.setState({ grid: newGrid });
        for (let row = 0; row < currentRows; row++) {
            for (let col = 0; col < currentColumns; col++) {
                grid[row][col].isWall = false;
                if ((row === START_NODE_ROW && col === START_NODE_COL) || (row === END_NODE_ROW && col === END_NODE_COL))
                    continue;
                document.getElementById(`node-${row}-${col}`).className = 'node-unvisited';


            }
        }
        if (currentMaze === "Recursive Division") {
            console.log("recur vis start");
            this.visualizeRecursiveDivision();
        }
        else if (currentMaze == "Random Walls") {

        }
    }

    handleOnVisualize() {
        const { grid, START_NODE_ROW, START_NODE_COL, END_NODE_COL, END_NODE_ROW, startNode, finishNode, currentRows, currentColumns, currentPrompt, mazeEnabled } = this.state;
        const { currentAlgo } = this.state;
        let timeTaken = 0;
        let currentNode;
        // if (!mazeEnabled) {

        //clear colors
        for (let r = 0; r < currentRows; r++) {
            for (let c = 0; c < currentColumns; c++) {
                currentNode = grid[r][c];
                if ((r === START_NODE_ROW && c === START_NODE_COL) || (r === END_NODE_ROW && c === END_NODE_COL)) {
                    continue;
                }
                if (!currentNode.isWall)
                    document.getElementById(`node-${r}-${c}`).className = 'node node-unvisited';
            }
        }
        // }

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

        currentPrompt.unshift(currentAlgo + " took " + timeTaken + "ms");
        this.setState(currentPrompt);
        console.log(currentPrompt);
    }

    visualize(currentAlgo) {
        const { grid, START_NODE_ROW, START_NODE_COL, END_NODE_COL, END_NODE_ROW, currentRows, currentColumns } = this.state;
        const updatedGrid = grid.map(row => row.slice());

        const startNode = updatedGrid[START_NODE_ROW][START_NODE_COL];
        const finishNode = updatedGrid[END_NODE_ROW][END_NODE_COL];
        // console.log(startNode, finishNode);
        if (currentAlgo == 'Breadth First Search') {
            const visitedNodes = bfs(updatedGrid, startNode, finishNode, currentRows, currentColumns);
            const path = getNodesInShortestPathOrder(finishNode);
            console.log(path);
            this.animateDijkstra(visitedNodes, path);
        }
        // else if (currentAlgo == 'Depth First Search') {
        //     console.log("before dfs call");
        //     const visitedNodes = dfs(updatedGrid, startNode, finishNode);
        //     console.log(visitedNodes);
        //     const path = getNodesInShortestPathOrder(finishNode);
        //     console.log(path);
        //     this.animateDijkstra(visitedNodes, path);
        // }
        // console.log(visitedNodes)
    }

    visualizeSimpleMaze() {

    }

    animateWalls(walls) {
        const { grid } = this.state;
        const newGrid = grid.map(row => row.slice());

        for (let i = 0; i < walls.length; i++) {
            setTimeout(() => {
                const wall = walls[i];
                const node = newGrid[wall.row][wall.col];
                const newNode = { ...node, isWall: true, isVisited: false, previousNode: null, f: Infinity, g: 0, h: 0 };
                newGrid[wall.row][wall.col] = newNode;
                this.setState({ grid: newGrid });
                document.getElementById(`node-${wall.row}-${wall.col}`).className =
                    'node node-wall';
                // console.log(wall, ' animating');

            }, 10 * i);
        }
    }

    visualizeRecursiveDivision() {
        const { grid, START_NODE_COL, START_NODE_ROW, END_NODE_COL, END_NODE_ROW, currentRows, currentColumns, startNode, finishNode, mazeEnabled } = this.state;
        this.setState({ mazeEnabled: true });
        // const walls = divide(grid, currentRows, currentColumns, startNode, finishNode, "HORIZONTAL");
        // recursiveDivisionMaze(grid, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls, type, currentRows, currentColumns)
        // recursiveDivisionMaze(this, 2, this.height - 3, 2, this.width - 3, "horizontal", false, "wall");
        // const newGrid = grid.map(row => row.slice());

        let walls = recursiveDivisionMaze(grid, 2, currentRows - 3, 2, currentColumns - 3, "horizontal", false, "wall", currentRows, currentColumns);
        // let walls = recursiveDivisionMaze(grid, 0, currentRows, 0, currentColumns, "horizontal", false, "wall", currentRows, currentColumns);
        console.log(walls);
        let walls2 = walls.flat();

        this.animateWalls(walls2);
        // for (let i = 0; i < walls2.length; i++) {
        //     let currentNode = walls2[i];
        //     let row = currentNode.row;
        //     let col = currentNode.col;
        //     // grid[row][col].isWall = true;

        //     const node = newGrid[row][col];
        //     const newNode = { ...node, isWall: !node.isWall, isVisited: false, previousNode: null, f: Infinity, g: 0, h: 0 };
        //     newGrid[row][col] = newNode;
        //     this.setState({ grid: newGrid });
        // }
        grid[START_NODE_ROW][START_NODE_COL].isStart = true;
        grid[END_NODE_ROW][END_NODE_COL].isFinish = true;
        // this.setState({ wallsToAnimate: walls });
        this.setState({ mazeEnabled: false, grid: grid });
    }


    changeAlgo(newAlgo) {
        //when the algo is changed, the grid is reset but the walls, the starting and the ending nodes are retained
        this.setState({ currentAlgo: newAlgo }, () => {
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
                    // else if (!currentNode.isWall) {
                    //     document.getElementById(`node-${row}-${col}`).className = 'node-unvisited';
                    //     // document.getElementById(`node-${row}-${col}`).className = 'node';
                    // }
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

    changeMaze(newMaze) {
        const { grid, currentRows, currentColumns, START_NODE_COL, START_NODE_ROW, END_NODE_ROW, END_NODE_COL } = this.state;
        // this.setState({ currentMaze: newMaze }, () => {
        //     //reset the walls every time the maze is changed
        //     for (let row = 0; row < currentRows; row++) {
        //         for (let col = 0; col < currentColumns; col++) {
        //             grid[row][col].isWall = false;
        //             if ((row === START_NODE_ROW && col === START_NODE_COL) || (row === END_NODE_ROW && col === END_NODE_COL))
        //                 continue;
        //             document.getElementById(`node-${row}-${col}`).className = 'node-unvisited';
        //         }
        //     }
        // })
        if (newMaze == 'Random Pattern')
            this.setState({ currentMaze: { newMaze } })
        // this.visualizeSimpleMaze();
        if (newMaze == 'Recursive Division') {
            console.log("current maze changed to recur div");
            this.setState({ currentMaze: 'Recursive Division' });
        }
    }

    changeSpeed(newSpeed) {
        this.setState({ currentSpeed: newSpeed });
    }

    changeNode(newNode) {
        this.setState({ currentNode: newNode });
    }

    handleSliderChange(event) {
        const { grid, START_NODE_COL, START_NODE_ROW, END_NODE_COL, END_NODE_ROW } = this.state;
        grid[START_NODE_ROW][START_NODE_COL].isStart = false;
        grid[END_NODE_ROW][END_NODE_COL].isFinish = false;
        // need to redefine start and end nodes
        // need to redefine size of nodes
        // need to redefine number of columns
        const selectedNoOfRows = event.target.value;
        this.setState({ currentRows: selectedNoOfRows, currentColumns: Math.floor(1000 / (400 / selectedNoOfRows)) }, () => {
            //, currentColumns: Math.floor(2.5 * event.target.value) ^^^^
            const { currentRows, currentColumns } = this.state;
            const size = 400 / selectedNoOfRows;
            // const columns = Math.floor(1000 / size);
            // const size = Math.min(1500 / currentColumns, 500 / currentRows);
            // console.log(currentRows, currentColumns, nodeSize);
            const startRow = Math.floor(currentRows / 2);
            const startCol = Math.floor(currentColumns / 3);
            const endRow = Math.floor(currentRows / 2);
            const endColumn = Math.floor(2 * currentColumns / 3);

            // if (START_NODE_ROW < currentRows && START_NODE_COL < currentColumns && END_NODE_COL < currentColumns && END_NODE_ROW < currentRows) {
            //     // grid[START_NODE_ROW][START_NODE_COL].isStart = false;
            //     // grid[END_NODE_ROW][END_NODE_COL].isFinish = false;
            //     // document.getElementById(`node-${END_NODE_ROW}-${END_NODE_COL}`).className = 'node';
            //     // grid[startRow][startCol].isStart = true;
            //     // grid[endRow][endColumn].isFinish = true;
            //     // document.getElementById(`node-${startRow}-${startCol}`).className = 'node node-start';
            // }

            // console.log(currentRows, currentColumns, startRow, startCol, size);
            this.setState({ START_NODE_COL: startCol, START_NODE_ROW: startRow, END_NODE_COL: endColumn, END_NODE_ROW: endRow, nodeSize: size });
            const newGrid = this.getInitialGrid();
            this.setState({ grid: newGrid });
        });

    }


    render() {

        const { grid, mouseIsPressed, mousePosition, currentRows, nodeSize, currentPrompt, showCursor } = this.state;
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
                        onClickGenerate={() => this.handleGenerateBtnClick()}
                        changeSpeed={this.changeSpeed}
                        changeAlgo={this.changeAlgo}
                        changeMaze={this.changeMaze}
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
                        onMouseMove={this.setMousePosition}
                    // onMouseEnter={() => this.setIsMouseOver(true)}
                    // onMouseLeave={() => this.setIsMouseOver(false)}
                    >
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
                {/* {showCursor && (
                    <motion.div className='cursor'
                        variants={variants}
                        animate="default"
                    ></motion.div>)} */}
                <motion.div className='cursor'
                    variants={variants}
                    animate="default"
                // style={{ display: "none" }}
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
