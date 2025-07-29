## Proportional Budget Allocation Popup (React)

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

**Note:**
To attempt the solution, comment out the solution component import in `App.jsx` and uncomment the template component import. Implement your solution in the template file as instructed.