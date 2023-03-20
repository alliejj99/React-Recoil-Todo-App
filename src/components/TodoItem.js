/** TodoItem Component
 * TodoItem 컴포넌트는 todoList의 값을 표시하는 동시에 텍스트를 변경하고 항목을 삭제할 수 있습니다.
 * todoListState를 읽고 항목 텍스트를 업데이트 하고, 완료된 것을 표시하고 삭제하는 데 사용하는 setter함수를 얻기 우해 useRecoilState()를 사용합니다.
 */
import React, { useCallback } from "react";
import { useRecoilState } from "recoil";
import { todoListState } from "../todoAtom";

const TodoItem = ({ key, item }) => {
  const [todoList, setTodoList] = useRecoilState(todoListState);

  // todoList의 인덱스 값을 구합니다.
  // todoList는 atom의 default를 찾아서 안의 내용이 상위 컴포넌트에서 받은 데이터와 동일한 인덱스 값을 찾습니다.
  const index = todoList.findIndex((listItem) => listItem === item);

  const editItemText = useCallback(
    ({ target: { value } }) => {
      const newList = replaceItemAtIndex(todoList, index, {
        ...item,
        text: value,
      });

      setTodoList(newList);
    },
    [index, item, setTodoList, todoList]
  );

  return (
    <div key={key}>
      <input type="text" value={item.text} onChange={editItemText} />
    </div>
  );
};

export default TodoItem;

/**
 * @param {*} arr 기존 배열
 * @param {*} index 새로 수정한 배열의 인덱스
 * @param {*} newValue 새로 수정한 배열
 */
function replaceItemAtIndex(arr, index, newValue) {
  // 기존 배열에서 0번째에서 새로운 인덱스 배열에 새로운 배열을 할당합니다.
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}
