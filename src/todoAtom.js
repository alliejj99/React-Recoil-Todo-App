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
