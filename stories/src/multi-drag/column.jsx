// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Droppable } from '../../../src/';
import { grid, colors, borderRadius } from '../constants';
import Task from './task';
import type { DroppableProvided, DroppableStateSnapshot } from '../../../src/';
import type { Column as ColumnType } from './types';
import type { Task as TaskType } from '../types';

type Props = {|
  column: ColumnType,
  selected: TaskType[],
  select: (task: TaskType) => void,
  unselect: (task: TaskType) => void,
|}

const Container = styled.div`
  width: 300px;
  margin: ${grid}px;
  background-color: ${colors.grey};
  border-radius: ${borderRadius}px;
`;

const Title = styled.h3`
  font-weight: bold;
  padding: ${grid}px;
`;

const TaskList = styled.div`
  padding: ${grid}px;
  min-height: 200px;
  ${props => (props.isDraggingOver ? `background-color: ${colors.green}` : '')};
`;

export default class Column extends Component<Props> {
  render() {
    const column: ColumnType = this.props.column;
    const selected: TaskType[] = this.props.selected;
    return (
      <Container>
        <Title>{column.title}</Title>
        <Droppable droppableId={column.id}>
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <TaskList
              innerRef={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
              {...provided.droppableProps}
            >
              {column.tasks.map((task: TaskType, index: number) => (
                <Task
                  task={task}
                  index={index}
                  key={task.id}
                  isSelected={Boolean(selected.indexOf(task) !== -1)}
                  select={this.props.select}
                  unselect={this.props.unselect}
                />
              ))}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
      </Container>
    );
  }
}
