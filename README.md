### React Recoil Todo App
  리액트의 Recoil이란 상태관리를 사용하여 Todo App을 만들었습니다.

- **TodoItemCreator()**  
  새로운 todo 아이템을 생성하기 위해 우리는 todoListState 내용을 업데이트하는 setter함수에 접근해야 합니다. todoItemCreator 컴포넌트의 setter 함수를 얻기 위해 useSetRecoilState()훅을 사용할 수 있습니다.  
  | Hooks                 | Desc                                                                                                         |
  |-----------------------|--------------------------------------------------------------------------------------------------------------|
  | useRecoilState()      | useState()와 유사하며 [state, setState] 튜플을 반환합니다.<br>인자에 Atoms 혹은 Selector를 넣어줍니다.       |
  | useRecoilValue()      | 전역 상태의 state 상태 값만을 참조하기 위해 사용됩니다.<br>선언된 변수에 할당하여 사용하면 됩니다.           |
  | useSetRecoilState()      | 전역 상태의 setter 함수만을 활용하기 위해 사용됩니다.<br>선언된 함수 변수에 할당하여 사용하면 됩니다.        |
  | useResetRecoilState() | 전역 상태를 defaulit(초기값)으로 Reset 하기 위해 사용됩니다.<br>선언된 함수 변수에 할당하여 사용하면 됩니다. |
    ---

- **atom 설정하기**
  ```jsx
  // todoAtom.js
  import { atom, selector } from "recoil";

  export const todoListState = atom({
    key: "todoListState",
    default: [],
  });

  /** Filtering된 Todo-List 구현하기
  * 필터링된 todo 리스트를 구현하기 위해서 Atom에 저장될 수 있는 필터 기준을 선택해야 합니다.
  * 사용하게 될 필터 옵션은 "Show Completed"와 "Show uncompleted"가 있습니다.
  */
  export const todoListFilterState = atom({
    key: "todoListFilterState",
    default: "Show All",
  });

  export const filteredTodoListState = selector({
    // key:고유 key값
    // get: Selector 순수함수. 사용할 값을 반환하며, 매개변수인 콜백 객체 내 get()메소드로 다른 atom 혹은 selector를 참조합니다.
    key: "filteredTodoListState",
    get: ({ get }) => {
      // 둘 중 하나라도 변경되면 리 렌더링 합니다.
      const filter = get(todoListFilterState);
      const list = get(todoListState);

      switch (filter) {
        case "Show Completed":
          return list.filter((item) => item.isComplete);
        case "Show Uncompleted":
          return list.filter((item) => !item.isComplete);
        default:
          return list; // Show All
      }
    },
  });

  export const todoListStatsState = selector({
    key: "todoListStatsState",
    get: ({ get }) => {
      const todoList = get(todoListState);
      const totalNum = todoList.length;
      const totalCompletedNum = todoList.filter((item) => item.isComplete).length;
      const totalUncompletedNum = totalNum - totalCompletedNum; // 전체 갯수 - 완료 갯수 = 미완료 갯수
      const percentCompleted = totalNum === 0 ? 0 : totalCompletedNum / totalNum; // 총 갯수가 0이면 0%, 아니면 완료 갯수 / 총 갯수... *100은 사용하는 컴포넌트에서 계산

      return {
        todoList,
        totalNum,
        totalCompletedNum,
        totalUncompletedNum,
        percentCompleted,
      };
    },
  });
  ```
  
- **일정 추가 기능**  
  ```jsx
  // TodoItemCreator.js
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
  ```
  
- **일정 수정 기능**  
  ```jsx
  // TodoItemCreator.js
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

    return (
      <div>
        <input type="text" value={item.text} onChange={editItemText} />
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
  ```
  
- **일정 완료 Toggle 기능**
  ```jsx
  // TodoItemCreator.js
  import React, { useCallback } from "react";
  import { useRecoilState } from "recoil";
  import { todoListState } from "../todoAtom";

  const TodoItem = ({ item }) => {
    const [todoList, setTodoList] = useRecoilState(todoListState);
    const index = todoList.findIndex((listItem) => listItem === item);

    // todoList의 완료/미완료를 설정하는 기능을 합니다.
    const toggleitemCompletion = useCallback(() => {
      const newList = replaceItemAtIndex(todoList, index, {
        ...item, // isComplete를 제외한 모든 데이터 그대로 유지
        isComplete: !item.isComplete,
      });

      setTodoList(newList);
    }, [index, item, setTodoList, todoList]);


    return (
      <div>
        <input
          type="checkbox"
          checked={item.isComplete}
          onChange={toggleitemCompletion}
          name="complete"
          id="Complete"
        />
      </div>
    );
  };

  export default TodoItem;

  function replaceItemAtIndex(arr, index, newValue) {
    // 기존 배열에서 0번째에서 새로운 인덱스 배열에 새로운 배열을 할당합니다.
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
  }
  ```
  
