import React from 'react'; 
import { withStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';
import styled from 'styled-components';
import { List } from '@material-ui/core';

const TaskList = styled.div`
    font-family: Arial; 
    background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')};
`;

const style = (theme) => ({
    root:{
       borderColor: 'black',
       backgroundColor: 'lightgrey',
       width: 250,
       maxHeight: 300,
       overflow: 'auto',
        
    },
});



class Board extends React.Component{

    render(){
        const {classes} = this.props; 
        //console.log(this.props);

        const task = this.props.semester.taskIds.map(task => this.props.tasks[task]);

       // console.log(task);
       
        return(
        
        <Box className={classes.root} border={2}>
            <h3>{this.props.semester.title}</h3>
            <Droppable droppableId = {this.props.semester.id}
                isDropDisabled={this.props.isDisabled}>
            {(provided, snapshot) => (
                <List
                 className={classes.root}
                 ref = {provided.innerRef}
                 {...provided.droppableProps}
                 isDraggingOver = {snapshot.isDraggingOver}
                 >
                {this.props.semester.taskIds.map((task, index) =>
                <Task key = {task.id} task = {task} index={index}/>)}
                {provided.placeHolder}
            </List>
            
            )}
            </Droppable>
         </Box>
        )
    }

}

export default withStyles(style)(Board);