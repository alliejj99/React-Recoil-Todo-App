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
