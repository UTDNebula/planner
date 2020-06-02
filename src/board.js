import React from 'react'; 
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';
import styled from 'styled-components';


const Container = styled.div`
    margin: 8px; 
    border: 1px solid black; 
    border-radius: 2px; 
    width: 500px;
    height: 300px;
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



class Board extends React.Component{

    render(){
        const {classes} = this.props; 
        //console.log(this.props);

        const task = this.props.semester.taskIds.map(task => this.props.tasks[task]);

       // console.log(task);
       
        return(
        
        <Container>
            <Droppable droppableId = {this.props.semester.id}
                isDropDisabled={this.props.isDisabled}>
            {(provided, snapshot) => (
                <TaskList
                 ref = {provided.innerRef}
                 {...provided.droppableProps}
                 isDraggingOver = {snapshot.isDraggingOver}
                 >
                {this.props.semester.taskIds.map((task, index) =>
                <Task key = {task.id} task = {task} index={index}/>)}
                {provided.placeHolder}
            </TaskList>
            
            )}
            </Droppable>
        </Container>
        );
    }

}

export default Board; 


/**

const style = (theme) => ({
    root:{
       borderColor: 'black',
       backgroundColor: 'lightgrey',
       width: 250,
       minHeight: 200,
       overflow: 'auto',
       display: 'flex',
       flexDirection: 'column',
        
    },
});

 */

