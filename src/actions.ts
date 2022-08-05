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

type ClearDraggingSourceAction = {
  type: typeof CLEAR_DRAGGING_SOURCE;
};

type ClearDraggingTargetAction = {
  type: typeof CLEAR_DRAGGING_TARGET;
};

type DragEndAction = {
  type: typeof DRAG_END;
};

type DragStartAction = {
  type: typeof DRAG_START;
  payload: number;
};

type DropAction = {
  type: typeof DROP;
  payload: number;
};

type MoveToPositionAction = {
  type: typeof MOVE_TO_POSITION;
  payload: number;
};

type ResetAction = {
  type: typeof RESET;
};

type SetCloneAction = {
  type: typeof SET_CLONE;
  payload: Element;
};

type SetDraggingSourceAction = {
  type: typeof SET_DRAGGING_SOURCE;
  payload: number;
};

type SetDraggingTargetAction = {
  type: typeof SET_DRAGGING_TARGET;
  payload: number;
};

export type Actions =
  | ClearDraggingSourceAction
  | ClearDraggingTargetAction
  | DragEndAction
  | DragStartAction
  | DropAction
  | MoveToPositionAction
  | ResetAction
  | SetCloneAction
  | SetDraggingSourceAction
  | SetDraggingTargetAction;

export const setClone = (payload: SetCloneAction['payload']): SetCloneAction => ({
  type: SET_CLONE,
  payload,
});

export const clearDraggingSource = (): ClearDraggingSourceAction => ({ type: CLEAR_DRAGGING_SOURCE });

export const clearDraggingTarget = (): ClearDraggingTargetAction => ({ type: CLEAR_DRAGGING_TARGET });

export const dragEnd = (): DragEndAction => ({ type: DRAG_END });

export const dragStart = (draggingItemIndex: DragStartAction['payload']): DragStartAction => ({
  type: DRAG_START,
  payload: draggingItemIndex,
});

export const drop = (targetItemIndex: DropAction['payload']): DropAction => ({
  type: DROP,
  payload: targetItemIndex,
});

export const moveToPosition = (targetItemIndex: MoveToPositionAction['payload']): MoveToPositionAction => ({
  type: MOVE_TO_POSITION,
  payload: targetItemIndex,
});

export const reset = (): ResetAction => ({ type: RESET });

export const setDraggingSource = (sourceItemIndex: SetDraggingSourceAction['payload']): SetDraggingSourceAction => ({
  type: SET_DRAGGING_SOURCE,
  payload: sourceItemIndex,
});

export const setDraggingTarget = (targetItemIndex: SetDraggingTargetAction['payload']): SetDraggingTargetAction => ({
  type: SET_DRAGGING_TARGET,
  payload: targetItemIndex,
});
