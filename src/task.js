import React from 'react'; 
import { withStyles } from '@material-ui/core/styles';
import {Card} from '@material-ui/core';
import {CardContent} from '@material-ui/core';
import {Typography} from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';


const Container = styled.div`
    border: 1px solid lightgrey;
    padding: 8px; 
    border-radius: 2px; 
    margin-bottom: 8px; 
    height: 100px;
    background-color: ${props => (props.isDragging ? 'lightgreen': 'white')};
    display: flex; 
`;

/** 
const style = (theme) => ({
    root:{
        borderRadius:'15px',
        height: 50,
        margin: 5,
    },

});
**/

class Task extends React.Component {
    render(){
        const {classes} = this.props; 
        console.log(this.props);
        return(
            <Draggable draggableId={this.props.task} key = {this.props.task} index={this.props.index}>
            {(provided, snapshot) => (
                <Container
                {...provided.draggableProps}
                ref = {provided.innerRef}
                isDragging = {snapshot.isDragging}
                {...provided.dragHandleProps}
                >
                
                       
                        {this.props.task}
                  
                </Container>
            )}

       </Draggable>



        );
    }
}

export default Task;


/**
 *       <Draggable draggable={this.props.task.id} index={this.props.index}>
           {(provided, snapshot) => (
            <Card 
            className = {classes.root}
            {...provided.draggableProps}
            ref = {provided.innerRef}
            isDragging = {snapshot.isDragging} >
            <CardContent>
                <Typography>
                    {this.props.task}
                </Typography>
            </CardContent>
        </Card>
           )}

           </Draggable>   
 */