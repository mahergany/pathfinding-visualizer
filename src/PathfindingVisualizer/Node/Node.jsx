import React, { Component } from 'react';

import './Node.css';

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        const {
            row,
            col,
            isFinish,
            isStart,
            isWall,
            previousNode,
            onMouseDown,
            onMouseEnter,
            neighbors,
            onMouseUp,
            draggable,
            handleOnDrag,
            handleDragOver,
            handleOnDrop,
            onDragStart,
            onDragOver,
            onDrop,
            xCoord,
            yCoord,
        } = this.props; // getting initial state from main
        const extraClassName = isFinish // the addon to the class name
            ? 'node-finish'
            : isStart
                ? 'node-start'
                : isWall
                    ? 'node-wall'
                    : '';
        const isDraggable = isFinish ? 'true' : isStart ? 'true' : 'false';
        const isDroppable = isDraggable ? 'false' : isWall ? 'false' : 'true';

        return (
            <div
                id={`node-${row}-${col}`}// ion get this cuz for the start node, wouldnt the classname end up being node node-start (and such a class hasnt been declared)
                className={`node ${extraClassName}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}
                draggable={isDraggable}
                droppable={isDroppable}
                onDragStart={(e) => onDragStart(e, row, col)}
                onDrop={(e) => onDrop(e, row, col)}
                onDragOver={(e) => onDragOver(e)}
            // onDragStart={(e) => handleOnDrag(e)}
            // onDrop={(e) => handleOnDrop(e)}
            // onDragOver={(e) => handleDragOver(e)}

            // onDragStart={this.handleDragStart}
            // onDrop={this.handleDrop}
            // onDragOver={this.handleDragOver}
            ></div>
        )
    }
}

export const DEFAULT_NODE = {
    row: 0,
    col: 0,
};