import { Children, createContext, useContext, useReducer } from 'react';

import type { DragSortStateType } from './dragSortReducer';
import type { OnSort } from './DragSortContainer';

import { dragSortReducer, initialState } from './dragSortReducer';
import { DragSortContainer } from './DragSortContainer';
import * as actions from './actions';

type DragSortContextType = {
  clearDraggingSource: () => void;
  clearDraggingTarget: () => void;
  dragEnd: () => void;
  dragStart: (index: number) => void;
  drop: (index: number) => void;
  moveToPosition: (index: number) => void;
  reset: () => void;
  setClone: (node: Element) => void;
  setDraggingSource: (index: number) => void;
  setDraggingTarget: (index: number) => void;
};

const DragSortContext = createContext<(DragSortContextType & DragSortStateType) | undefined>(undefined);

interface Props {
  children: DragSortStateType['sortableItems'];
  onSort?: OnSort;
}

const init = (children: Props['children']): DragSortStateType => ({
  ...initialState,
  indices: Children.map(children, ({ props }) => props.index),
  maxIndex: Children.count(children) - 1,
  sortableItems: children,
});

export function DragSortProvider({ children, onSort }: Props) {
  const [state, dispatch] = useReducer(dragSortReducer, children, init);

  function setDraggingSource(index: number) {
    dispatch(actions.setDraggingSource(index));
  }

  function setDraggingTarget(index: number) {
    dispatch(actions.setDraggingTarget(index));
  }

  function moveToPosition(index: number) {
    dispatch(actions.moveToPosition(index));
  }

  function clearDraggingTarget() {
    dispatch(actions.clearDraggingTarget());
  }

  function clearDraggingSource() {
    dispatch(actions.clearDraggingSource());
  }

  function drop(index: number) {
    dispatch(actions.drop(index));
  }

  function dragStart(index: number) {
    dispatch(actions.dragStart(index));
  }

  function dragEnd() {
    dispatch(actions.dragEnd());
  }

  function reset() {
    dispatch(actions.reset());
  }

  function setClone(node: Element) {
    dispatch(actions.setClone(node));
  }

  return (
    <DragSortContext.Provider
      value={{
        ...state,
        clearDraggingSource,
        clearDraggingTarget,
        dragEnd,
        dragStart,
        drop,
        moveToPosition,
        reset,
        setClone,
        setDraggingSource,
        setDraggingTarget,
      }}
    >
      <DragSortContainer onSort={onSort} />
    </DragSortContext.Provider>
  );
}

export function useDragSort() {
  const context = useContext(DragSortContext);

  if (context === undefined) {
    throw new Error('useDragSort must be used within a DragSortProvider');
  }

  return context;
}
