// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContext } from '../../../src/';
import initial from './data';
import Column from './column';
import reorder from './reorder';
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

    const reordered: ColumnType[] = reorder({
      columns,
      selected,
      source,
      destination,
    });

    this.setState({
      columns: reordered,
    });


    // nothing, or a single item selected
    if (this.state.selected.length <= 1) {
      if (sourceColumn === destinationColumn) {
        // moving in same list
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
        return;
      }

      // moving to a new column
      const task: Task = sourceColumn.tasks[source.index];
      const home: Task[] = [...sourceColumn.tasks];
      // remove from the original column
      home.splice(source.index, 1);

      const foreign: Task[] = [...destinationColumn.tasks];
      // add to the new column
      foreign.splice(destination.index, 0, task);

      const homeIndex: number = columns.indexOf(sourceColumn);
      const foreignIndex: number = columns.indexOf(destinationColumn);

      const newHome: ColumnType = {
        id: sourceColumn.id,
        title: sourceColumn.title,
        tasks: home,
      };
      const newForeign: ColumnType = {
        id: destinationColumn.id,
        title: destinationColumn.title,
        tasks: foreign,
      };

      const shallow: ColumnType[] = [...columns];
      shallow[homeIndex] = newHome;
      shallow[foreignIndex] = newForeign;

      this.setState({
        columns: shallow,
      });
    }

    // Multiple items where selected

    // We need to move all of them to the new location.
    // We are also going to place the item that was dragging first
    // Otherwise we will preserve the order as much as possible.
    // We put the dragging item on top as otherwise what the user was dragging
    // could get lost in the dropped items

    // 1. Remove all of the selected items from their current positions
    // 2. Place all of the items in the new location

    // Complication: items could have been selected from different lists.
    // In which case - how should they be ordered?


    // ## Phase 1: remove all selected items

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
