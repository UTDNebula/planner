import React from 'react'; 
import { Board } from './board';
import styled from 'styled-components'; 

const Wrapper = styled.div`
    display: flex; 
    flex-direction: row;
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
    semesters: semester[];
    tasks: {
        [key:string]: task
    }; 
}


export class AllBoards extends React.Component<componentProps, {}>{

    render(){

    //pass down the tasks object to board
      const tasks: any = this.props.tasks; 

    

        return(
            <Wrapper>
                {this.props.semesters.map(semester =>
                <Board key = {semester.id} 
                    semester = {semester}
                    tasks = {tasks} />)
                }
            </Wrapper>
        )
    }
}

/**
 *             {this.props.semesters.map((semester, index) => 
            <Board key = {semester.id} semester = {semester} index = {index} tasks = {tasks}/>)}
            
 */

 