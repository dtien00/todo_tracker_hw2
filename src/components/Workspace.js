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
            undoAvailable: this.props.transactionHandler.hasTransactionToUndo(),
            redoAvailable: this.props.transactionHandler.hasTransactionToRedo(),
            viewingList: this.props.appState.state.viewingList

        };
    }
    removeSpecificItem = (itemID) => {
        this.props.removeListItemCallback(itemID);
        let undoAvailableP = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailableP = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailableP,
            redoAvailable: redoAvailableP
        });
    }
    moveSpecificItemUp = (itemID) => {
        this.props.moveListItemUpCallback(itemID);
        let undoAvailableP = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailableP = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailableP,
            redoAvailable: redoAvailableP
        });
    }
    moveSpecificItemDown = (itemID) => {
        this.props.moveListItemDownCallback(itemID);
        let undoAvailableP = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailableP = this.props.transactionHandler.hasTransactionToRedo();
        console.log("HELLO");
        console.log("UNDO AVAILABLE??? " + undoAvailableP);
        console.log("REDO AVAILABLE??? " + redoAvailableP);
        this.setState({
            undoAvailable: undoAvailableP,
            redoAvailable: redoAvailableP
        });
    }
    changeSpecificItemTask = (item, oldTask, newTask) => {
        this.props.handleSpecificTaskChangeCallback(item, oldTask, newTask);
        let undoAvailableP = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailableP = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailableP,
            redoAvailable: redoAvailableP
        });
    }
    changeSpecificItemStatus = (item, oldStatus, newStatus) => {
        this.props.handleSpecificStatusChangeCallback(item, oldStatus, newStatus);
        let undoAvailableP = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailableP = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailableP,
            redoAvailable: redoAvailableP
        });
    }
    changeSpecificItemDueDate = (item, oldDate, newDate) => {
        this.props.handleSpecificDueDateChangeCallback(item, oldDate, newDate);
        let undoAvailableP = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailableP = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailableP,
            redoAvailable: redoAvailableP
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
        console.log("CALLING UNDO");
        this.props.undoTransactionCallback();
        let undoAvailableP = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailableP = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailableP,
            redoAvailable: redoAvailableP
        });
    }

    handleRedoFunctionCallback = () => {
        this.props.redoTransactionCallback();
        let undoAvailableP = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailableP = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailableP,
            redoAvailable: redoAvailableP
        });
    }

    handleAddNewItemFunctionCallback = () => {
        this.props.addNewListItemCallback();
        let undoAvailableP = this.props.transactionHandler.hasTransactionToUndo();
        let redoAvailableP = this.props.transactionHandler.hasTransactionToRedo();
        this.setState({
            undoAvailable: undoAvailableP,
            redoAvailable: redoAvailableP
        });
    }
    
    // deleteListItemCallback = () => {
    //     console.log("DELETING LIST CURRENT ITEM");
    // }

    render() {

        let redoEnabled = "enabled";
        if(!this.props.transactionHandler.hasTransactionToRedo())
            redoEnabled = "disabled";

        let undoEnabled = "enabled";
        if(!this.props.transactionHandler.hasTransactionToUndo())
            undoEnabled = "disabled";
            
        let viewingList = "enabled";
        if(!this.props.appState.state.viewingList){
            viewingList = "disabled";
        }

        let viewingListON = this.props.appState.state.viewingList;
        console.log("VIEWING LIST: " + viewingList);
        console.log(viewingListON);

        console.log("undoEnabled: " + this.props.appState.state.undoAvailable);
        console.log(this.state.undoAvailable);
        console.log(undoEnabled);
        console.log("redoEnabled: " + this.props.appState.state.redoAvailable);
        console.log(this.state.redoAvailable);
        console.log(redoEnabled);
        
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
                            (this.props.appState.state.viewingList ? this.handleAddNewItemFunctionCallback : null)
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