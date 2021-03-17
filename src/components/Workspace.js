// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import ToDoItem from './ToDoItem'
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import AddBox from '@material-ui/icons/AddBox';
import Delete from '@material-ui/icons/Delete';
import Close from '@material-ui/icons/Close';

class Workspace extends Component {
    constructor(props) {
        super(props);

        this.state = {
            undoAvailable: false,
            redoAvailable: false,
            viewingList: false
        };
    }
    removeSpecificItem = (itemID) => {
        this.props.removeListItemCallback(itemID);
        let undoAvailable = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailable = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailable,
            redoAvailable: redoAvailable
        });
    }
    moveSpecificItemUp = (itemID) => {
        this.props.moveListItemUpCallback(itemID);
        let undoAvailable = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailable = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailable,
            redoAvailable: redoAvailable
        });
    }
    moveSpecificItemDown = (itemID) => {
        this.props.moveListItemDownCallback(itemID);
        let undoAvailable = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailable = this.props.transactionHandler.hasTransactionToRedo();
        console.log("UNDO AVAILABLE??? " + undoAvailable);
        console.log("REDO AVAILABLE??? " + redoAvailable);
        this.setState({
            undoAvailable: undoAvailable,
            redoAvailable: redoAvailable
        });
    }
    changeSpecificItemTask = (item, oldTask, newTask) => {
        this.props.handleSpecificTaskChangeCallback(item, oldTask, newTask);
        let undoAvailable = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailable = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailable,
            redoAvailable: redoAvailable
        });
    }
    changeSpecificItemStatus = (item, oldStatus, newStatus) => {
        this.props.handleSpecificStatusChangeCallback(item, oldStatus, newStatus);
        let undoAvailable = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailable = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailable,
            redoAvailable: redoAvailable
        });
    }
    changeSpecificItemDueDate = (item, oldDate, newDate) => {
        this.props.handleSpecificDueDateChangeCallback(item, oldDate, newDate);
        let undoAvailable = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailable = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailable,
            redoAvailable: redoAvailable
        });
    }
    enableUndoButton = () => {
        console.log("Enabling Undo");
        this.setState({
            undoAvailable: true
        });
    }
    enableRedoButton = () => {
        console.log("Enabling Redo");
        this.setState({
            redoAvailable: true
        });
    }
    disableUndoButton = () => {
        console.log("Disabling Undo");
        this.setState({
            undoAvailable: false
        });
    }
    disableRedoButton = () => {
        console.log("Disabling Redo");
        this.setState({
            redoAvailable: false
        });
    }

    closeListCallback = () => {
        // console.log("CLEARING LIST VIEW");
        // let workspace = document.getElementById("workspace");
        // let toDoItems = document.getElementById("todo-list-items-div");
        // toDoItems.style.visibility = "hidden";
        console.log(this.props.appState);
        this.props.appState.setState({
            currentList: {items: []},
            viewingList: false
        });
        
        this.setState({
            undoAvailable: false,
            redoAvailable: false,
            viewingList: false
        });
    }

    handleUndoFunctionCallback = () => {
        this.props.undoTransactionCallback();
        let undoAvailable = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailable = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailable,
            redoAvailable: redoAvailable
        });
    }

    handleRedoFunctionCallback = () => {
        this.props.redoTransactionCallback();
        let undoAvailable = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailable = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailable,
            redoAvailable: redoAvailable
        });
    }
    
    // deleteListItemCallback = () => {
    //     console.log("DELETING LIST CURRENT ITEM");
    // }

    render() {

        let redoEnabled = "enabled";
        if(!this.state.redoAvailable)
            redoEnabled = "disabled";

        let undoEnabled = "enabled";
        if(!this.state.undoAvailable)
            undoEnabled = "disabled";
            
        let viewingList = "enabled";
        if(!this.props.appState.state.viewingList){
            viewingList = "disabled";
        }

        let viewingListON = this.props.appState.state.viewingList;
        console.log(this.props.appState.state.viewingList);
        console.log(viewingListON);
        console.log("VIEWING LIST: " + viewingList);
        
        return (
            <div id="workspace">
                <div id="todo-list-header-card" className="list-item-card-head">
                    <div id="task-col-header" className="item-col">Task</div>
                    <div id="date-col-header" className="item-col">Due Date</div>
                    <div id="status-col-header" className="item-col">Status</div>
                    <div className="item-col button-group" display="flex" flexDirection="row" flexWrap="nowrap">
                        
                        <Undo id="undo-button" className="list-item-control material-icons todo-button" className={undoEnabled} 
                        onClick={
                            (this.state.undoAvailable ? this.handleUndoFunctionCallback : null)
                        }/>
                        
                        <Redo id="redo-button" className="list-item-control material-icons todo-button" className={redoEnabled} 
                        onClick={
                            (this.state.redoAvailable ? this.handleRedoFunctionCallback : null)
                        }/>
                        <AddBox id="add-item-button" className="list-item-control material-icons todo-button" className={viewingList} 
                        onClick={
                            (this.state.viewingList ? this.addNewListItemCallback : null)
                        }/>
                        <Delete id="delete-list-button" className="list-item-control material-icons todo-button" className={viewingList} 
                        onClick={
                            
                            (this.props.appState.state.viewingList ? 
                                (this.props.deleteListItemCallback )
                                : null)
                        }/>
                        <Close id="close-list-button" className="list-item-control material-icons todo-button" className={viewingList} 
                        onClick={
                            this.props.appState.state.viewingList ? this.closeListCallback : null
                        }/>
                    </div>
                </div>
                <div id="todo-list-items-div">
                    {
                        this.props.toDoListItems.map((toDoListItem) => (
                        <ToDoItem
                            key={toDoListItem.id}
                            list={this.props.toDoListItems}
                            toDoListItem={toDoListItem}     // PASS THE ITEM TO THE CHILDREN
                            removeItemCallback={this.removeSpecificItem}
                            moveItemUpCallback={this.moveSpecificItemUp}
                            moveItemDownCallback={this.moveSpecificItemDown}
                            handleTaskChangeCallback={this.changeSpecificItemTask}
                            handleStatusChangeCallback={this.changeSpecificItemStatus}
                            handleDueDateChangeCallback={this.changeSpecificItemDueDate}
                        />))
                    }
                </div>
                <br />
            </div>
        );
    }
}

export default Workspace;