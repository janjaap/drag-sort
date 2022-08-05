import { Children } from 'react';

import type { ReactElement } from 'react';
import type { OnSort } from './DragSortContainer';

import { DragSortItem } from './DragSortItem';
import { DragSortProvider } from './DragSortProvider';

interface Props {
  children: ReactElement | ReactElement[];
  onSort?: OnSort;
}

export const DragSort = ({ children, onSort }: Props) => (
  <DragSortProvider onSort={onSort}>
    {Children.map(children, (child, index) => (
      <DragSortItem index={index} key={index}>
        {child}
      </DragSortItem>
    ))}
  </DragSortProvider>
);
