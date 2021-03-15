// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react';
import testData from './test/testData.json'
import jsTPS from './common/jsTPS'

import ChangeDate_Transaction from './transactions/transactions/ChangeDate_Transaction.js'
import TaskChange_Transaction from './transactions/transactions/TaskChange_Transaction.js'
import StatusChange_Transaction from './transactions/transactions/StatusChange_Transaction.js'
import RemoveItem_Transaction from './transactions/transactions/RemoveItem_Transaction.js'

// THESE ARE OUR REACT COMPONENTS
import Navbar from './components/Navbar'
import LeftSidebar from './components/LeftSidebar'
import Workspace from './components/Workspace'
{/*import ItemsListHeaderComponent from './components/ItemsListHeaderComponent'
import ItemsListComponent from './components/ItemsListComponent'
import ListsComponent from './components/ListsComponent'
*/}
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
      useVerboseFeedback: true
    }
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

    this.setState({
      toDoLists: nextLists,
      currentList: toDoList
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
      id: this.highListId,
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

  //Removes the specified item from the toDoList and refreshes the workspace
  removeListItem = (itemID) => {
    let itemList = this.state.currentList.items;
    let indexOfItem = -1;
    for (let i = 0; (i < itemList.length) && (indexOfItem < 0); i++) {
        if (itemList[i].id === itemID) {
            indexOfItem = i;
        }
    }
    itemList.splice(indexOfItem, 1);  //Removes the item
    this.loadToDoList(this.state.currentList);  //'Refreshes' the list
  }

  //Adds a new default item to the current list. Probably best to push
  addListItem = () => {
    console.log("Adding new item");
    let itemList = this.state.currentList.items;
    let newItem = this.makeNewToDoListItem();
    console.log(newItem);
    itemList.unshift(newItem);
    this.loadToDoList(this.state.currentList);
  }

  //Moves up the item to the current list.
  moveListItemUp = (itemID) => {
    console.log("Adding new item");
    let itemList = this.state.currentList.items;
    let indexOfItem = -1;
    for (let i = 1; (i < itemList.length) && (indexOfItem < 0); i++) {
        if (itemList[i].id === itemID) {
            indexOfItem = i;
        }
    }
    if(indexOfItem!=-1){
      let tempItem = itemList[indexOfItem];
      itemList[indexOfItem]=itemList[indexOfItem-1];
      itemList[indexOfItem-1]=tempItem;
    }

    this.loadToDoList(this.state.currentList);
  }

  //Moves down the item to the current list.
  moveListItemDown = (itemID) => {
    console.log("Adding new item");
    let itemList = this.state.currentList.items;
    let indexOfItem = -1;
    for (let i = 0; (i < itemList.length-1) && (indexOfItem < 0); i++) {
        if (itemList[i].id === itemID) {
            indexOfItem = i;
        }
    }
    if(indexOfItem!=-1){
      let tempItem = itemList[indexOfItem];
      itemList[indexOfItem]=itemList[indexOfItem+1];
      itemList[indexOfItem+1]=tempItem;
    }

    this.loadToDoList(this.state.currentList);
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
      currentList: null
    });
    let workspace = document.getElementById("workspace");
    let listItems = document.getElementById("todo-list-items-div");
    workspace.remove(listItems);
    this.render();
    // this.loadToDoList(this.state.currentList);
  }

  //Deletes the top list in the left sidebar. If no more lists exists, create a new list to act as a placeholder. Patch this later
  deleteFirstList = () => {
    console.log("DELETING FIRST LIST");
    let toDoListsList = this.state.toDoLists;
    toDoListsList.splice(0,1);
    this.setState({
      toDoLists: toDoListsList,
      currentList: toDoListsList.length==0 ? this.makeNewToDoList() : toDoListsList[0] 
    });
    let workspaceItems = document.getElementById("todo-list-items-div");
    workspaceItems.style.visibility = "hidden";
  }

  render() {
    let items = this.state.currentList.items;
    return (
      <div id="root">
        <Navbar />
        <LeftSidebar 
          toDoLists={this.state.toDoLists}
          loadToDoListCallback={this.loadToDoList}
          addNewListCallback={this.addNewList}
          onClick={this.editListName}
        />
        <Workspace toDoListItems={items} 
          removeListItemCallback={this.removeListItem}
          addNewListItemCallback={this.addListItem}
          deleteListItemCallback={this.deleteFirstList}//FIX
          moveListItemUpCallback={this.moveListItemUp}
          moveListItemDownCallback={this.moveListItemDown}
          // closeListCallback={console.log("REACHED")}//FIX
        />
      </div>
    );
  }
}

export default App;