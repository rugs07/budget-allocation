## Proportional Budget Allocation Popup (React)

## UI and Initial State Requirements
1. The popup must render with the title: "Allot your budget and divide it" (data-testid: popup-title).
2. There must be an input with the label "Total Budget" (data-testid: budget-label).
3. The initial value of the total budget must be 100 (data-testid: budget-input).
4. The initial values for CPU, GPU, Memory, and Other must be 0 (data-testid: resource-value-cpu, resource-value-gpu, resource-value-memory, resource-value-other).
5. The initial remaining budget must display 'Remaining: 100 USD' (data-testid: remaining-budget).
6. The resource labels must be 'CPU', 'GPU', 'Memory', and 'Other', with data-testid attributes 'resource-label-cpu', 'resource-label-gpu', 'resource-label-memory', and 'resource-label-other'.
7. If the user enters an invalid or non-numeric value in the total budget input, the value should default to 1 USD (data-testid: budget-input).

Build a visually appealing budget allocation popup for a cloud platform. The popup allows users to set a total budget and allocate it across four resources: CPU, GPU, Memory, and Other Services. Each resource is controlled by a slider with a modern, flat UI (no rounded corners).

**Requirements:**
- The user can set a total budget (number input).
- There are four sliders, one for each resource, each with a distinct color.
- The sum of all slider values cannot exceed the total budget.
- If the user tries to increase a slider beyond the remaining budget, the other sliders automatically decrease proportionally to make room.
- Display the remaining budget dynamically.
- Implement Cancel and Allot Now buttons with SweetAlert2 popup functionality.
- Use separate CSS file for all styling (no inline styles).
- Include comprehensive data-testid attributes for testing.

**Key Features:**
- **Budget Input**: Users can modify the total budget using the number input field
- **Resource Sliders**: Four sliders for CPU, GPU, Memory, and Other with distinct colors
- **Proportional Reallocation**: When budget limit is exceeded, other resources are reduced proportionally
- **Real-time Updates**: Remaining budget is displayed and updated in real-time
- **Button Functionality**: 
  - Cancel button shows confirmation dialog and resets all allocations
  - Allot Now button shows allocation summary or warning if no budget allocated
- **Responsive Design**: Modern flat UI with hover effects and proper state management

**Data Test IDs for Testing:**
- `budget-popup`: Main container
- `popup-title`: Title element
- `budget-input`: Budget input field
- `budget-label`: Budget label
- `remaining-budget`: Remaining budget display
- `resource-limits-title`: Resource limits section title
- `resource-item-{resource}`: Individual resource containers (cpu, gpu, memory, other)
- `resource-label-{resource}`: Resource labels
- `resource-value-{resource}`: Resource value displays
- `resource-slider-{resource}`: Resource sliders
- `cancel-button`: Cancel button
- `allot-button`: Allot Now button

**CSS Classes:**
- All styling is handled through CSS classes in `src/styles.css`
- No inline styles should be used in the component
- Proper hover states and transitions implemented

**Testing Requirements:**
- Comprehensive test suite in `BudgetPopup.test.js`
- Tests for rendering, user interactions, budget logic, and button functionality
- Mock SweetAlert2 for testing popup dialogs
- Test edge cases and error scenarios

---

**Note:**
For popup messages, you can use the [SweetAlert2 (Swal)](https://sweetalert2.github.io/) library, which is already included in this environment.
Example usage:
```js
Swal.fire({
  title: 'Hello!',
  text: 'This is a popup.',
  icon: 'info'
});
```
To attempt the solution, comment out the solution component import in `App.jsx` and uncomment the template component import. Implement your solution in the template file as instructed.