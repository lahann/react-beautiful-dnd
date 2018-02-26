// @flow
import type { Column } from './types';

const columns: Column[] = [
  {
    id: 'todo',
    title: 'Todo',
    tasks: [
      {
        id: '1',
        content: 'Go to the beach',
      },
      {
        id: '2',
        content: 'Eat and sandwich',
      },
      {
        id: '3',
        content: 'Finish this tutorial',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [],
  },
];

export default columns;
