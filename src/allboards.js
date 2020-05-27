import React from 'react'; 
import { withStyles } from '@material-ui/core/styles';
import Board from './board.js';

const style = (theme) => ({
    root:{
       display: 'flex',
       flexDirection: 'row',
       margin: '10px',
       overflow: 'auto',
    },

});


class AllBoards extends React.Component{
    render(){

        console.log(this.props.tasks);

        const tasks = this.props.tasks; 
        //contains an array of the semester objects
    
        const { classes } = this.props;
        return(
            <div className={classes.root}>
            {this.props.semesters.map((semester, index) => 
            <Board key = {semester.id} semester = {semester} index = {index} tasks = {tasks}/>)}
            
            </div>
        )
    }
}

export default withStyles(style)(AllBoards);