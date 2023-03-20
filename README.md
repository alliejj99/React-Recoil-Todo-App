### React Recoil Todo App
  리액트의 Recoil이란 상태관리를 사용하여 Todo App을 만들었습니다.

- TodoItemCreator()  
  새로운 todo 아이템을 생성하기 위해 우리는 todoListState 내용을 업데이트하는 setter함수에 접근해야 합니다. todoItemCreator 컴포넌트의 setter 함수를 얻기 위해 useSetRecoilState()훅을 사용할 수 있습니다.  
  | Hooks                 | Desc                                                                                                         |
  |-----------------------|--------------------------------------------------------------------------------------------------------------|
  | useRecoilState()      | useState()와 유사하며 [state, setState] 튜플을 반환합니다.<br>인자에 Atoms 혹은 Selector를 넣어줍니다.       |
  | useRecoilValue()      | 전역 상태의 state 상태 값만을 참조하기 위해 사용됩니다.<br>선언된 변수에 할당하여 사용하면 됩니다.           |
  | useSetRecoilState()      | 전역 상태의 setter 함수만을 활용하기 위해 사용됩니다.<br>선언된 함수 변수에 할당하여 사용하면 됩니다.        |
  | useResetRecoilState() | 전역 상태를 defaulit(초기값)으로 Reset 하기 위해 사용됩니다.<br>선언된 함수 변수에 할당하여 사용하면 됩니다. |
  

