import * as React from "react";
import initial from './initial-data';
import { Sidebar } from './sidebar';
import { AllBoards } from './all-boards'; 

import {DragDropContext}  from 'react-beautiful-dnd'; 


//interface and type declarations 
interface initialData {
    tasks: {
        [key: string]:task
    };
    semesters: {
        [key: string]: semester
    };
    courselist: list;
    columnOrder: string[]; 
    homeIndex: number | null; 
};



type task = {
    id: string;
    content: string; 
};

type semester = {
    id: string;
    title: string; 
    taskIds: string[]; 
}; 

type list = {
    id: string;
    title: string; 
    taskIds: string[];
};

//sets up the component state interface
interface componentState {
    variable: initialData; 
}



export class App extends React.Component<any, componentState>{

    //the data object is inside variable
    state: componentState = {
        variable: initial,
    };

    //start is an object describing the starting drag
    onDragStart = (start: any) => {

        //contains the index of the card's home when dragging
        const num: number = this.state.variable.columnOrder.indexOf(start.source.droppableId); 

        //checks if card's home is the mainlist or within semester boards
        const indexHome: number = (start.source.droppableId === 'courselist') ? 
        13 : num;

        //creates a new state with different homeIndex and puts it in variable
        const newVar = {
            ...initial, 
            homeIndex: indexHome, 
        }
    
        //sets the new state
        this.setState({
          variable: newVar, 
        });       
    }


    onDragEnd = (result: any) => {

        const newVar = {
            ...initial, 
            homeIndex: null, 
        }
        this.setState({
            variable: newVar, 
        }); 


        const { destination, source, draggableId } = result; 

        //doesn't go out of bounds
        if(!destination){
            return; 
        }

        //card is on the same place
        if(destination.droppableId === source.droppableId &&
            destination.index === source.index){
                return; 
        }

        //where the card is dragged from 
        const home: semester | list = (source.droppableId === 'courselist') ?
        this.state.variable.courselist : this.state.variable.semesters[destination.droppableId];


        //where the card is being dragged to 
        const foreign: semester| list = (source.droppableId === 'courselist') ?
        this.state.variable.courselist: this.state.variable.semesters[destination.droppableId]; 

        //contains the task ids inside a specific board
        const hometaskIds: string[] = Array.from(home.taskIds); 

        //removes that specific task from the home board
        hometaskIds.splice(source.index, 1); 

        //new state of the previous column a card left 
        const newHome = {
            ...home, 
            taskIds: hometaskIds, 
        }; 

        console.log(newHome); 

        //contains the task ids inside the board that the card is dropping to
        const foreigntaskIds: string[] = Array.from(foreign.taskIds); 

        //removes that specific task from the destination board
        foreigntaskIds.splice(destination.index, 0, draggableId); 

        const newForeign = {
            ...foreign, 
            taskIds: foreigntaskIds, 
        }

        console.log(newForeign);

        //moving of cards between different boards 
        if(newHome.id === 'courselist' && newForeign.id !== 'courselist'){
            const newState = {
                ...this.state, 
                semesters: {
                    ...this.state.variable.semesters, 
                    [newForeign.id] : newForeign, 
                }, 
                courselist: {
                    ...this.state.variable.courselist, 
                    taskIds: newHome.taskIds, 
                }, 
            }; 

            this.setState(newState); 
        }
        else if (newHome.id === newForeign.id){

            const newTaskIds = Array.from(home.taskIds);
            newTaskIds.splice(source.index,1);
            newTaskIds.splice(destination.index, 0, draggableId);
        
            const newHome = {
              ...home,
              taskIds: newTaskIds, 
            };
        
            const newState = {
              ...this.state, 
              semesters: {
                ...this.state.variable.semesters, 
                [newHome.id] : newHome,
              },
            };
        
            this.setState(newState);
          //  console.log(newState);
          }
          else if(newHome.id !== 'courselist' && newForeign.id !== 'courselist' ){
            const newState = {
              ...this.state, 
              semesters:{
                ...this.state.variable.semesters,
                [newHome.id] : newHome, 
                [newForeign.id] : newForeign, 
              },
            };
            this.setState(newState);
          }
          else if (newHome.id !== 'courselist' && newForeign.id === 'courselist'){
            const newState = {
              ...this.state, 
              semesters: {
                ...this.state.variable.semesters, 
                [newHome.id] : newHome, 
                
              },
              courselist:{
                ...this.state.variable.courselist,
                 taskIds: newForeign.taskIds, 
              },
            }
        
            this.setState(newState);
          //  console.log(newState);
          }



    }

    render(){

       // tasks is an array containing all the individual task in list
        const tasks:any = this.state.variable.courselist.taskIds.map(taskId => this.state.variable.tasks[taskId]);

        //contains an array of tasks in a specific semester
        const semesters:semester[] = this.state.variable.columnOrder.map(column => this.state.variable.semesters[column]);

        return(
            <DragDropContext
               onDragStart = {this.onDragStart}
               onDragEnd = {this.onDragStart} >
            
            <AllBoards semesters = {semesters} tasks = {tasks} />
            <Sidebar tasks = {tasks} list = {this.state.variable.courselist} />
            </DragDropContext>
        );
        
    }
}