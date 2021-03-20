// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'

class ListLink extends Component {
    constructor(props) {
        super(props);
        this.nameInput = React.createRef();
        this.state={
            newName: this.props.toDoList.name,
            editingListName: false
        }
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
        this.setState({
            editingListName: true
        });
    }

    setNewName = (newName) => {
        let listID = this.props.currentListID;
        console.log(newName + " NEW NAME AND " + listID);
        this.props.changeListName(newName, listID);
    }



    // allowEdit = (toDoListID) => {
    //     let listElement = document.getElementById('todo-list-button-'+toDoListID);
    //     listElement.addEventListener("keyup", function(event) {
    //         // Number 13 is the "Enter" key on the keyboard
    //         if (event.keyCode === 13) {
    //           // Cancel the default action, if needed
    //           listElement.blur();
    //         }
    //       });
    //     listElement.onblur = () => {
    //         console.log("BLUIRRED");
    //         listElement.innerHTML.trim();
    //         listElement.contentEditable = false;
    //     }
        
    //     listElement.contentEditable = true;
    // }

    render() {
        // DISPLAY WHERE WE ARE
        // console.log("\t\t\tListLink render");
        let isCurrentList = false;
        let topOfToDoList = "notCurrentList";
        if(this.props.currentListID==this.props.toDoList.id){
            isCurrentList = true;
            topOfToDoList = "currentList";
        }
        // console.log("CURRENT LIST: " + this.props.currentListID);
        // console.log("ALL LIST IDS: " + this.props.appState.state.toDoLists);
        let toDoButton = <div 
                            id={'todo-list-button-'+this.props.toDoList.id}
                                className='todo-list-button' className={topOfToDoList}
                                onClick={() => {
                                    if(isCurrentList) {return;}
                                    this.props.loadToDoListCallback(this.props.toDoList);
                                }}
                                onDoubleClick={()=>{
                                    if(!isCurrentList){return;}
                                    this.setState({editingListName: true})
                                }}
                            >
                                {this.props.toDoList.name}<br />
                        </div>
                        
        let editableListText = <input autoFocus={true} type='text' contentEditable={true} ref={this.nameInput}
                                defaultValue={this.props.toDoList.name}
                                id={'todo-list-input-'+this.props.toDoList.id}
                                 classname={'listTextInput'} className='todo-list-button' className={topOfToDoList}
                                
                            onBlur={()=> {
                                console.log("CURRENT NAME: " + this.state.newName);
                                console.log(this.nameInput.current.value);
                                this.setState({
                                    newName: this.nameInput.current.value,
                                    editingListName: false
                                });
                                if(this.nameInput.current.value=="")
                                    this.setNewName("Untitled");
                                else
                                this.setNewName(this.nameInput.current.value);
                            }}
                        />
                        
        return (<div>
        
            {(this.state.editingListName) ? editableListText : toDoButton}

        </div>
        )
    }
}

export default ListLink;