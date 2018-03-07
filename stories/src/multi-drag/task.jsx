// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Draggable } from '../../../src/';
import { grid, colors, borderRadius } from '../constants';
import type { DraggableProvided, DragHandleProps, DraggableStateSnapshot } from '../../../src/';
import type { Id, Task as TaskType } from '../types';

type Props = {|
  task: TaskType,
  index: number,
  isSelected: boolean,
  selectionCount: number,
  select: (taskId: Id) => void,
  unselect: (taskId: Id) => void,
  addToSelection: (taskId: Id) => void,
  removeFromSelection: (taskId: Id) => void,
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

  /* needed for SelectionCount */
  position: relative;
`;

const Content = styled.div`
`;

const size: number = 40;

const SelectionCount = styled.div`
  right: -${grid}px;
  top: -${grid}px;
  background: lightblue;
  border-radius: 50%;
  height: ${size}px;
  width: ${size}px;
  line-height: ${size}px;
  position: absolute;
  text-align: center;
  font-size: 0.8rem;
`;

const keyCodes = {
  enter: 13,
  escape: 27,
};

export default class Task extends Component<Props> {
  // Using onKeyUp so that we did not need to monkey patch onKeyDown
  onKeyUp = (event: KeyboardEvent, snapshot: DraggableStateSnapshot) => {
    if (event.keyCode === keyCodes.enter) {
      const {
        isSelected,
        task,
        addToSelection,
        removeFromSelection,
      } = this.props;

      if (snapshot.isDragging) {
        return;
      }

      if (isSelected) {
        removeFromSelection(task.id);
        return;
      }
      addToSelection(task.id);
      return;
    }

    if (event.keyCode === keyCodes.escape) {
      const {
        isSelected,
        task,
        unselect,
      } = this.props;

      if (isSelected) {
        unselect(task.id);
      }
    }
  }

  // Using onClick as it will be correctly
  // preventing if there was a drag
  onClick = (event: MouseEvent) => {
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
        removeFromSelection(task.id);
        return;
      }
      addToSelection(task.id);
      return;
    }

    if (isSelected) {
      unselect(task.id);
      return;
    }

    select(task.id);
  };

  render() {
    const task: TaskType = this.props.task;
    const index: number = this.props.index;
    const isSelected: boolean = this.props.isSelected;
    const selectionCount: number = this.props.selectionCount;
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <div>
            <Container
              innerRef={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={this.onClick}
              onKeyUp={(event: KeyboardEvent) => this.onKeyUp(event, snapshot)}
              isDragging={snapshot.isDragging}
              isSelected={isSelected}
            >
              <Content>{task.content}</Content>
              {snapshot.isDragging && selectionCount > 1 ?
                <SelectionCount>{selectionCount}</SelectionCount> : null
              }
            </Container>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }
}
