// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from '../../../src/';
import { grid, colors, borderRadius } from '../constants';
import type { DraggableProvided, DraggableStateSnapshot } from '../../../src/';
import type { Task as TaskType } from '../types';

type Props = {|
  task: TaskType,
  index: number,
|}

const Container = styled.div`
  border-bottom: 1px solid #ccc;
  background: ${colors.white};
  padding: ${grid}px;
  margin-bottom: ${grid}px;
  border-radius: ${borderRadius}px;
  font-size: 18px;

  ${({ isDragging }) => (isDragging ? 'box-shadow: 1px 1px 1px grey; background: lightblue' : '')}
`;

export default class Task extends Component<Props> {
  render() {
    const task: TaskType = this.props.task;
    const index: number = this.props.index;
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <div>
            <Container innerRef={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
              {task.content}
            </Container>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }
}
