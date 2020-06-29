import React from 'react';
import logo from '../Logo.png';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

export default function LandingPage() {
  return (
    <div className="App">
      <img src={logo}/>
      <header className="App-header">
      <section className="App-header">
        <h1 className="App">UTD Comet Planning</h1>
        <h4 className="App"><em>The most efficient way to plan out your 4-year plan.</em></h4>
        <h6> Major:
        <br /> Add another major      
          <Fab color="default" size="small" aria-label="add" className="App-fab">
            <AddIcon />
          </Fab>
        <br /> 
        Add a minor 
          <Fab color="default" size="small" aria-label="add">
            <AddIcon />
          </Fab>
        <br />
        Fast track
          <Fab color="default" size="small" aria-label="add">
            <AddIcon />
          </Fab> 
        </h6>
        <h6 className="App"> Indicate any UTD classes you already have <br /> credit for because of pre-college course <br /> work such as AP credits, community college, <br /> etc. You can check course equivalencies </h6>
        <h6 className="App"> here. </h6>
        <h6> Preload course planner with sample degree plan </h6>
        <Button variant="contained" size="small" className="App-button">
          Submit
        </Button>
      </section>
      </header>
    </div>
  );
}