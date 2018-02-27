// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContext } from '../../../src/';
import initial from './data';
import Column from './column';
import reorder from '../reorder';
import type { DragStart, DropResult, DraggableLocation } from '../../../src/';
import type { Task } from '../types';
import type { Column as ColumnType } from './types';

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
    const destination: ?DraggableLocation = result.destination;
    const source: DraggableLocation = result.source;

    // nothing to do
    if (!destination) {
      return;
    }

    const columns: ColumnType[] = this.state.columns;

    const sourceColumn: ?ColumnType = columns.find(
      (column: ColumnType): boolean => column.id === source.droppableId
    );
    const destinationColumn: ?ColumnType = columns.find(
      (column: ColumnType): boolean => column.id === destination.droppableId
    );

    if (!sourceColumn || !destinationColumn) {
      throw new Error('unable to find columns');
    }

    // nothing was selected
    if (!this.state.selected.length) {
      if (sourceColumn === destinationColumn) {
        // moving in same list
        console.log('moving in same list');

        const tasks: Task[] = reorder(
          sourceColumn.tasks,
          source.index,
          destination.index
        );

        const column: ColumnType = {
          id: sourceColumn.id,
          title: sourceColumn.title,
          tasks,
        };

        const index: number = columns.indexOf(sourceColumn);
        const shallow: ColumnType[] = [...columns];
        shallow[index] = column;

        this.setState({
          columns: shallow,
        });
      }

      // moving to a new column
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
    shallow.splice(index, 1);
    this.setState({
      selected: shallow,
    });
  }

  unselectAll = () => {
    this.setState({
      selected: [],
    });
  }

  onWindowClick = (event: MouseEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    this.unselectAll();
  }

  componentDidMount() {
    window.addEventListener('click', this.onWindowClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick);
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Container>
          {this.state.columns.map((column: ColumnType) => (
            <Column
              column={column}
              key={column.id}
              select={this.selectTask}
              unselect={this.unselectTask}
              selected={this.state.selected}
            />
          ))}
        </Container>
      </DragDropContext>
    );
  }
}
