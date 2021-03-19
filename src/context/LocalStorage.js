import React, {createContext, useEffect} from 'react';
import {testData} from '../test/testData';

export const ListContext = createContext();

const ListContextProvider = (props) => {
    console.log("IT'S ALIIIIIIIIIIIVE");
    const[lists, dispatch] = testData;
    useEffect(() => {
        console.log(testData);
    })
}

export default ListContextProvider;