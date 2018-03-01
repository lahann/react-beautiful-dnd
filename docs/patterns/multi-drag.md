# Mutli drag pattern

Dragging multiple `Draggable`s at once (multi drag) is a pattern that needs to be built on top of `react-beautiful-dnd`. The library does not ship with a multi drag experience out of the box. This is done because a multi drag experience introduces a lot of concepts and decisions that are not required for standard list reordering. This page is designed to guide you through building your own mutil drag experience to your `react-beautiful-dnd` lists.

## Introducing selection

The core experience that needs to be built is that of selection management. You need to create a way for users to:

- select and item
- add an item to a selection
- unselect and item
- remove an item from the selection
- unselect all items

All of these interactions need to be possible with both a keyboard and mouse.

## Performance

Doing a multi drag interaction in a performant way can be challenging. The core thing you want to do is to avoid calling `render()` on components that do not need to update. Here are some pitfalls:

### Selection state change

You do not want to re-render **any** `Droppable` or `Draggable` in response to changes in the selected state. You do not want to re render `Draggables` whose selection state is not changing. Additionally, you do not even want to render the component whose selection state is changing.......

