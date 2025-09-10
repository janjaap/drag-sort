import { cloneElement, useEffect, useRef, useState } from 'react';

import type { DragEvent } from 'react';

import styles from './dragSort.module.css';
import { useDragSort } from './DragSortProvider';

export type OnSort = (indices: number[]) => void;

interface Props {
  onSort?: OnSort;
}

export function DragSortContainer({ onSort }: Props) {
  const { clone, draggingTarget, drop, sortableItems, setDraggingTarget, reset, indices } = useDragSort();
  const containerRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const indicesRef = useRef<number[]>(indices);
  const [dragOver, setDragOver] = useState(false);

  function getTargetIndex(event: DragEvent<HTMLLIElement>) {
    const dragSortContainer = containerRef.current;

    if (!dragSortContainer?.hasChildNodes()) return;

    const listItemNode = event.currentTarget;
    const childNodes = Array.from(dragSortContainer.childNodes);
    const targetIndex = childNodes.findIndex((node) => node.isEqualNode(listItemNode));

    return targetIndex;
  }

  function handleDrop(event: DragEvent<HTMLLIElement>) {
    console.log('drop');
    const targetIndex = getTargetIndex(event);

    if (targetIndex === undefined) return;

    if (clone && wrapperRef.current) wrapperRef.current.removeChild(clone);

    drop(targetIndex);
  }

  function handleDragOver(event: DragEvent<HTMLLIElement>) {
    console.log('drag over');
    // Prevent default to allow drop
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    if (clone) {
      const { clientX, clientY } = event;
      const { x, y, width, height } = event.currentTarget.getBoundingClientRect();
      const grabPosition = height / 2 - (clientY - y);

      // lock drag image movement to x-axis and mouse pointer
      clone.setAttribute(
        'style',
        `
        left: ${clientX - (clientX - x)}px;
        top: ${y - grabPosition}px;
        height: ${height}px;
        width: ${width}px;
        visibility: visible;
      `
      );
    }

    const targetIndex = getTargetIndex(event);

    if (targetIndex === undefined || targetIndex === draggingTarget) return;

    setDraggingTarget(targetIndex);
  }

  function handleDragEnter(event: DragEvent<HTMLLIElement>) {
    console.log('drag enter');
    event.preventDefault();

    setDragOver(true);
  }

  function handleDragLeave() {
    console.log('drag leave');
    setDragOver(false);
  }

  function handleContainerDragLeave(event: DragEvent<HTMLUListElement>) {
    const { relatedTarget } = event;

    const within = relatedTarget !== null && containerRef.current?.contains(relatedTarget as Node);

    if (!within) {
      reset();

      if (clone) {
        clone.setAttribute('style', 'visibility: hidden;');
      }
    }
  }

  useEffect(() => {
    if (!clone || !wrapperRef.current) return;

    wrapperRef.current.appendChild(clone);

    return function () {
      clone.remove();
    };
  }, [clone]);

  useEffect(() => {
    if (!onSort) return;

    if (indices.valueOf() !== indicesRef.current.valueOf()) {
      onSort(indices);

      indicesRef.current = indices;
    }
  }, [indices, indicesRef, onSort]);

  return (
    <div className={styles['drag-sort__wrapper']} ref={wrapperRef}>
      <ul className={styles['drag-sort__container']} ref={containerRef} onDragLeave={handleContainerDragLeave}>
        {sortableItems.map((child, index) => (
          <li
            className={`${styles['drag-sort__drop-target']} ${dragOver ? styles['drag-sort__drop-target--over'] : ''}`}
            key={index}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {cloneElement(child, { index })}
          </li>
        ))}
      </ul>
    </div>
  );
}
