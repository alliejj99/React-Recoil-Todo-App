import React, { useCallback, useState } from "react";
import { useSetRecoilState } from "recoil";
import { todoListState } from "../todoAtom";

const TodoItemCreator = () => {
  const [inputValue, setInputValue] = useState("");
  const setTodoList = useSetRecoilState(todoListState);

  const handleChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const addItem = useCallback(() => {
    setTodoList((oldTodoList) => [
      ...oldTodoList, // 불변성 지키기
      {
        id: getIte(),
        text: inputValue,
        isComplete: false,
      },
    ]);
    setInputValue(""); // add 버튼 누르고 나면 입력된 값들 초기화
  }, [inputValue, setTodoList]);

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && addItem()}
      />
      <button onClick={() => addItem()}>Add</button>
    </div>
  );
};

// 고유한 id생성을 위한 유틸리티
let id = 0;
function getIte() {
  return id++;
}

export default TodoItemCreator;
