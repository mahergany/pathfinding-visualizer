import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosMenu } from "react-icons/io";
import { IconContext } from 'react-icons';
import * as AiIcons from 'react-icons/ai';

import './NavBar.css';

export default class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar: true,
            // sliderValue: 20,
        };
        this.handleSideBar = this.handleSideBar.bind(this);
    }
    handleSideBar() {
        const { sidebar } = this.state;
        this.setState({ sidebar: !sidebar });
    }

    render() {
        const { sidebar } = this.state;
        const { onClick, changeAlgo, changeSpeed, changeNode, handleRowChange, handleColumnChange, handleSliderChange, currentRows, handleOnVisualize, multiplePaths, changeMaze } = this.props;
        return (
            <>
                <IconContext.Provider value={{ color: '#fff' }}>
                    {/* <nav className='navBar'> */}

                    {/* <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}> */}
                    <nav className='nav-menu active'>
                        <ul className='nav-menu-items'>

                            <div className='titleDiv'>

                                <h3 className='title'>Pathfinding Visualizer</h3>
                            </div>

                            <div className='slidecontainer'>
                                <label className='rowsLabel'>Rows:</label>
                                <input type="range" min="5" max="50" value={this.state.sliderValue} onChange={(e) => handleSliderChange(e)} />
                                <label>{currentRows}</label>
                            </div>
                            <label className='speedLabel'>Speed:</label>
                            <select className='speeds'
                                selected="selected"
                                onChange={(e) => {
                                    changeSpeed(e.target.value)
                                }}
                            >
                                <option>0.5x</option>
                                <option >1x</option>
                                <option>1.5x</option>
                                <option>2x</option>
                            </select>
                            <button className='clearBtn'
                                // onClick={this.handleClearBtnClick}
                                onClick={() => { onClick() }}
                            >Clear Grid</button>
                            <button className='visualizeButton'
                                onClick={() => handleOnVisualize()}
                            >
                                Visualize
                            </button>
                        </ul>
                        <ul className='nav-menu-items'>
                            {/* <h1>Pathfinding Visualizer</h1> */}
                            {/* <li className='navbar-toggle'>
                            </li> */}
                            {/* <div className="slidecontainer"><input className='slider' type="range" min="0" max="200" value="100" oninput="rangeValue.innerText = this.value" /><p id="rangeValue">100</p></div> */}

                            <label className='algoLabel'>Algorithm:</label>
                            <select className='algos'
                                onChange={(e) =>
                                    changeAlgo(e.target.value)
                                }
                            >
                                <option>Dijkstra's</option>
                                <option>A*</option>
                                <option>Breadth First Search</option>
                                <option>Depth First Search</option>
                                <option>LaCAM</option>
                                <option>Dynamic Fusion</option>
                            </select>

                            <label className='mazeLabel'>Maze:</label>
                            <select className='speeds'
                                // selected="selected"
                                onChange={(e) => {
                                    changeMaze(e.target.value)
                                }}
                            >
                                <option>None</option>
                                <option>Random Weighted</option>
                                <option>Random Walls</option>
                                <option>Prim's</option>
                                <option>Recursive Division</option>
                            </select>


                            <label className='nodeLabel'>Node:</label>
                            <select className='nodesSelection'
                                onChange={(e) => {
                                    let type;
                                    switch (e.target.value) {
                                        case 'Wall (Infinite)':
                                            type = 'Wall';
                                            break;
                                        case 'Graphite (50)':
                                            type = 'Graphite';
                                            break;
                                        case 'Grass (5)':
                                            type = 'Grass';
                                            break;
                                        case 'Sand (7)':
                                            type = 'Sand';
                                            break;
                                        case 'Stone (25)':
                                            type = 'Stone';
                                            break;
                                        case 'Custom':
                                            type = 'custom';
                                    }
                                    changeNode(type);
                                }}
                            >
                                <option>None</option>
                                <option>Wall (Infinite)</option>
                                <option>Graphite (50)</option>
                                <option>Water (50)</option>
                                <option>Grass (5)</option>
                                <option>Sand (7)</option>
                                <option>Stone (25)</option>
                                <option>Custom</option>
                                {/* {multiplePaths && <option>Start</option>}
                                {multiplePaths && <option>Finish</option>} */}

                            </select>

                        </ul>
                    </nav>
                    {/* <div className='navbar'>
                        <Link to='#' className='menu-bars' >
                            <IoIosMenu className='toggleIcon' onClick={this.handleSideBar} />
                        </Link>
                        <h2 className='title'>Pathfinding Visualizer</h2>
                    </div> */}
                </IconContext.Provider>
            </>
        )
    }
}
