// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react';
import testData from './test/testData.json'
import jsTPS from './common/jsTPS'

import ChangeDate_Transaction from './transactions/ChangeDate_Transaction.js'
import TaskChange_Transaction from './transactions/TaskChange_Transaction.js'
import StatusChange_Transaction from './transactions/StatusChange_Transaction.js'
import RemoveItem_Transaction from './transactions/RemoveItem_Transaction.js'
import MoveItemUp_Transaction from './transactions/MoveItemUp_Transaction';
import MoveItemDown_Transaction from './transactions/MoveItemDown_Transaction';

// THESE ARE OUR REACT COMPONENTS
import Navbar from './components/Navbar'
import LeftSidebar from './components/LeftSidebar'
import Workspace from './components/Workspace'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction';
{/*import ItemsListHeaderComponent from './components/ItemsListHeaderComponent'
import ItemsListComponent from './components/ItemsListComponent'
import ListsComponent from './components/ListsComponent'*/
}
class App extends Component {
  constructor(props) {
    // ALWAYS DO THIS FIRST
    super(props);

    // DISPLAY WHERE WE ARE
    console.log("App constructor");

    // MAKE OUR TRANSACTION PROCESSING SYSTEM
    this.tps = new jsTPS();

    // CHECK TO SEE IF THERE IS DATA IN LOCAL STORAGE FOR THIS APP
    let recentLists = localStorage.getItem("recentLists");
    console.log("recentLists: " + recentLists);
    if (!recentLists) {
      recentLists = JSON.stringify(testData.toDoLists);
      localStorage.setItem("toDoLists", recentLists);
    }
    recentLists = JSON.parse(recentLists);

    // FIND OUT WHAT THE HIGHEST ID NUMBERS ARE FOR LISTS
    let highListId = -1;
    let highListItemId = -1;
    for (let i = 0; i < recentLists.length; i++) {
      let toDoList = recentLists[i];
      if (toDoList.id > highListId) {
        highListId = toDoList.id;
      }
      for (let j = 0; j < toDoList.items.length; j++) {
        let toDoListItem = toDoList.items[j];
        if (toDoListItem.id > highListItemId)
        highListItemId = toDoListItem.id;
      }
    };

    // SETUP OUR APP STATE
    this.state = {
      toDoLists: recentLists,
      currentList: {items: []},
      nextListId: highListId+1,
      nextListItemId: highListItemId+1,
      useVerboseFeedback: true,

      viewingList: false,
      ctrlPressedDown: false,
      zPressedDown: false,
      yPressedDown: false,
      undoAvailable: false,
      redoAvailable: false,
      viewingList: false
    }
  }

  componentWillMount() {
    localStorage.getItem('memory')&&this.setState({
      toDoLists: JSON.parse(localStorage.getItem('memory')),
      viewingList: false,
      ctrlPressedDown: false,
      zPressedDown: false,
      yPressedDown: false,
      undoAvailable: false,
      redoAvailable: false,
      viewingList: false 
    })
  }

  componentWillUpdate(nextProps, nextState){
    localStorage.setItem('memory', JSON.stringify(nextState.toDoLists));
  }


  // WILL LOAD THE SELECTED LIST
  loadToDoList = (toDoList) => {
    console.log("loading " + toDoList);

    // MAKE SURE toDoList IS AT THE TOP OF THE STACK BY REMOVING THEN PREPENDING
    const nextLists = this.state.toDoLists.filter(testList =>
      testList.id !== toDoList.id
    );
    nextLists.unshift(toDoList);
    
    let listItem = document.getElementById("todo-list-button-"+toDoList.id);
    listItem.contentEditable = true;

    let toDoItems = document.getElementById("todo-list-items-div");
    toDoItems.style.visibility = "visible";

    listItem.onblur = () => {
      listItem.contentEditable = false;
    }

    console.log("CURRENT LIST: " + this.state.currentList.id);
    console.log("LOADING LIST: " + toDoList.id);
    if(this.state.currentList.id!=toDoList.id){
      this.tps.clearAllTransactions();
      this.setState({
        toDoLists: nextLists,
        currentList: toDoList,
        viewingList: true,
        undoAvailable: false,
        redoAvailable: false
      });
    }

    this.setState({
      toDoLists: nextLists,
      currentList: toDoList,
      viewingList: true
    });

  }

  addNewList = () => {
    let newToDoListInList = [this.makeNewToDoList()];
    let newToDoListsList = [...newToDoListInList, ...this.state.toDoLists];
    let newToDoList = newToDoListInList[0];

    // AND SET THE STATE, WHICH SHOULD FORCE A render
    this.setState({
      toDoLists: newToDoListsList,
      currentList: newToDoList,
      nextListId: this.state.nextListId+1
    }, this.afterToDoListsChangeComplete);
  }

