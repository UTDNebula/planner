import * as React from "react";
import styled from "styled-components";
import { Draggable } from 'react-beautiful-dnd'; 

const Container = styled.div`
    border: 1px solid lightgrey;
    padding: 8px; 
    border-radius: 2px; 
    margin-bottom: 8px; 
    height: 100px;
    display: flex;
`;

type task = {
    id: string;
    content: string; 
};

//contains the semester props
interface componentProps {
    course: string; 
    tasks: {
        [key:string]: task
    };  
    index: number; 
}

export class Course extends React.Component<componentProps, {}>{

    render(){

     //  const name: string = this.props.tasks.filter(task => task.id === this.props.course); 
       
      // console.log(this.props.tasks[0]);



        return(
            <Draggable 
            draggableId = {this.props.course}
            key = {this.props.course}
            index = {this.props.index}>
        {(provided, snapshot) => (
            <Container
            {...provided.draggableProps}
            ref = {provided.innerRef}
            {...provided.dragHandleProps}
            >
                    {this.props.course}
              
            </Container>
        )}
            </Draggable>
        )
    }
}

/**
 *
 * 
 * 
 */