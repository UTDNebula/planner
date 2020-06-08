const initialData = {
    tasks: {
        'task-1': {id: 'task-1', content: 'one'},
        'task-2': {id : 'task-2', content: 'two'},
        'task-3': {id: 'task-3', content: 'three'},
        'task-4': {id: 'task-4', content: 'four'},
        'task-5': {id: 'task-5', content: 'five'},
        'task-6': {id : 'task-6', content: 'six'},
        'task-7': {id: 'task-7', content: 'seven'},
        'task-8': {id: 'task-8', content: 'eight'},
    },
    semesters: {
        'semester-1': {
            id: 'semester-1',
            title: 'fall',
            taskIds: [],
        },
        'semester-2': {
            id: 'semester-2',
            title: 'spring',
            taskIds: [],
        },
        'semester-3':{
            id: 'semester-3',
            title: 'summer',
            taskIds: [],
        },
        
    },
    courselist: {
        id: 'courselist',
        title: 'Courses',
        taskIds:['task-1', 'task-2','task-3','task-4'
            ,'task-5', 'task-6','task-7'],
    },
    columnOrder: ['semester-1', 'semester-2', 'semester-3'],
    homeIndex: null,
};

export default initialData; 