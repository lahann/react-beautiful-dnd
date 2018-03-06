// @flow
import type { Column, ColumnMap } from './types';
import type { Task } from '../types';
import type { DraggableLocation } from '../../../src/types';
import reorder from '../reorder';

type Args = {|
  columns: Column[],
  selected: Task[],
  source: DraggableLocation,
  destination: DraggableLocation,
|}

export type Result = {|
  columns: Column[],
  // a drop operations can change the order of the selected task array
  selected: Task[],
|}

type Entry = {|
  task: Task,
  index: number,
  selectionIndex: number,
|}

const getColumnById = (columns: Column[], id: string): Column => {
  const column: ?Column = columns.find((col: Column) => col.id === id);
  if (!column) {
    throw new Error('cannot find column');
  }
  return column;
};

const reorderMultiDrag = ({
  columns,
  selected,
  source,
  destination,
}): Result => {
  // 1. remove all of the selected tasks from their lists
  // When ordering the collected tasks:
  //  dragged item first
  //  followed by the items with the lowest index
  //  in the event of a tie, use the one that was selected first

  const home: Column = getColumnById(columns, source.droppableId);
  const foreign: Column = getColumnById(columns, destination.droppableId);
  const dragged: Task = home.tasks[source.index];

  const collection: Entry[] = selected.map((task: Task, selectionIndex: number): Entry => {
    const column: ?Column = columns.find((col: Column) => col.tasks.includes(task));

    if (!column) {
      throw new Error('Could not find home for task');
    }

    const index: number = column.tasks.indexOf(task);

    const entry: Entry = {
      task,
      index,
      selectionIndex,
    };

    return entry;
  });

  collection.sort((a: Entry, b: Entry): number => {
    // moving the dragged item to the top of the list
    if (a === dragged) {
      return -1;
    }
    if (b === dragged) {
      return 1;
    }

    // sorting by the index
    if (a.index !== b.index) {
      return a.index - b.index;
    }

    // if the index is the same then we use the order in which it was selected
    return a.selectionIndex - b.selectionIndex;
  });

  // okay, now we are going to remove the tasks from their original locations
};

const replaceColumn = (columns: Column[], newColumn: Column): Column[] => {
  const index: number = columns.findIndex((col: Column) => col.id === newColumn.id);
  const shallow: Column[] = [...columns];
  shallow[index] = newColumn;
  return shallow;
};

const withNewTasks = (column: Column, tasks: Task[]): Column => ({
  id: column.id,
  title: column.title,
  tasks,
});

const reorderSingleDrag = ({
  columns,
  selected,
  source,
  destination,
}): Result => {
  // moving in same list
  if (source.droppableId === destination.droppableId) {
    const column: Column = getColumnById(columns, source.droppableId);
    const reordered: Task[] = reorder(
      column.tasks,
      source.index,
      destination.index,
    );
    const withReorderedTasks: Column = withNewTasks(column, reordered);
    const updated: Column[] = replaceColumn(columns, withReorderedTasks);

    const result: Result = {
      columns: updated,
      // not updating the selected items
      selected,
    };

    return result;
  }

  const home: Column = getColumnById(columns, source.droppableId);
  const foreign: Column = getColumnById(columns, destination.droppableId);
  const homeIndex: number = columns.indexOf(home);
  const foreignIndex: number = columns.indexOf(foreign);

  // the single task to be moved
  const task: Task = home.tasks[source.index];

  // remove from home column
  const newHomeTasks: Task[] = [...home.tasks];
  newHomeTasks.splice(source.index, 1);

  // add to foreign column
  const newForeignTasks: Task[] = [...foreign.tasks];
  newForeignTasks.splice(destination.index, 0, task);

  const shallow: Column[] = [...columns];
  shallow[homeIndex] = withNewTasks(home, newHomeTasks);
  shallow[foreignIndex] = withNewTasks(foreign, newForeignTasks);

  const result: Result = {
    columns: shallow,
    selected,
  };

  return result;
};

export default (args: Args): Result => {
  if (args.selected.length > 1) {
    return reorderMultiDrag(args);
  }
  return reorderSingleDrag(args);
};
