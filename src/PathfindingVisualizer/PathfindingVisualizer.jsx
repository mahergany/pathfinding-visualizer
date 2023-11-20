import React, { Component } from 'react';
import Node from './Node/Node';

import './PathfindingVisualizer.css';

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
                const currentNode = { //object to give every node properties
                    col,
                    row,
                    isStart: row === 10 && col === 5,
                    isFinish: row === 10 && col === 45,
                };
                currentRow.push(currentNode);
            }
            nodes.push(currentRow);
        }
        this.setState({ nodes })
    }

    render() {

        const { nodes } = this.state;

        return (
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
                                    test={'foo'}
                                //test={'kappa'}
                                >

                                </Node>
                            );
                        })}
                    </div>
                    );
                })}
            </div>
        );
    }
}