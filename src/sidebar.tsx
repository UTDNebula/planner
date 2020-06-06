import * as React from 'react';  
import { Course } from './course'; 
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
    flex-grow: 1; 
    
`; 

type list = {
    id: string;
    title: string; 
    taskIds: string[];
};

type task = {
    id: string;
    content: string; 
};

//contains the semester props
interface componentProps {
    tasks: {
        [key:string]: task; 
    }; 
    list: list; 
}



export class Sidebar extends React.Component<componentProps, {}> {

    render(){

        const tasks: any = this.props.tasks;
        
       // console.log(this.props);
        return(
        <Container>
        <Droppable droppableId = {this.props.list.id}>
        {(provided, snapshot) => (
            <TaskList
             ref = {provided.innerRef}
             {...provided.droppableProps}
             
             >
                {this.props.list.taskIds.map((course: string, index: number) =>
                <Course course = {course} tasks = {tasks} index = {index}/>)}
            {provided.placeholder}
        </TaskList>
        )}


    </Droppable>
        </Container>
        );
    }

}


 


/**


 */