// @flow
import type { Task } from '../types';

export type Column = {
  id: string,
  title: string,
  tasks: Task[],
};
