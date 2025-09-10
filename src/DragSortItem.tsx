import { useEffect, useRef, useState } from 'react';

import type { DragEvent, MouseEvent, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react';

import styles from './dragSort.module.css';
import { useDragSort } from './DragSortProvider';

export interface DragSortItemProps {
  children: ReactNode;
  index: number;
}

const ACCESS_KEYS = ['Space', 'ArrowDown', 'ArrowUp'];
const supportsTouch = 'ontouchstart' in globalThis.document.documentElement;
const dragImage = new Image(0, 0);

dragImage.src =
  // 1px transparent png
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

export const DragSortItem = ({ children, index }: DragSortItemProps) => {
  const {
    clone,
    dragEnd,
    draggingSource,
    draggingTarget,
    dragStart,
    drop,
    maxIndex,
    moveToPosition,
    setClone,
    setDraggingSource,
  } = useDragSort();
  const [grabbing, setGrabbing] = useState(false);
  const [moving, setmoving] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const hasIndex = index !== undefined && index >= 0;

  useEffect(() => {
    if (!itemRef.current) return;
    if (globalThis.document.activeElement === itemRef.current) return;

    if (index === draggingTarget && draggingTarget === draggingSource) {
      // Manually setting focus after an item has been moved with the keyboard; focus is lost after rerender
      itemRef.current.focus();
      setmoving(true);
    } else {
      setmoving(false);
    }
  }, [index, draggingTarget, draggingSource, setDraggingSource]);

  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    console.log('drag start');
    event.stopPropagation();

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setDragImage(dragImage, 0, 0);

    if (itemRef.current) {
      const cloned = itemRef.current.cloneNode(true) as Element;

      cloned.classList.add(styles['drag-sort__sort-item--ghost']);

      setClone(cloned);
    }

    if (hasIndex) dragStart(index);
    setGrabbing(true);
  }

  function handleDragEnd() {
    console.log('drag end');
    if (clone) document.body.removeChild(clone);

    setGrabbing(false);
    dragEnd();
  }

  function handleKeyUp(event: ReactKeyboardEvent<HTMLDivElement>) {
    const { code } = event;

    if (code === 'Tab' && draggingSource !== undefined) {
      dragEnd();
      return;
    }

    if (ACCESS_KEYS.includes(code) === false) return;

    if (!hasIndex) return;

    if (code === 'Space') {
      if (moving) {
        setmoving(false);
        dragEnd();
      } else {
        setmoving(true);
        dragStart(index);
      }

      return;
    }

    if (draggingSource === undefined) return;

    const newTarget = code === 'ArrowUp' ? index - 1 : index + 1;

    if (newTarget < 0 || newTarget > maxIndex) return;

    moveToPosition(newTarget);
  }

  function handleMove(event: MouseEvent<HTMLButtonElement>) {
    console.log('drag move');
    event.preventDefault();

    if (!hasIndex) return;

    dragStart(index);

    const { direction } = event.currentTarget.dataset;
    const newTarget = direction === 'up' ? index - 1 : index + 1;

    drop(newTarget);
  }

  return (
    <div
      className={`${styles['drag-sort__sort-item']} ${grabbing ? styles['drag-sort__sort-item--moving'] : ''}`}
      onKeyUpCapture={handleKeyUp}
      ref={itemRef}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <div className={styles['drag-sort__sort-item__contents']}>{children}</div>

      <div draggable
        className={styles['drag-sort__sort-item__button-container']}
        data-touch={supportsTouch}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <span className={`${styles['drag-sort__sort-item__handle']} ${styles['drag-sort__sort-item__handle--drag']}`}>
          <span className="visually-hidden">Drag</span>
        </span>

        {hasIndex && (
          <>
            {index > 0 && (
              <button
                className={`${styles['drag-sort__sort-item__handle']} ${styles['drag-sort__sort-item__handle--up']}`}
                data-direction="up"
                onClickCapture={handleMove}
              >
                <span className="visually-hidden">Move up</span>
              </button>
            )}

            {index < maxIndex && (
              <button
                className={`${styles['drag-sort__sort-item__handle']} ${styles['drag-sort__sort-item__handle--down']}`}
                data-direction="down"
                onClickCapture={handleMove}
              >
                <span className="visually-hidden">Move down</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
