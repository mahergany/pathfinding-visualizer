import React, { Component, useState } from 'react';
import './StatusLog.css'

export default class StatusLog extends Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    render() {
        const { currentPrompt } = this.props;
        return (
            <>
                <div className='statusBox'>
                    <h2>Status Log:</h2>
                    {/* {currentPrompts.map(
                        (i) => {
                            return currentPrompts[i] + '\n';
                        }
                    )} */}
                    {/* {if(currentPrompts.length){
                        currentPrompts.map((prompt, index) => (
                            <div key={index}>{prompt}</div>
                        ))}} */}
                    <div className='promptBox'>
                        {currentPrompt.length ? (
                            currentPrompt.map((prompt, index) => (
                                <div key={index}>{prompt}</div>
                            ))
                        ) : (
                            <p>Run an algorithm!</p>
                        )}
                    </div>
                </div>
            </>)
    }
}