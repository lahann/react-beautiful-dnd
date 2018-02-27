// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from '../../../src/';
import { grid, colors, borderRadius } from '../constants';
import type { DraggableProvided, DragHandleProps, DraggableStateSnapshot } from '../../../src/';
import type { Task as TaskType } from '../types';

type Props = {|
  task: TaskType,
  index: number,
  isSelected: boolean,
  select: (task: TaskType) => void,
  unselect: (task: TaskType) => void,
|}

const Container = styled.div`
  border-bottom: 1px solid #ccc;
  background: ${colors.white};
  padding: ${grid}px;
  margin-bottom: ${grid}px;
  border-radius: ${borderRadius}px;
  font-size: 18px;
  ${props => (props.isSelected ? 'color: red;' : '')}

  ${({ isDragging }) => (isDragging ? 'box-shadow: 1px 1px 1px grey; background: lightblue;' : '')}
`;

export default class Task extends Component<Props> {
  getEventsWithSelection = (provided: ?DragHandleProps): Object => {
    const onClick = (event: MouseEvent) => {
      if (provided) {
        provided.onClick(event);
      }

      if (event.defaultPrevented) {
        return;
      }

      const { isSelected, unselect, select, task } = this.props;

      event.preventDefault();

      if (isSelected) {
        unselect(task);
        return;
      }

      select(task);
    };

    return { onClick };
  }

  render() {
    const task: TaskType = this.props.task;
    const index: number = this.props.index;
    const isSelected: boolean = this.props.isSelected;
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <div>
            <Container
              innerRef={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              {...this.getEventsWithSelection(provided.dragHandleProps)}
              isDragging={snapshot.isDragging}
              isSelected={isSelected}
            >
              {task.content}
            </Container>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }
}
