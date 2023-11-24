import React, { Component } from 'react';

import './Node.css';

export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { isFinish, isStart } = this.props; // getting initial state from main
        const extraClassName = isFinish // the addon to the class name
            ? 'node-finish'
            : isStart
                ? 'node-start'
                : '';
        return <div className={`node ${extraClassName}`}></div>; // ion get this cuz for the start node, wouldnt the classname end up being node node-start (and such a class hasnt been declared)
    }
}

export const DEFAULT_NODE = {
    row: 0,
    col: 0,
};