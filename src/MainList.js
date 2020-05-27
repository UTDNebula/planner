import React from 'react'; 
import { List } from '@material-ui/core'; 
import Task from './task.js'; 
import { withStyles } from '@material-ui/core/styles';
import { Droppable } from 'react-beautiful-dnd';

//using higher order material ui stuff
const style = (theme) => ({
    root:{
        backgroundColor: 'lightgrey',
        width: 250,
        maxHeight: '100vh',
        overflow: 'auto',
    },

});


class MainList extends React.Component {

    render(){
        const { classes } = this.props; 
       // console.log(this.props);
        return(
        <div>
        <Droppable droppableId = {this.props.list.id}
        isDropDisabled = {this.props.isDropDisabled}>
        
            {(provided, snapshot) => (
                <List
                 className={classes.root}
                 ref = {provided.innerRef}
                 {...provided.droppableProps}
                 
                 >
                {this.props.list.taskIds.map((task, index) =>
                <Task key = {task.id} task = {task} index={index}/>)}
                {provided.placeHolder}
            </List>
            )}

   
        </Droppable>
        </div>
        );
    }

}

export default withStyles(style)(MainList);
 


/**
 * import { makeStyles } from '@material-ui/core/styles';

        <List className={classes.root}>
            {this.props.tasks.map((task, index) =>
             <Task task = {task.content} />)}
        </List>




 */