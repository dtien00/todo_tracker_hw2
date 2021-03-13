// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Close from '@material-ui/icons/Close';

class ToDoItem extends Component {
    constructor(props) {
        super(props);
        
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " constructor");
        //Binds scope of this to our handleTaskChange
        this.handleTaskChange = this.handleTaskChange.bind(this);
        this.handleDueDateChange = this.handleDueDateChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
    }

    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " did mount");
    }

    //Allows the textfield of the task column to be changed
    handleTaskChange() {
        console.log("Changing Task");
        let listItem = this.props.toDoListItem;
        let taskColumn = document.getElementById('todo-list-task-' + listItem.id);
        taskColumn.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
              // Cancel the default action, if needed
              taskColumn.blur();
            }
          });
        taskColumn.contentEditable = true;

        //IMPLEMENTATION NEEDED TO ASSIST REDO/UNDO
    }

    //Allows the due-date of the Item object to be changed
    handleDueDateChange() {
        console.log("Changing due-date");
        let listItem = this.props.toDoListItem;
        let itemDiv = document.getElementById('todo-list-item-' + listItem.id); //We have access to the current div item
        let dueDate = document.getElementById('todo-list-due-date-' + listItem.id); //We have access to the specific date div
        let calendar = document.createElement("input"); //We create an input element
        calendar.type = "date"; //We make it of type date; opens up a calendar for us
        calendar.className = "item-col due-date-col";   //To ensure when we load up the calendar to replace the div, same padding
        calendar.style.background = "#353a44";  //Changes background color
        calendar.style.color = "#d9d6cc"; //Changes font color
        itemDiv.replaceChild(calendar, dueDate);    //Replaces the dueDate div with the calendar object  
        calendar.contentEditable = true;    //Allows us to edit the calendar
        calendar.addEventListener('blur', (event) => {  //Code for when the calendar object loses focus
            let newDate = calendar.value;   //Preserves new date the calendar was inputted
            itemDiv.replaceChild(dueDate, calendar);    //Replaces the div back in place of the calendar
            dueDate.innerHTML = newDate;    //Sets the div to the value of what the calendar was changed to
            if(dueDate.innerHTML == "" || dueDate.innerHTML == null)    //If the due date was left blank, placeholder text is set
                dueDate.innerHTML = "N/A: Assign a Date";
          });
        
        //IMPLEMENTATION NEEDED TO ASSIST REDO/UNDO
        
    }

    handleStatusChange() {
        console.log("Changing status");
        let listItem = this.props.toDoListItem;
        let itemDiv = document.getElementById('todo-list-item-' + listItem.id); //We have access to the current div item
        let status = document.getElementById('todo-list-status-' + listItem.id); //We have access to the specific date div
        let statusMenu = document.createElement("select"); //We create an input element
        statusMenu.className = "item-col status-col";   //To ensure when we load up the dropdown to replace the div, same padding
        statusMenu.style.background = "#353a44";  //Changes background color
        statusMenu.style.color = "#d9d6cc"; //Changes font color
        //Options for the dropdown
        let completeOption = document.createElement("option");
        completeOption.innerHTML = "complete";
        completeOption.style.background = "#353a44";  //Changes background color
        completeOption.style.color = "#19c8ff"; //Changes font color
        statusMenu.appendChild(completeOption);
        let incompleteOption = document.createElement("option");
        incompleteOption.innerHTML = "incomplete";
        incompleteOption.style.background = "#353a44";  //Changes background color
        incompleteOption.style.color = "#ffc819"; //Changes font color
        statusMenu.appendChild(incompleteOption);

        itemDiv.replaceChild(statusMenu, status);    //Replaces the dueDate div with the calendar object
        statusMenu.addEventListener('blur', (event) => {  //Code for when the calendar object loses focus
            let optionChosen = statusMenu.value;
            itemDiv.replaceChild(status, statusMenu);
            status.innerHTML = optionChosen;
            if(status.innerHTML == "complete")
                status.style.color = "#19c8ff";
            else
                status.style.color = "#ffc819"
          });
        
        //IMPLEMENTATION NEEDED TO ASSIST REDO/UNDO
    }

    render() {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem render");
        let listItem = this.props.toDoListItem;
        let statusType = "status-complete";
        if (listItem.status === "incomplete")
            statusType = "status-incomplete";

        return (
            //This is the main toDoList item; contains all smaller components
            //task-col should be made editable as a text field when clicked on
            //due-date-col should open up a calendar input when clicked on
            //status-col should open up a dropdown input when clicked on
            //test-4-col appears to be padding
            //list-controls-col contains all the buttons for specific functions for the particular Item
            <div id={'todo-list-item-' + listItem.id} className='list-item-card'>
                <div id={'todo-list-task-' + listItem.id} className='item-col task-col' onClick={this.handleTaskChange}>
                    {listItem.description}
                </div>
                <div id={'todo-list-due-date-' + listItem.id} className='item-col due-date-col' onClick={this.handleDueDateChange}>
                    {listItem.due_date}
                </div>
                <div id={'todo-list-status-' + listItem.id} className='item-col status-col' className={statusType} onClick={this.handleStatusChange}>
                    {listItem.status}
                </div>
                <div className='item-col test-4-col'></div>
                <div className='item-col list-controls-col'>
                    <KeyboardArrowUp className='list-item-control todo-button' />
                    <KeyboardArrowDown className='list-item-control todo-button' />
                    <Close className='list-item-control todo-button' />
                    <div className='list-item-control'></div>
        <div className='list-item-control'></div>
                </div>
            </div>
        )
    }

}

export default ToDoItem;