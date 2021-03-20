// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Close from '@material-ui/icons/Close';

function updateState(params) {
    this.setState({params});
}

class ToDoItem extends Component {
    constructor(props) {
        super(props);
        
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " constructor");
        //Binds scope of this to our handleTaskChange
        // this.handleTaskChange = this.handleTaskChange.bind(this);
        // this.handleDueDateChange = this.handleDueDateChange.bind(this);
        // this.handleStatusChange = this.handleStatusChange.bind(this);
        // this.handleRemoveItem = this.handleRemoveItem.bind(this);

        this.taskInput = React.createRef();
        this.dueDateInput = React.createRef();
        this.statusInput = React.createRef();

        this.alterTaskState = this.alterTaskState.bind(this);

        //To do it correctly: set the state
        this.state = {
            task: this.props.toDoListItem.description,
            dueDate: this.props.toDoListItem.due_date,
            status: this.props.toDoListItem.status,
            editingTask: false,
            editingDueDate: false,
            editingStatus: false,
            topOfList: false,
            bottomOfList: false
        }
        updateState = updateState.bind(this);
    }
    
    alterTaskState = (newTask) => {
        this.setState({
            task: newTask
        });
    }

    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " did mount");
    }

    handleTaskChange = (oldTask, newTask) => {
        this.props.handleTaskChangeCallback(this.props.toDoListItem, oldTask, newTask);
    }

    //Allows the due-date of the Item object to be changed
    handleDueDateChange(oldDate, newDate) {
        this.props.handleDueDateChangeCallback(this.props.toDoListItem, oldDate, newDate);
    }

    handleStatusChange = (oldStatus, newStatus) => {
        this.props.handleStatusChangeCallback(this.props.toDoListItem, oldStatus, newStatus);
    }
