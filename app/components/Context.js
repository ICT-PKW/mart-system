'use client'
import React, { createContext, useState } from 'react'

export const Context = createContext();

function ContextProvider({ children }) {
    const [GlobalItem, setGlobalItem] = useState([]);
    return (
        <Context.Provider value={{ GlobalItem, setGlobalItem }}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider