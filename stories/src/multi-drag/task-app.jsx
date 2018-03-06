// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContext } from '../../../src/';
import initial from './data';
import Column from './column';
import reorder, { type Result as ReorderResult } from './reorder';
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

  componentDidMount() {
    window.addEventListener('click', this.onWindowClick);
    // TODO: allow shift + arrow keys to increase selection
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick);
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
    const selected: Task[] = this.state.selected;

    // const sourceColumn: ?ColumnType = columns.find(
    //   (column: ColumnType): boolean => column.id === source.droppableId
    // );
    // const destinationColumn: ?ColumnType = columns.find(
    //   (column: ColumnType): boolean => column.id === destination.droppableId
    // );

    // if (!sourceColumn || !destinationColumn) {
    //   throw new Error('unable to find columns');
    // }

    const processed: ReorderResult = reorder({
      columns,
      selected,
      source,
      destination,
    });

    this.setState({
      columns: processed.columns,
      selected: processed.selected,
    });
  }

  onWindowClick = (event: MouseEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    this.unselectAll();
  }

  select = (task: Task) => {
    this.setState({
      selected: [task],
    });
  }

  addToSelection = (task: Task) => {
    this.setState({
      selected: [...this.state.selected, task],
    });
  }

  removeFromSelection = (task: Task) => {
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

  unselect = () => {
    this.unselectAll();
  };

  unselectAll = () => {
    this.setState({
      selected: [],
    });
  }

  render() {
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Container>
          {this.state.columns.map((column: ColumnType) => (
            <Column
              column={column}
              key={column.id}
              select={this.select}
              unselect={this.unselect}
              selected={this.state.selected}
              addToSelection={this.addToSelection}
              removeFromSelection={this.removeFromSelection}
            />
          ))}
        </Container>
      </DragDropContext>
    );
  }
}
