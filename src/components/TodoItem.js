/** TodoItem Component
 * TodoItem 컴포넌트는 todoList의 값을 표시하는 동시에 텍스트를 변경하고 항목을 삭제할 수 있습니다.
 * todoListState를 읽고 항목 텍스트를 업데이트 하고, 완료된 것을 표시하고 삭제하는 데 사용하는 setter함수를 얻기 우해 useRecoilState()를 사용합니다.
 */
import React, { useCallback } from "react";
import { useRecoilState } from "recoil";
import { todoListState } from "../todoAtom";

const TodoItem = ({ item }) => {
  const [todoList, setTodoList] = useRecoilState(todoListState);

  // todoList의 인덱스 값을 구합니다.
  // todoList는 atom의 default를 찾아서 안의 내용이 상위 컴포넌트에서 받은 데이터와 동일한 인덱스 값을 찾습니다.
  const index = todoList.findIndex((listItem) => listItem === item);

  // todoList를 수정하는 기능을 합니다.
  const editItemText = useCallback(
    // e.target을 value 객체로 할당합니다.
    ({ target: { value } }) => {
      // 배열 구조를 지키기 위해 다음과 같이 설정합니다.
      // todoList(arr) 기존 배열 / index(index) 새로 수정한 배열의 인덱스 / {}(객체 데이터구조) 새로운 데이터
      const newList = replaceItemAtIndex(todoList, index, {
        ...item, // 바뀌는 데이터를 제외하고 모두 복사하여 그대로 유지합니다/
        text: value,
      });

      setTodoList(newList); // 바뀐 데이터를 재 할당합니다.
    },
    [index, item, setTodoList, todoList]
  );

  // todoList의 완료/미완료를 설정하는 기능을 합니다.
  const toggleitemCompletion = useCallback(() => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item, // isComplete를 제외한 모든 데이터 그대로 유지
      isComplete: !item.isComplete,
    });

    setTodoList(newList);
  }, [index, item, setTodoList, todoList]);

  // todoList의 삭제 기능을 합니다.
  const deleteItem = useCallback(() => {
    const newList = removeItemAtIndex(todoList, index);
    setTodoList(newList);
  }, [index, setTodoList, todoList]);

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={toggleitemCompletion}
        name="complete"
        id="Complete"
      />
      <button onClick={() => deleteItem()}>Todo Delete</button>
    </div>
  );
};

export default TodoItem;

/**
 * @param {any[]} arr 기존 배열
 * @param {number} index 새로 수정한 배열의 인덱스
 * @param {any[]} newValue 새로 수정한 배열
 */
function replaceItemAtIndex(arr, index, newValue) {
  // 기존 배열에서 0번째에서 새로운 인덱스 배열에 새로운 배열을 할당합니다.
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