  makeNewToDoList = () => {
    let newToDoList = {
      id: this.state.highListId,
      name: 'Untitled',
      items: []
    };
    return newToDoList;
  }

  makeNewToDoListItem = () =>  {
    let newToDoListItem = {
      description: "No Description",
      dueDate: "0000-00-00",
      status: "incomplete"
    };
    return newToDoListItem;
  }

  // THIS IS A CALLBACK FUNCTION FOR AFTER AN EDIT TO A LIST
  afterToDoListsChangeComplete = () => {
    console.log("App updated currentToDoList: " + this.state.currentList);

    // WILL THIS WORK? @todo
    let toDoListsString = JSON.stringify(this.state.toDoLists);
    localStorage.setItem("recent_work", toDoListsString);
  }

  //Creates a Transaction item to remove the item
  createRemoveItemTransaction = (itemID) => {
    let itemList = this.state.currentList.items;
    let transactionHandler = this.tps;
    let indexOfItem = -1;
    for (let i = 0; (i < itemList.length) && (indexOfItem < 0); i++) {
        if (itemList[i].id === itemID) {
            indexOfItem = i;
        }
    }
    transactionHandler.addTransaction(new RemoveItem_Transaction(this, itemList[indexOfItem], indexOfItem));
  }

  //Removes the specified item from the toDoList and refreshes the workspace
  removeItem = (indexOfItem) => {
    let itemList = this.state.currentList.items;
    if(indexOfItem!=-1){
      itemList.splice(indexOfItem,1);
    }
    this.loadToDoList(this.state.currentList);  //'Refreshes' the list
    
    //Checks if a Transaction can be undone/redone
    if(!this.tps.hasTransactionToUndo()){
      this.setState({
        undoAvailable: false
      });
    }
    else{
      this.setState({
        undoAvailable: true
      });
    }
    if(!this.tps.hasTransactionToRedo()){
      this.setState({
        redoAvailable: false
      });
    }
    else{
      this.setState({
        redoAvailable: true
      });
    }
  }

  //Adds the specific item removed back into the list
  addRemovedItem = (removedItem, indexOfItem) => {
    let itemList = this.state.currentList.items;
    if(indexOfItem!=-1){
      itemList.splice(indexOfItem,0,removedItem);
    }
    this.loadToDoList(this.state.currentList);
    //Checks if a Transaction can be undone/redone
    if(!this.tps.hasTransactionToUndo()){
      this.setState({
        undoAvailable: false
      });
    }
    else{
      this.setState({
        undoAvailable: true
      });
    }
    if(!this.tps.hasTransactionToRedo()){
      this.setState({
        redoAvailable: false
      });
    }
    else{
      this.setState({
        redoAvailable: true
      });
    }
  }

  //Creates an addItem Transaction
  createAddListItemTransaction = () => {
    let transactionHandler = this.tps;
    console.log("NEW ITEM ADDED");
    transactionHandler.addTransaction(new AddNewItem_Transaction(this));
  }

  //Adds a new default item to the current list. Probably best to push FIX
  addNewItem = () => {
    console.log("Adding new item");
    let itemList = this.state.currentList.items;
    let newItem = this.makeNewToDoListItem();
    itemList.unshift(newItem);
    this.loadToDoList(this.state.currentList);
    //Checks if a Transaction can be undone/redone
    if(!this.tps.hasTransactionToUndo()){
      this.setState({
        undoAvailable: false
      });
    }
    else{
      this.setState({
        undoAvailable: true
      });
    }
    if(!this.tps.hasTransactionToRedo()){
      this.setState({
        redoAvailable: false
      });
    }
    else{
      this.setState({
        redoAvailable: true
      });
    }
  }

  //Removes the added item. Logically, this should be the one at the top (pushed)
  removeLastItem = () => {
    console.log("REMOVING TOP ITEM");
    let itemList = this.state.currentList.items;
    itemList.splice(0,1);
    this.loadToDoList(this.state.currentList);
  }

  //Moves up the item to the current list.
  createMoveItemUpTransaction = (itemID) => {
    console.log("Moving up new item");
    let transactionHandler = this.tps;
    let itemList = this.state.currentList.items;
    let indexOfItem = -1;
    for (let i = 1; (i < itemList.length) && (indexOfItem < 0); i++) {
        if (itemList[i].id === itemID) {
            indexOfItem = i;
        }
    }
    if(indexOfItem!=-1){
      transactionHandler.addTransaction(new MoveItemUp_Transaction(this, indexOfItem));
    }
  }

