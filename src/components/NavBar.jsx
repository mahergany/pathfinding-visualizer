import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './NavBar.css';

export default class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // handleClearBtnClick = () => {
    //     const { getInitialGrid, createNode } = this.props;
    //     const newGrid = getInitialGrid();
    //     this.setState({ grid: newGrid });
    // }

    render() {

        const { onClick, changeAlgo, changeSpeed } = this.props;
        return (
            <>
                <nav className='navBar'>
                    <div className='navBar-container'>
                        <h1>Pathfinding Visualizer</h1>
                        <label className='algoLabel'>Choose Algorithm: </label>
                        <select className='algos'
                            // onChange={(e) => {
                            //     this.setState({ currentAlgo: e.target.value }, () => {
                            //         console.log("currentAlgo: " + this.state.currentAlgo);
                            //     });
                            // }}
                            onChange={(e) =>
                                changeAlgo(e.target.value)
                            }
                        >
                            <option>Dijkstra's</option>
                            <option>A*</option>
                            <option>LaCAM</option>
                            <option>Dynamic Fusion</option>
                        </select>
                        <label className='speedLabel'>Choose Speed:     </label>
                        <select className='speeds'
                            onChange={(e) => {
                                // this.setState({ currentSpeed: e.target.value }, () => {
                                //     console.log("currentSpeed: " + this.state.currentSpeed);
                                // });
                                changeSpeed(e.target.value)
                            }}
                        >
                            <option>0.5x</option>
                            <option>1x</option>
                            <option>2x</option>
                        </select>
                        <button className='clearBtn'
                            // onClick={this.handleClearBtnClick}
                            onClick={() => { onClick() }}
                        >Clear Grid</button>
                    </div>
                </nav>
            </>
        )
    }
}
