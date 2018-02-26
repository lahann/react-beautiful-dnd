// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContext } from '../../../src/';
import type { DragStart, DropResult } from '../../../src/';
import type { Task } from '../types';
import type { Column as ColumnType } from './types';
import initial from './data';
import Column from './column';

const Container = styled.div`
  display: flex;
  user-select: none;
`;

type State = {|
  columns: ColumnType[],
  selected: Task[],
|}

export default class TaskApp extends Component<*, State> {
  state: State = {
    columns: initial,
    selected: [],
  }

  onDragStart = (start: DragStart) => {
    const id: string = start.draggableId;
    const selected: ?Task = this.state.selected.find((task: Task): boolean => task.id === id);

    // if dragging an item that is not selected - unselect all items
    if (!selected) {
      this.unselectAll();
    }
  }

  onDragEnd = (result: DropResult) => {
    // nothing was selected
    if (!this.state.selected.length) {

    }
  }

  selectTask = (task: Task) => {
    this.setState({
      selected: [...this.state.selected, task],
    });
  }

  unselectTask = (task: Task) => {
    const index: number = this.state.selected.indexOf(task);

    if (index === -1) {
      throw new Error('Cannot find task in selected list');
    }

    const shallow: Task[] = [...this.state.selected];
    this.setState({
      selected: shallow.slice(index, 1),
    });
  }

  unselectAll = () => {
    this.setState({
      selected: [],
    });
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Container>
          {this.state.columns.map((column: ColumnType) => (
            <Column column={column} key={column.id} />
          ))}
        </Container>
      </DragDropContext>
    );
  }
}
