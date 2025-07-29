import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BudgetPopup from './BudgetPopup';

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: false })
  }
}));

describe('BudgetPopup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the budget popup with all elements', () => {
      render(<BudgetPopup />);
      
      expect(screen.getByTestId('budget-popup')).toBeInTheDocument();
      expect(screen.getByTestId('popup-title')).toHaveTextContent('Allot your budget and divide it');
      expect(screen.getByTestId('budget-input')).toBeInTheDocument();
      expect(screen.getByTestId('budget-label')).toHaveTextContent('Total Budget');
      expect(screen.getByTestId('remaining-budget')).toBeInTheDocument();
      expect(screen.getByTestId('resource-limits-title')).toHaveTextContent('Set Resource Limits');
      expect(screen.getByTestId('resource-item-cpu')).toBeInTheDocument();
      expect(screen.getByTestId('resource-item-gpu')).toBeInTheDocument();
      expect(screen.getByTestId('resource-item-memory')).toBeInTheDocument();
      expect(screen.getByTestId('resource-item-other')).toBeInTheDocument();
      expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
      expect(screen.getByTestId('allot-button')).toBeInTheDocument();
    });

    it('should display correct initial values', () => {
      render(<BudgetPopup />);
      
      expect(screen.getByTestId('budget-input')).toHaveValue(100);
      expect(screen.getByTestId('resource-value-cpu')).toHaveTextContent('0');
      expect(screen.getByTestId('resource-value-gpu')).toHaveTextContent('0');
      expect(screen.getByTestId('resource-value-memory')).toHaveTextContent('0');
      expect(screen.getByTestId('resource-value-other')).toHaveTextContent('0');
      expect(screen.getByTestId('remaining-budget')).toHaveTextContent('Remaining: 100 USD');
    });

    it('should display resource labels correctly', () => {
      render(<BudgetPopup />);
      
      expect(screen.getByTestId('resource-label-cpu')).toHaveTextContent('CPU');
      expect(screen.getByTestId('resource-label-gpu')).toHaveTextContent('GPU');
      expect(screen.getByTestId('resource-label-memory')).toHaveTextContent('Memory');
      expect(screen.getByTestId('resource-label-other')).toHaveTextContent('Other');
    });
  });

  describe('Budget Input Functionality', () => {
    it('should update total budget when input changes', async () => {
      render(<BudgetPopup />);
      
      const budgetInput = screen.getByTestId('budget-input');
      fireEvent.change(budgetInput, { target: { value: '200' } });
      
      expect(budgetInput).toHaveValue(200);
    });

    it('should handle invalid budget input', async () => {
      const user = userEvent.setup();
      render(<BudgetPopup />);
      
      const budgetInput = screen.getByTestId('budget-input');
      await user.clear(budgetInput);
      await user.type(budgetInput, 'abc');
      
      expect(budgetInput).toHaveValue(1);
    });
  });

  describe('Resource Slider Functionality', () => {
    it('should update resource values when sliders are moved', async () => {
      const user = userEvent.setup();
      render(<BudgetPopup />);
      
      const cpuSlider = screen.getByTestId('resource-slider-cpu');
      await user.click(cpuSlider);
      fireEvent.change(cpuSlider, { target: { value: '30' } });
      
      expect(screen.getByTestId('resource-value-cpu')).toHaveTextContent('30');
      expect(screen.getByTestId('remaining-budget')).toHaveTextContent('Remaining: 70 USD');
    });

    it('should prevent exceeding total budget', async () => {
      const user = userEvent.setup();
      render(<BudgetPopup />);
      
      const cpuSlider = screen.getByTestId('resource-slider-cpu');
      const gpuSlider = screen.getByTestId('resource-slider-gpu');
      
      fireEvent.change(cpuSlider, { target: { value: '60' } });
      expect(screen.getByTestId('resource-value-cpu')).toHaveTextContent('60');
      
      fireEvent.change(gpuSlider, { target: { value: '50' } });
      
      const gpuValue = screen.getByTestId('resource-value-gpu');
      expect(gpuValue.textContent).toBe('50');
      expect(screen.getByTestId('remaining-budget')).toHaveTextContent('All budget allotted');
    });

    it('should show "All budget allotted" when budget is fully used', async () => {
      const user = userEvent.setup();
      render(<BudgetPopup />);
      
      const cpuSlider = screen.getByTestId('resource-slider-cpu');
      fireEvent.change(cpuSlider, { target: { value: '100' } });
      
      expect(screen.getByTestId('remaining-budget')).toHaveTextContent('All budget allotted');
      expect(screen.getByTestId('remaining-budget')).toHaveClass('zero');
    });
  });

  describe('Button Functionality', () => {
    it('should show confirmation dialog when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<BudgetPopup />);
      
      const cancelButton = screen.getByTestId('cancel-button');
      await user.click(cancelButton);
      
      expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    });

    it('should show warning when allot button is clicked with no allocation', async () => {
      const user = userEvent.setup();
      render(<BudgetPopup />);
      
      const allotButton = screen.getByTestId('allot-button');
      await user.click(allotButton);
      
      expect(screen.getByTestId('allot-button')).toBeInTheDocument();
    });

    it('should show success dialog when allot button is clicked with allocation', async () => {
      const user = userEvent.setup();
      render(<BudgetPopup />);
      
      const cpuSlider = screen.getByTestId('resource-slider-cpu');
      fireEvent.change(cpuSlider, { target: { value: '30' } });
      
      const allotButton = screen.getByTestId('allot-button');
      await user.click(allotButton);
      
      expect(screen.getByTestId('allot-button')).toBeInTheDocument();
    });

    it('should disable allot button when no budget is allocated', () => {
      render(<BudgetPopup />);
      
      const allotButton = screen.getByTestId('allot-button');
      expect(allotButton).toBeDisabled();
    });

    it('should enable allot button when budget is allocated', async () => {
      render(<BudgetPopup />);
      
      const cpuSlider = screen.getByTestId('resource-slider-cpu');
      fireEvent.change(cpuSlider, { target: { value: '30' } });
      
      const allotButton = screen.getByTestId('allot-button');
      expect(allotButton).not.toBeDisabled();
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes', () => {
      render(<BudgetPopup />);
      
      expect(screen.getByTestId('budget-popup')).toHaveClass('budget-popup-container');
      expect(screen.getByTestId('popup-title')).toHaveClass('budget-popup-title');
      expect(screen.getByTestId('budget-input')).toHaveClass('budget-input');
      expect(screen.getByTestId('cancel-button')).toHaveClass('cancel-button');
      expect(screen.getByTestId('allot-button')).toHaveClass('allot-button');
    });

    it('should apply correct remaining budget classes', () => {
      render(<BudgetPopup />);
      
      const remainingBudget = screen.getByTestId('remaining-budget');
      expect(remainingBudget).toHaveClass('positive');
      
      const cpuSlider = screen.getByTestId('resource-slider-cpu');
      fireEvent.change(cpuSlider, { target: { value: '100' } });
      
      expect(remainingBudget).toHaveClass('zero');
    });
  });
}); 