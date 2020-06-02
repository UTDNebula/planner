import React from 'react';
import MainList from './MainList'; 
import initialData from './initial-data';
import AllBoards from './allboards';
import { withStyles } from '@material-ui/core/styles';
import { DragDropContext } from 'react-beautiful-dnd';

const style = (theme) => ({
  root:{
    display: 'flex',
    flexDirection: 'row',
  },
});



class App extends React.Component{

  state = initialData; 

  onDragStart = (start) =>{

    const homeIndex = (start.source.droppableId === 'courselist') ? 
    13 : this.state.columnOrder.indexOf[start.source.droppableId];

    this.setState({
      homeIndex, 
    }); 

  }

  onDragEnd = result => {
    this.setState({
      homeIndex: null,
    });

    const { destination, source, draggableId } = result; 

    if(!destination){
      return; 
    }

    if(
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ){return;}



      //returns either the semester boards or the mainlist 
      const home = (source.droppableId === 'courselist') ? 
      this.state.courselist : this.state.semesters[source.droppableId];


      //contains the destination droppable Id 'courselist' or 'semesters'
      const foreign = (destination.droppableId === 'courselist') ? 
      this.state.courselist : this.state.semesters[destination.droppableId];

  
     
      
    //moving from one list to another
    const hometaskIds = Array.from(home.taskIds);

   
    hometaskIds.splice(source.index, 1);

    //the new state of the previous column a card left 
    const newHome = {
      ...home,
      taskIds: hometaskIds, 
    };

   
    //the new state of the new column a card went into
    const foreignTaskIds = Array.from(foreign.taskIds);
    foreignTaskIds.splice(destination.index, 0, draggableId);

    const newForeign = {
      ...foreign,
      taskIds: foreignTaskIds,
    };

    console.log(newHome);
    console.log(newForeign);
  //the problem is newhome or newforeign can either be semester or courselist

  if(newHome.id === 'courselist' && newForeign.id !== 'courselist'){
    const newState = {
      ...this.state, 
      semesters: {
        ...this.state.semesters, 
        [newForeign.id] : newForeign, 
        
      },
      courselist:{
        ...this.state.courselist,
         taskIds: newHome.taskIds, 
      },
    };

    this.setState(newState);
 //   console.log(newState);
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
        ...this.state.semesters, 
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
        ...this.state.semesters,
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
        ...this.state.semesters, 
        [newHome.id] : newHome, 
        
      },
      courselist:{
        ...this.state.courselist,
         taskIds: newForeign.taskIds, 
      },
    }

    this.setState(newState);
  //  console.log(newState);
  }
    
  }

  render(){


    const tasks = this.state.courselist.taskIds.map(taskId => this.state.tasks[taskId]);
    const semesters = this.state.columnOrder.map(column => this.state.semesters[column]);

    console.log(tasks);

    const list = this.state.courselist; 
    const {classes} = this.props;
    const isDropDisabled = false;

      return(
        <DragDropContext
          onDragStart = {this.onDragStart}
          onDragEnd = {this.onDragEnd} >
        <div className={classes.root}>
          
        <MainList
          key = {list.id} 
          tasks = {tasks} 
          semesters = {semesters} 
          list = {list} 
          isDropDisabled={isDropDisabled} />
        <AllBoards semesters = {semesters} tasks = {tasks} />
        </div>
        </DragDropContext>
      );
     
    }
};

export default withStyles(style)(App);






      /** 
      if(home === foreign){
        const newTaskIds = Array.from(home.taskIds);
        newTaskIds.splice(source.index,1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newHome = {
          ...home, 
          taskIds: newTaskIds, 
        };

        const newState = {
          ...this.state,
          columns:{
            ...this.state.columns, 
            [newHome.id] : newHome, 
          },
        };

        this.setState(newState); 
        return; 

      }
      */

      



  /** 

  const newState = (newHome.id === 'courselist')?
  {
    ...this.state, 
    semesters: {
      ...this.state.semesters, 
      [newForeign.id] : newForeign, 
      
    },
    courselist:{
      ...this.state.courselist,
       taskIds: newHome.taskIds, 
    },
  }:
  {
    ...this.state, 
    semesters: {
      ...this.state.semesters, 
      [newHome.id]: newHome, 
    },
    courselist:{
      ...this.state.courselist, 
      taskIds: newForeign.taskIds, 
    }

  };

*/
  
    


    /** 
    const diffState = (newHome.id != 'courselist' && newForeign.id != 'courselist')?
    {
      ...this.state, 
      semesters:{
        ...this.state.semesters, 
        [newHome.id]: newHome, 
        [newForeign.id]: newForeign, 
      },
    }:
    {
      ...this.state,
    };

    this.setState(diffState);
 */


