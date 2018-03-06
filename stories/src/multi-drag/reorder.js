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

const reorderMultiDrag = ({
  columns,
  selected,
  source,
  destination,
}): Result => {

};

const getColumnById = (columns: Column[], id: string): Column => {
  const column: ?Column = columns.find((col: Column) => col.id === id);
  if (!column) {
    throw new Error('cannot find column');
  }
  return column;
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
