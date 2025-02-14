import { useState, useEffect, useRef, useCallback } from "react";
import './meraTodo.css'
import Button from './component/button/index'
// import { Loader } from 'rsuite';
let text = "";
export default function Todo() {
    const [input, setInput] = useState([]);
    const [value, setValue] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [filter, setFilter] = useState("All");
    const [hasMore, setHasMore] = useState(true);


    function addInput() {
        if (value.trim() != "") {

            setInput([...input, { text: value, completed: false }]);
            setValue("");
        }
        else {
            alert("Enter Some Text");
        }
    }
    function Input(event) {
        setValue(event.target.value);
    }
    function deleteTodo(index) {
        return function () {
            setInput(input.filter(function (item, i) {
                return i != index;
            }))
        }
    }
    useEffect(() => {
        let temp = JSON.parse(localStorage.getItem("todo")) || [];
        setInput(temp);
    }, [])

    useEffect(() => {
        localStorage.setItem("todo", JSON.stringify(input));
    }, [input]);

    function setTodo(index) {
        setEditIndex(index);
        setIsEditing(true);
        setValue(input[index].text);
    }
    function saveEdit() {
        if (value.trim() !== "") {
            const newTodo = input.map((item, i) =>
                i === editIndex ? { ...item, text: value } : item
            );
            setInput(newTodo);
            setEditIndex(null);
            setIsEditing(false);
            setValue("");
        }
    }
    function toggleComplete(index) {
        setInput(input.map((item, i) =>
            i === index ? { ...item, completed: !item.completed } : item
        ));
    }

    function selectChange(e) {
        let stage = e.target.value;
        // console.log(stage);
        setFilter(stage);
    }

    const filteredTodos = input.filter((item) => {
        if (filter === "completed") return item.completed;
        if (filter === "uncompleted") return !item.completed;
        return true; // "All"
    });
    const observeRef = useRef(null);
    const [allData, setAllData] = useState([]);
    const [visibleItem, setVisibleItem] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("todo")) || [];
        if (data) {
            setAllData(data);
            setVisibleItem(data.slice(page * 10, (page + 1) * 10));
        }
    }, [])

    const handleNext = useCallback(() => {
        setTimeout(() => {
            setPage((prevPage) => {
                const nextPage = prevPage + 1;
                const newTasks = allData.slice(nextPage * 10, (nextPage + 1) * 10);

                if (newTasks.length > 0) {
                    setVisibleItem((prevItems) => [...prevItems, ...newTasks]);
                    return nextPage;
                } else {
                    setHasMore(false);
                    return prevPage;
                }
            });
        }, 1500); 
    }, [allData]);

    useEffect(() => {
        if (!hasMore)
            return;
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting)
                    handleNext();
            })
            if (observeRef.current) {
                observer.observe(observeRef.current);
            }
            return () => {
                if (observeRef.current)
                    observer.unobserve(observeRef.current);
            }
    }, [handleNext])


    return (
        <div className="cantainer">
            <h1>Todo App</h1>
            <input type="text" value={value} onChange={Input} placeholder="Enter your text 📝" />
            <Button onClick={isEditing ? saveEdit : addInput}>{isEditing ? "Save" : "Add"}</Button>
            <select onChange={selectChange} value={filter}>
                <option value="All">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="uncompleted">Uncompleted</option>
            </select>
            <ul>
                {
                    filteredTodos.map((item, index) => {
                        return (
                            <>
                                <li key={index} onDoubleClick={() => toggleComplete(index)} style={{ textDecoration: item.completed ? "line-through" : "none" }}>{item.text}</li>
                                <button onClick={deleteTodo(index)} className="Delete">Delete</button>
                                <button onClick={() => { setTodo(index) }}>Edit</button>
                            </>
                        )
                    }
                    )}
            </ul>
            {hasMore && (
                <div ref={observeRef}>
                    <h1>
                        <img src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_medium.gif" />
                    </h1>
                </div>
            )}</div>
    )

}

