import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

//subtract one from each so that there is consistency with the array form
const START_NODE_ROW = 9
const START_NODE_COL = 4
const END_NODE_ROW = 9
const END_NODE_COL = 44

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
        };
    }

    componentDidMount() {
        const nodes = []
        for (let row = 0; row < 20; row++) {
            const currentRow = [];
            for (let col = 0; col < 50; col++) {
                currentRow.push(this.createNode(row, col));
            }
            nodes.push(currentRow);
        }
        this.setState({ nodes })
    }


    visualzeDijkstra() {
        const { grid } = this.state;
        const visitedNodes = dijkstra(grid, grid[START_NODE_ROW][START_NODE_COL], grid[END_NODE_ROW][END_NODE_COL]);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(grid[END_NODE_ROW][END_NODE_COL]);

        //to animate we run a loop and shift visitedNodes array until it's empty
        for (let i = 0; i <= visitedNodes.length; i++) {
            if (i == visitedNodes.length)//once we reach the last node, animate the shortest path
            {
                setTimeout(() => {
                    for (let j = 0; j < nodesInShortestPathOrder.length; j++) {
                        const node = nodesInShortestPathOrder[i];
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
                    }
                }, 50 * i)
                return;
            }

            //change the class name of the current node being iterated for its color properties to change
            setTimeout(() => {
                const node = visitedNodes[i];
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 10 * i);

        }
    }

    createNode = ((row, col) => {
        return {
            col,  //since the parameters passed are not the column and row numbers 
            row,  //but the indices of the array where they lie
            isStart: row == START_NODE_ROW && col == START_NODE_COL,
            isFinish: row == END_NODE_ROW && col == END_NODE_COL,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            previousNode: null,
        };
    })

    render() {

        const { nodes } = this.state;

        return (
            <>
                <button onClick={() => this.visualizeDijkstra()}>
                    Visualize Dijkstra's Algorithm
                </button>
                <div className="grid">
                    {nodes.map((row, rowId) => {
                        return (<div key={rowId}>
                            {row.map((node, nodeId) => {
                                const { isStart, isFinish } = node;
                                return (
                                    <Node
                                        key={nodeId}
                                        isStart={isStart}
                                        isFinish={isFinish}
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