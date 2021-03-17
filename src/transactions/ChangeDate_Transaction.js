'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class ChangeDate_Transaction extends jsTPS_Transaction {
    constructor(initModel, formerDate, newDate, item) {
        super();
        this.model = initModel;
        this.previousDate = formerDate;
        this.newDate = newDate;
        this.item = item;
    }

    doTransaction() {
        this.model.changeDate(this.newDate, this.item);
    }

    undoTransaction() {
        this.model.changeDate(this.previousDate, this.item);
    }
}