import React, { Component } from 'react';
import Node from './Node/Node';

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

    }

    createNode = ((row, col) => {
        return {
            col,  //since the parameters passed are not the column and row numbers 
            row,  //but the indices of the array where they lie
            isStart: row == START_NODE_ROW && col == START_NODE_COL,
            isFinish: row == END_NODE_ROW && col == END_NODE_COL,
            distance: Infinity,
            isWall: false,
            previousNode: null,
        };
    })

    render() {

        const { nodes } = this.state;

        return (
            <>
                <button onClick={() => this.visualizeDijkstra()}>
                    Visualize Dijkstra's
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