  moveItemUp = (indexOfItem) => {
    let itemList = this.state.currentList.items;
    if(indexOfItem!=-1){
      let tempItem = itemList[indexOfItem];
      itemList[indexOfItem]=itemList[indexOfItem-1];
      itemList[indexOfItem-1]=tempItem;
    }
    this.loadToDoList(this.state.currentList);
    
    //Checks if a Transaction can be undone/redone
    if(!this.tps.hasTransactionToUndo()){
      this.setState({
        undoAvailable: false
      });
    }
    else{
      this.setState({
        undoAvailable: true
      });
    }
    if(!this.tps.hasTransactionToRedo()){
      this.setState({
        redoAvailable: false
      });
    }
    else{
      this.setState({
        redoAvailable: true
      });
    }
  }

  //Moves down the item to the current list.
  createMoveItemDownTransaction = (itemID) => {
    let transactionHandler = this.tps;
    let itemList = this.state.currentList.items;
    let indexOfItem = -1;
    for (let i = 0; (i < itemList.length-1) && (indexOfItem < 0); i++) {
        if (itemList[i].id === itemID) {
            indexOfItem = i;
        }
    }
    if(indexOfItem!=-1){
      transactionHandler.addTransaction(new MoveItemDown_Transaction(this, indexOfItem));
    }
  }

  //Moves item down in the currentlist given its index
  moveItemDown = (indexOfItem) => {
    let itemList = this.state.currentList.items;
    if(indexOfItem!=-1){
      let tempItem = itemList[indexOfItem];
      itemList[indexOfItem]=itemList[indexOfItem+1];
      itemList[indexOfItem+1]=tempItem;
    }
    this.loadToDoList(this.state.currentList);
    if(!this.tps.hasTransactionToUndo()){
      this.setState({
        undoAvailable: false
      });
    }
    else{
      this.setState({
        undoAvailable: true
      });
    }
    if(!this.tps.hasTransactionToRedo()){
      this.setState({
        redoAvailable: false
      });
    }
    else{
      this.setState({
        redoAvailable: true
      });
    }
  }
  // //Changes the name of the list
  // editListName = () => {
  //   console.log("Editing list name");
  //   let listID = this.state.currentList.id;
  //   let listElement = document.getElementById()
  // }

  //Closes list view; doesn't change the order of todo lists in the left sidebar
  closeListView = () => {
    console.log("Closing list view");
    this.setState({
      toDoLists: this.state.toDoLists,
      currentList: {items:[]},
      viewingList: false
    });
  }

  //Deletes the top list in the left sidebar. If no more lists exists, create a new list to act as a placeholder. Patch this later
  deleteFirstList = () => {
    if( window.confirm("Are you sure you want to delete?")){
      let toDoListsList = this.state.toDoLists;
      toDoListsList.splice(0,1);
      this.setState({
        toDoLists: toDoListsList,
        currentList: toDoListsList.length==0 ? this.makeNewToDoList() : {items:[]},
        viewingList: false
      });
    }
  }

  
  //Allows the textfield of the task column to be changed
  createTaskChangeTransaction = (item, oldTask, newTask) => {
      console.log("Changing Task");
      console.log(item + " " + oldTask + " " + newTask);
      let transactionHandler = this.tps;
      if(oldTask!=newTask)
        transactionHandler.addTransaction(new TaskChange_Transaction(this, oldTask, newTask, item));
  }

  //Changes the task
  changeTask = (taskChange, item) => {
    console.log("CURRENT ITEM: \n" + item);
    console.log("Changing task to: \n" + taskChange);
    item.description = taskChange;
    this.loadToDoList(this.state.currentList);
  }

  //Creates a status change Transaction object
  createStatusChangeTransaction = (item, oldStatus, newStatus) => {
    let transactionHandler = this.tps;

    if(oldStatus!=newStatus)
      transactionHandler.addTransaction(new StatusChange_Transaction(this, oldStatus, newStatus, item));
    
  }

  //Changes the task
  changeStatus = (status, item) => {
    item.status = status;
    
    //Checks if a Transaction can be undone/redone
    if(!this.tps.hasTransactionToUndo()){
      this.setState({
        undoAvailable: false
      });
    }
    else{
      this.setState({
        undoAvailable: true
      });
    }
    if(!this.tps.hasTransactionToRedo()){
      this.setState({
        redoAvailable: false
      });
    }
    else{
      this.setState({
        redoAvailable: true
      });
    }
  }

  //Creates a Transaction for changing the due date
  createDueDateChangeTransaction = (item, oldDate, newDate) => {
    console.log("TRANSACTION: " + item + " " + oldDate + " " + newDate);
    let transactionHandler = this.tps;
    if(oldDate!=newDate)
        transactionHandler.addTransaction(new ChangeDate_Transaction(this, oldDate, newDate, item));
  }

