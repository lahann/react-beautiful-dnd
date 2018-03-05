// @flow
import type { Column } from './types';
import type { Task } from '../types';
import type { DraggableLocation } from '../../../src/types';

type Args = {|
  columns: Column[],
  selected: Task[],
  source: DraggableLocation,
  destination: DraggableLocation,
|}

type Result = {|
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

const reorderSingleDrag = ({
  columns,
  selected,
  source,
  destination,
}): Result => {

};

export default (args: Args): Result => {
  if (args.selected.length > 1) {
    return reorderMultiDrag(args);
  }
  return reorderSingleDrag(args);
};