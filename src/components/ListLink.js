// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'

class ListLink extends Component {
    constructor(props) {
        super(props);
        
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink " + this.props.toDoList.key + " constructor");
    }

    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink " + this.props.toDoList.key + " did mount");
    }

    handleLoadList = () => {
        this.props.loadToDoListCallback(this.props.toDoList);
        console.log("LIST ID: " + this.props.currentListID + " VS " + this.props.toDoList.id);
    }

    allowEdit = (toDoListID) => {
        let listElement = document.getElementById('todo-list-button-'+toDoListID);
        listElement.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
              // Cancel the default action, if needed
              listElement.blur();
            }
          });
        listElement.onblur = () => {
            console.log("BLUIRRED");
            listElement.innerHTML.trim();
            listElement.contentEditable = false;
        }
        
        listElement.contentEditable = true;
    }

    render() {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tListLink render");

        let topOfToDoList = "notCurrentList";
        if(this.props.currentListID==this.props.toDoList.id)
            topOfToDoList = "currentList";
        console.log("CURRENT LIST: " + this.props.currentListID);
        // console.log("ALL LIST IDS: " + this.props.appState.state.toDoLists);

        return (
            <div 
                id={'todo-list-button-'+this.props.toDoList.id}
                className='todo-list-button' className={topOfToDoList}
                onClick={this.handleLoadList}
            >
                {this.props.toDoList.name}<br />
            </div>
        )
    }
}

export default ListLink;