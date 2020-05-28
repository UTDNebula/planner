import React from 'react'; 
import { List } from '@material-ui/core'; 
import Task from './task.js'; 
import { withStyles } from '@material-ui/core/styles';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
    margin: 8px; 
    border: 1px solid black; 
    border-radius: 2px; 
    width: 500px;
    height: 550px;
    overflow: auto;
    display: flex; 
    flex-direction: column; 
    `;
const TaskList = styled.div`
    padding: 9px; 
    font-family: Arial; 
    background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')};
    flex-grow: 1; 
    
`; 

/** 

//using higher order material ui stuff
const style = (theme) => ({
    root:{
        backgroundColor: 'lightgrey',
        width: 250,
        maxHeight: '100vh',
        overflow: 'auto',
    },

});
*/

class MainList extends React.Component {

    render(){
        const { classes } = this.props; 
       // console.log(this.props);
        return(
        <Container>
        <Droppable droppableId = {this.props.list.id}
        isDropDisabled = {this.props.isDropDisabled}>
        
            {(provided, snapshot) => (
                <TaskList
                 ref = {provided.innerRef}
                 {...provided.droppableProps}
                 
                 >
                {this.props.list.taskIds.map((task, index) =>
                <Task key = {task.id} task = {task} index={index}/>)}
                {provided.placeHolder}
            </TaskList>
            )}

   
        </Droppable>
        </Container>
        );
    }

}

export default MainList;
 


/**
 * import { makeStyles } from '@material-ui/core/styles';

        <List className={classes.root}>
            {this.props.tasks.map((task, index) =>
             <Task task = {task.content} />)}
        </List>




 */