  //Changes the date of the itemID
  changeDate = (date, item) => {
    item.due_date = date;
    if(date == "" || date == null)    //If the due date was left blank, placeholder text is set
      item.due_date = "N/A: Assign a Date";
    this.loadToDoList(this.state.currentList);

    //Checks if a Transaction can be undone/redone
    if(!this.tps.hasTransactionToUndo()){
      this.setState({
        undoAvailable: false
      });
    }
    else{
      this.setState({
        undoAvailable: true
      });
    }
    if(!this.tps.hasTransactionToRedo()){
      this.setState({
        redoAvailable: false
      });
    }
    else{
      this.setState({
        redoAvailable: true
      });
    }
  }

  //Undos the latest Transaction if there is one
  undoTransaction = () => {
    console.log("Undoing");
    if(this.tps.hasTransactionToUndo()){
        this.tps.undoTransaction();
    }
        if(!this.tps.hasTransactionToUndo()){
          this.setState({
            undoAvailable: false
          });
        }
        else{
          this.setState({
            undoAvailable: true
          });

        }
        if(this.tps.hasTransactionToRedo()){
          this.setState({
            redoAvailable: true
          });
        }
        else{
          this.setState({
            redoAvailable: false
          });

        }
  }

  //Redos the latest Transaction if there is one
  redoTransaction = () => {
    console.log("Redoing");
    if(this.tps.hasTransactionToRedo()){
        this.tps.doTransaction();
    }
    if(!this.tps.hasTransactionToUndo()){
      this.setState({
        undoAvailable: false
      });
    }
    else{
      this.setState({
        undoAvailable: true
      });

    }
        if(this.tps.hasTransactionToRedo()){
          this.setState({
            redoAvailable: true
          });
        }
        else{
          this.setState({
            redoAvailable: false
          });

        }
  }

  //Listens for z or y for undo/redo respectively
  onKeyPressed = (event) => {
    console.log("KEY PRESSED");
    console.log(event.keyCode);
    if(event.keyCode==17) //ctrl
    this.setState({
      ctrlPressedDown: true
    });
    else if(event.keyCode==89) //y
    this.setState({
      yPressedDown: true
    });
    else if(event.keyCode==90) //z
    this.setState({
      zPressedDown: true
    });
    
    let ctrlState = this.state.ctrlPressedDown;
    let yState = this.state.yPressedDown;
    let zState = this.state.zPressedDown;

    if(ctrlState&&zState){
      this.undoTransaction();
      this.setState({
        zPressedDown: false,
        ctrlPressedDown: false
      });
    }
    else if(ctrlState&&yState){
      this.redoTransaction();
      this.setState({
        yPressedDown: false,
        ctrlPressedDown: false
      });
    }
  }

  onKeyReleased = (event) => {
    if(event.keyCode==17) //ctrl
    this.setState({
      ctrlPressedDown: true
    });
    else if(event.keyCode==89) //y
    this.setState({
      yPressedDown: true
    });
    else if(event.keyCode==90) //z
    this.setState({
      zPressedDown: true
    });
    
    let ctrlState = this.state.ctrlPressedDown;
    let yState = this.state.yPressedDown;
    let zState = this.state.zPressedDown;

    if(ctrlState&&zState){
      this.undoTransaction();
      this.setState({
        zPressedDown: false,
        ctrlPressedDown: false
      });
    }
    else if(ctrlState&&yState){
      this.redoTransaction();
      this.setState({
        yPressedDown: false,
        ctrlPressedDown: false
      });
    }
  }
  render() {
    let items = this.state.currentList.items;
    return (
      <div id="root" onKeyDown={this.onKeyPressed} onKeyUp={this.onKeyReleased} tabIndex={0}>
        <Navbar />
        <LeftSidebar 
          toDoLists={this.state.toDoLists}
          loadToDoListCallback={this.loadToDoList}
          addNewListCallback={this.addNewList}
          onClick={this.editListName}
          currentList={this.state.currentList}
        />
        <Workspace toDoListItems={items} 
          transactionHandler={this.tps}
          appState={this}
          handleSpecificTaskChangeCallback={this.createTaskChangeTransaction}
          handleSpecificStatusChangeCallback={this.createStatusChangeTransaction}
          handleSpecificDueDateChangeCallback={this.createDueDateChangeTransaction}
          removeListItemCallback={this.createRemoveItemTransaction}
          addNewListItemCallback={this.createAddListItemTransaction}
          deleteListItemCallback={this.deleteFirstList}//FIX
          moveListItemUpCallback={this.createMoveItemUpTransaction}
          moveListItemDownCallback={this.createMoveItemDownTransaction}
          undoTransactionCallback={this.undoTransaction}
          redoTransactionCallback={this.redoTransaction}
          // closeListCallback={console.log("REACHED")}//FIX
        />
      </div>
    );
  }
}

export default App;