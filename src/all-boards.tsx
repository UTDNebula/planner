import React from 'react'; 
import { Board } from './board';

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

      console.log(this.props.tasks);

        return(
            <div>
                {this.props.semesters.map(semester =>
                <Board key = {semester.id} 
                    semester = {semester}
                    tasks = {tasks} />)
                }

            </div>
        )
    }
}

/**
 *             {this.props.semesters.map((semester, index) => 
            <Board key = {semester.id} semester = {semester} index = {index} tasks = {tasks}/>)}
            
 */

 