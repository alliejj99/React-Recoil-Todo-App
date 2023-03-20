import { useRecoilValue } from "recoil";
import "./App.css";
import TodoItem from "./components/TodoItem";
import TodoItemCreator from "./components/TodoItemCreator";
import TodoListFilters from "./components/TodoListFilters";
import { filteredTodoListState, todoListState } from "./todoAtom";

function App() {
  const todoList = useRecoilValue(todoListState);
  const filteredTodoList = useRecoilValue(filteredTodoListState);
  console.log("todoList:", todoList);
  console.log("filteredTodoList:", filteredTodoList);

  return (
    <div className="App">
      <TodoListFilters />
      <TodoItemCreator />
      {todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </div>
  );
}

export default App;