- **일정 삭제 기능**  
  ```jsx
  // TodoItemCreator.js
  import React, { useCallback } from "react";
  import { useRecoilState } from "recoil";
  import { todoListState } from "../todoAtom";

  const TodoItem = ({ item }) => {
    const [todoList, setTodoList] = useRecoilState(todoListState);
    const index = todoList.findIndex((listItem) => listItem === item);

    // todoList의 삭제 기능을 합니다.
    const deleteItem = useCallback(() => {
      const newList = removeItemAtIndex(todoList, index);
      setTodoList(newList);
    }, [index, setTodoList, todoList]);

    return (
      <div>
        <button onClick={() => deleteItem()}>Todo Delete</button>
      </div>
    );
  };

  export default TodoItem;

  function removeItemAtIndex(arr, index) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }

  ```
  
- **완료된 일정 / 완료하지 못한 일정 / 전체 일정 필터링 기능**  
  ```jsx
  // TodoListFilters.js
  import React, { useCallback } from "react";
  import { useRecoilState } from "recoil";
  import { todoListFilterState } from "../todoAtom";

  const TodoListFilters = () => {
    const [filter, setFilter] = useRecoilState(todoListFilterState);

    const updateFilter = useCallback(
      ({ target: { value } }) => {
        setFilter(value); // e.target.value => select하위의 option값
      },
      [setFilter]
    );

    return (
      <div>
        Filters:
        <select value={filter} onChange={updateFilter}>
          <option value="Show All">All</option>
          <option value="Show Completed">Completed</option>
          <option value="Show Uncompleted">Uncompleted</option>
        </select>
      </div>
    );
  };

  export default TodoListFilters;

  ```
  
- **통계 기능 추가하기**
  ```jsx
  // TodoListStats.js
  import React from "react";
  import { useRecoilValue } from "recoil";
  import { todoListStatsState } from "../todoAtom";

  const TodoListStats = () => {
    const { 
      totalNum, 
      totalCompletedNum, 
      totalUncompletedNum, 
      percentCompleted
     } = useRecoilValue(todoListStatsState);

    const formattedPercentCompleted = Math.round(percentCompleted * 100); // 반올림
    return (
      <ul>
        <li>총 일정 갯수: {totalNum}</li>
        <li>완료된 일정 갯수: {totalCompletedNum}</li>
        <li>미완료된 일정 갯수: {totalUncompletedNum}</li>
        <li>진행도: {formattedPercentCompleted}%</li>
      </ul>
    );
  };

  export default TodoListStats;
  ```  
    

  
- **비동기 데이터 쿼리**
  만약 user의 이름이 쿼리 데이터 베이스에 저장되어 있다면 Promise를 리턴하거나 async 함수를 사용하기만 하면 됩니다. 의존성에 하나라도 변경점이 생긴다면 selector는 새로운 쿼리를 재검사하고 다시 실행합니다. 그리고 그 결과는 쿼리가 유니크한 인풋이 있을 때에만 실행 되도록 캐시(저장)됩니다.  
  ```jsx
  // userAtoms.js
  /* 비동기 데이터 요청 보내기 */
  import { atom, selector } from "recoil";

  export const currentUserIdState = atom({
    key: "currentUserIdState",
    default: 1,
  });

  export const currentUserNameQuery = selector({
    key: "currentUserNameQuery",
    get: async ({ get }) => {
      const path = "https://jsonplaceholder.typicode.com/users/";
      const response = await axios.get(`${path}${get(currentUserIdState)}`);
      return response.data.name;
    },
  });
  ```

  - React Suspense와 함께 사용
    리액트 렌더 함수는 동기인데 promise가 resolve되기 전에 무엇을 렌더 할 수 있을까요? recoil은 보류중인 데이터를 다루기 위해 React Suspense와 함께 동작하도록 디자인되어 있습니다. 컴포넌트를 React Suspense로 감싸서 아직 보류중인 하위 항목들을 잡아내고 대체하기 위한 UI를 렌더링 할 수 있습니다.
    ```jsx
      import { Suspense } from "react";
      import { useRecoilValue } from "recoil";
      import { filteredTodoListState } from "./todoAtom";
      import { currentUserNameQuery } from "./userAtoms";

      function App() {
        const filteredTodoList = useRecoilValue(filteredTodoListState);
        return (
          <div className="App">
            <Suspense fallback={<div>Loading...</div>}>
              <CurrentUserInfo />
            </Suspense>
          </div>
        );
      }

      export default App;

      function CurrentUserInfo() {
        const userName = useRecoilValue(currentUserNameQuery);
        return <div>{userName}</div>;
      }
    ```

---
#### npm installs
  ```bash
  $ npm install recoil --save
  ```
  ```bash
  $ npm install axios --save
  ```
---
#### 비동기 데이터 요청을 보낼 사이트
[오픈 데이터]https://jsonplaceholder.typicode.com/users