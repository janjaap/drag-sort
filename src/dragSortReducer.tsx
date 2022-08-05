import type { ReactElement } from 'react';
import type { Actions } from './actions';
import type { DragSortItem, DragSortItemProps } from './DragSortItem';

import {
  CLEAR_DRAGGING_SOURCE,
  CLEAR_DRAGGING_TARGET,
  DRAG_END,
  DRAG_START,
  DROP,
  MOVE_TO_POSITION,
  RESET,
  SET_CLONE,
  SET_DRAGGING_SOURCE,
  SET_DRAGGING_TARGET,
} from './constants';

type SortableItems = ReactElement<DragSortItemProps, typeof DragSortItem>[];

export interface DragSortStateType {
  clone?: Element;
  draggingSource?: number;
  draggingTarget?: number;
  indices: number[];
  itemsBeforeDrag: SortableItems;
  maxIndex: number;
  sortableItems: SortableItems;
}

export const initialState = {
  clone: undefined,
  draggingSource: undefined,
  draggingTarget: undefined,
  indices: [],
  itemsBeforeDrag: [],
  maxIndex: 0,
  sortableItems: [],
};

const getReorderedList = (from: number, to: number, ...arr: SortableItems) =>
  from === to ? arr : (arr.splice(to, 0, ...arr.splice(from, 1)), arr);

function getReorderedListWithPlaceholder(from: number, to: number, ...arr: SortableItems) {
  arr.splice(from, 1);

  return [...arr.splice(to, 0, <span />), ...arr];
}

export const dragSortReducer = (state: DragSortStateType = initialState, action: Actions): DragSortStateType => {
  switch (action.type) {
    case SET_CLONE: {
      return {
        ...state,
        clone: action.payload,
      };
    }

    case DRAG_START: {
      return {
        ...state,
        draggingSource: action.payload,
        itemsBeforeDrag: state.sortableItems,
      };
    }

    case DRAG_END: {
      return {
        ...state,
        draggingSource: undefined,
        draggingTarget: undefined,
      };
    }

    case RESET: {
      return {
        ...state,
        draggingTarget: undefined,
        sortableItems: state.itemsBeforeDrag,
      };
    }

    case DROP: {
      const sortableItems = getReorderedList(state.draggingSource!, action.payload, ...state.itemsBeforeDrag);
      const indices = sortableItems.map(({ props }) => props.index);

      return {
        ...state,
        clone: undefined,
        draggingSource: undefined,
        draggingTarget: undefined,
        indices,
        sortableItems,
      };
    }

    case SET_DRAGGING_TARGET: {
      return {
        ...state,
        draggingTarget: action.payload,
        sortableItems: getReorderedListWithPlaceholder(state.draggingSource!, action.payload, ...state.itemsBeforeDrag),
      };
    }

    case SET_DRAGGING_SOURCE: {
      return {
        ...state,
        draggingSource: action.payload,
      };
    }

    case MOVE_TO_POSITION: {
      return {
        ...state,
        draggingTarget: action.payload,
        draggingSource: action.payload,
        sortableItems: getReorderedList(state.draggingSource!, action.payload, ...state.sortableItems),
      };
    }

    case CLEAR_DRAGGING_TARGET:
      return {
        ...state,
        draggingTarget: undefined,
      };

    case CLEAR_DRAGGING_SOURCE:
      return {
        ...state,
        draggingSource: undefined,
      };

    default:
      return state;
  }
};