// Reference
    // handleLoadList = () => {
    //     this.props.loadToDoListCallback(this.props.toDoList);
    // }

    //Handles removal of Item from the list
    handleRemoveItem = () => {
        console.log("Removing Item");
        let listItem = this.props.toDoListItem;
        
        this.props.removeItemCallback(listItem.id);
        
        
        //IMPLEMENTATION NEEDED TO ASSIST REDO/UNDO
    }
    //Handles moving up of Item from the list
    handleMovingUpItem = () => {
        console.log("Moving Item Up");
        let listItem = this.props.toDoListItem;
        // this.props.loadToDoListCallback(this.props.toDoList);
        this.props.moveItemUpCallback(listItem.id);
        
        
        //IMPLEMENTATION NEEDED TO ASSIST REDO/UNDO
    }
    //Handles moving down of Item from the list
    handleMovingDownItem = () => {
        console.log("Moving Item Down");
        let listItem = this.props.toDoListItem;
        // this.props.loadToDoListCallback(this.props.toDoList);
        this.props.moveItemDownCallback(listItem.id);
        
        
        //IMPLEMENTATION NEEDED TO ASSIST REDO/UNDO
    }

    //To do it in proper REACT style: Have methods that return JavaScript objects
    createEditableTaskObject() {
        let listItem = this.props.toDoListItem;
    }
    createTaskDiv() {
        let listItem = this.props.toDoListItem;
    }

    render() {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem render");
        let listItem = this.props.toDoListItem;
        let statusType = "status-complete";
        if (listItem.status === "incomplete")
            statusType = "status-incomplete";
        // console.log("Description: " + listItem.description + " Due-Date: " + listItem.due_date + " Status: " + listItem.status);

        //Creating our items
        //Task Item (Uneditable Div and Editable input)
        let taskDiv = <div id={'todo-list-task-' + listItem.id} className='task-col' 
                        onClick={() => {
                            console.log("TRUE"); 
                            this.setState({
                                editingTask: true
                            });
                        }}>
                        {listItem.description}
                      </div>;
        let editableTaskObject = <input type="text" className='task-col' defaultValue={listItem.description} ref={this.taskInput}
                                     id={'todo-list-task-input-' + listItem.id} background='#40454e' color='#e9edf0'
                                      
                        onBlur={() => {
                            this.setState({
                                task: this.taskInput.current.value,
                                editingTask: false 
                            });
                            if(this.state.task!=this.taskInput.current.value)
                                this.handleTaskChange(this.state.task, this.taskInput.current.value);
                        }}>
                        </input>;
        let dueDateDiv = <div id={'todo-list-due-date-' + listItem.id} className={'due-date-col'}
                        onClick={() => {
                            this.setState({
                                editingDueDate: true
                            })
                        }}>
                            {listItem.due_date}
                        </div>;
        let editableDueDateObject = <input type="date" ref={this.dueDateInput} className={'due-date-col'} background="#353a44" color="#d9d6cc"
                        onBlur={() => {
                                console.log("FALSE");
                                console.log(this.state.dueDate); 
                                console.log(this.dueDateInput.current.value);
                            this.setState({
                                dueDate: this.dueDateInput.current.value,
                                editingDueDate: false 
                            });
                            if(this.state.dueDate!=this.dueDateInput.current.value)
                                this.handleDueDateChange(this.state.dueDate, this.dueDateInput.current.value);
                        }}>
                        </input>

        let statusDiv = <div id={'todo-list-status-' + listItem.id} className={statusType} 
                        onClick={() => {
                            this.setState({
                                editingStatus: true
                            })
                        }}>
                            {listItem.status}
                        </div>
        let editableStatusObject = <select className={"status-col"} background="#353a44" ref={this.statusInput} color = "#d9d6cc" 
                        onBlur={() => {
                            console.log("FALSE");
                            console.log(this.state.status); 
                            console.log(this.statusInput.current.value);
                            this.setState({
                                status: this.statusInput.current.value,
                                editingStatus: false 
                            });
                            if(this.state.status!=this.statusInput.current.value)
                                this.handleStatusChange(this.state.status, this.statusInput.current.value);
                        }}>
                            <option className={"complete-option"} defaultText="complete" background = "#353a44" color = "#19c8ff">{"complete"}</option>
                            <option className={"incomplete-option"} defaultText="incomplete" background = "#353a44" color = "#ffc819">{"incomplete"}</option>
                        </select>;

        let upEnabled = "enabled";
        if(this.props.list[0].id===listItem.id)
            upEnabled = "disabled";

        let downEnabled = "enabled";
        if(this.props.list[this.props.list.length-1].id===listItem.id)
            downEnabled = "disabled";

        return (
            //This is the main toDoList item; contains all smaller components
            //task-col should be made editable as a text field when clicked on
            //due-date-col should open up a calendar input when clicked on
            //status-col should open up a dropdown input when clicked on
            //test-4-col appears to be padding - don't do anything to it
            //list-controls-col contains all the buttons for specific functions for the particular Item
            <div id={'todo-list-item-' + listItem.id} className='list-item-card'>

                {this.state.editingTask ? editableTaskObject : taskDiv}
                {this.state.editingDueDate ? editableDueDateObject: dueDateDiv}
                {this.state.editingStatus ? editableStatusObject : statusDiv}

                <div className='test-4-col'></div>

                <div className='list-controls-col'>
                    <KeyboardArrowUp id={'move-down-button-'+listItem.id} className='list-item-control todo-button' className={upEnabled} onClick={this.handleMovingUpItem}/>
                    <KeyboardArrowDown id={'move-up-button-'+listItem.id} className='list-item-control todo-button' className={downEnabled} onClick={this.handleMovingDownItem}/>
                    <Close id={'close-button-'+listItem.id} className='list-item-control todo-button' onClick={this.handleRemoveItem}/>
                    <div className='list-item-control'></div>
            <div className='list-item-control'></div>
                </div>
            </div>
        )
    }

}

export default ToDoItem;