import React from "react";
import { useRecoilValue } from "recoil";
import { todoListStatsState } from "../todoAtom";

const TodoListStats = () => {
  const { totalNum, totalCompletedNum, totalUncompletedNum, percentCompleted } =
    useRecoilValue(todoListStatsState);

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
