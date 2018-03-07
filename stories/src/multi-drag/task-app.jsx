// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContext } from '../../../src/';
import initial from './data';
import Column from './column';
import reorder, { type Result as ReorderResult } from './reorder';
import type { DragStart, DropResult, DraggableLocation } from '../../../src/';
import type { Task, Id } from '../types';
import type { Entities, Column as ColumnType } from './types';

const Container = styled.div`
  display: flex;
  user-select: none;
`;

type State = {|
  entities: Entities,
  selectedTaskIds: Id[],
|}

const getTasks = (entities: Entities, columnId: Id): Task[] =>
  entities.columns[columnId].taskIds.map(
    (taskId: Id): Task => entities.tasks[taskId]
  );
export default class TaskApp extends Component<*, State> {
  state: State = {
    entities: initial,
    selectedTaskIds: [],
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
    const selected: ?Id = this.state.selectedTaskIds.find((taskId: Id): boolean => taskId === id);

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

    const processed: ReorderResult = reorder({
      entities: this.state.entities,
      selectedTaskIds: this.state.selectedTaskIds,
      source,
      destination,
    });

    this.setState(processed);
  }

  onWindowClick = (event: MouseEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    this.unselectAll();
  }

  select = (taskId: Id) => {
    this.setState({
      selectedTaskIds: [taskId],
    });
  }

  addToSelection = (taskId: Id) => {
    this.setState({
      selectedTaskIds: [...this.state.selectedTaskIds, taskId],
    });
  }

  removeFromSelection = (taskId: Id) => {
    const index: number = this.state.selectedTaskIds.indexOf(taskId);

    if (index === -1) {
      throw new Error('Cannot find task in selected list');
    }

    const shallow: Id[] = [...this.state.selectedTaskIds];
    shallow.splice(index, 1);
    this.setState({
      selectedTaskIds: shallow,
    });
  }

  unselect = () => {
    this.unselectAll();
  };

  unselectAll = () => {
    this.setState({
      selectedTaskIds: [],
    });
  }

  render() {
    const entities: Entities = this.state.entities;
    const selected: Id[] = this.state.selectedTaskIds;
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Container>
          {entities.columnOrder.map((columnId: Id) => (
            <Column
              column={entities.columns[columnId]}
              tasks={getTasks(entities, columnId)}
              selectedTaskIds={selected}
              key={columnId}
              select={this.select}
              unselect={this.unselect}
              addToSelection={this.addToSelection}
              removeFromSelection={this.removeFromSelection}
            />
          ))}
        </Container>
      </DragDropContext>
    );
  }
}
