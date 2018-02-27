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
  addToSelection: (task: TaskType) => void,
  removeFromSelection: (task: TaskType) => void,
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

const keyCodes = {
  enter: 13,
  escape: 27,
};

export default class Task extends Component<Props> {
  getEventsWithSelection = (handleProps: ?DragHandleProps): Object => {
    const onClick = (event: MouseEvent) => {
      if (handleProps) {
        handleProps.onClick(event);
      }

      if (event.defaultPrevented) {
        return;
      }

      const {
        isSelected,
        task,
        addToSelection,
        removeFromSelection,
        unselect,
        select,
      } = this.props;

      event.preventDefault();

      const wasMetaKeyUsed: boolean = event.metaKey;

      if (wasMetaKeyUsed) {
        if (isSelected) {
          removeFromSelection(task);
          return;
        }
        addToSelection(task);
        return;
      }

      if (isSelected) {
        unselect(task);
        return;
      }

      select(task);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (handleProps) {
        handleProps.onKeyDown(event);
      }

      if (event.defaultPrevented) {
        return;
      }

      if (event.keyCode === keyCodes.enter) {
        const {
          isSelected,
          task,
          addToSelection,
          removeFromSelection,
        } = this.props;

        if (isSelected) {
          removeFromSelection(task);
          return;
        }
        addToSelection(task);
        return;
      }

      if (event.keyCode === keyCodes.escape) {
        const {
          isSelected,
          task,
          unselect,
        } = this.props;

        if (isSelected) {
          unselect(task);
        }
      }
    };

    return { onClick, onKeyDown };
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
