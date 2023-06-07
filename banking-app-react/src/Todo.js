import React, { useState } from 'react'

const Todo = () => {

    const [count, setCount] = useState(0)
    const [todos, setTodos] = useState([])

    const increment = () => {
        setCount((c) => c + 1)
    }
    const addTodo = () => {
        setTodos((t) => [...t, "New Todo"])
    }

    return (
        <>
            <h1>
                Count
            </h1>
            <div>
                {count}
            </div>
            <button onClick={increment}>+</button>
            <h1>
                Todo
            </h1>
            <div>
                {todos.map((todo, index) => {
                    return <p key={index}>{todo}</p>;
                })}
            </div>
        </>
    )
}

export default Todo