import * as React from 'react'; 
import { Droppable } from 'react-beautiful-dnd';
import { Course } from './course';
import styled from 'styled-components';


const Container = styled.div`
    margin: 8px; 
    border: 1px solid black; 
    border-radius: 2px; 
    width: 300px;
    height: 400px;
    overflow: auto;
    display: flex; 
    flex-direction: column; 
    `;
const TaskList = styled.div`
    padding: 9px; 
    font-family: Arial; 
    flex-grow: 1; 
`; 

type semester = {
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
    semester: semester; 
    tasks: {
        [key:string]: task; 
    }; 
}



export class Board extends React.Component<componentProps, {}>{

    render(){

        const task:task[] = this.props.semester.taskIds.map(task =>
             this.props.tasks[task]);

        //contains the masterlist 
        const tasks: any = this.props.tasks; 
       
        return( 
        <Container>
            <Droppable droppableId = {this.props.semester.id}>
            {(provided, snapshot) => (
                <TaskList
                 ref = {provided.innerRef}
                 {...provided.droppableProps}
                 >
                {this.props.semester.taskIds.map((course, index) =>
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
 *        



 */

