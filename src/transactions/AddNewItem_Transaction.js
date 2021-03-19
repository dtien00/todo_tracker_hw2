'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddNewItem_Transaction extends jsTPS_Transaction {
    constructor(initModel) {
        super();
        this.model = initModel;
        console.log("CREATING");
    }

    doTransaction() {
        // MAKE A NEW ITEM
        console.log("ADDING NEW ITEM T");
        this.model.addNewItem();
    }

    undoTransaction() {
        console.log("UNDOING ADDING NEW");
        this.model.removeItem(0);
    }
}