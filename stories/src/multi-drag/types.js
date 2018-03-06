// @flow
import type { Task } from '../types';

export type Column = {|
  id: string,
  title: string,
  tasks: Task[],
|};

export type ColumnMap = {
  [id: string]: Column,
};