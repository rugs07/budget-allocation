import React, { useState } from "react";
import "./styles.css";

const resourceList = [
  { key: "cpu", label: "CPU" },
  { key: "gpu", label: "GPU" },
  { key: "memory", label: "Memory" },
  { key: "other", label: "Other" },
];

const COLORS = ["#93C2FF", "#D3C2FF", "#DCB7BC", "#FBDB86"];

export default function BudgetPopupTemplate() {
  const [maxLimit, setMaxLimit] = useState(100);
  const [pricingData, setPricingData] = useState({
    cpu: { value: 0 },
    gpu: { value: 0 },
    memory: { value: 0 },
    other: { value: 0 },
  });

  const totalUsed = Object.values(pricingData).reduce((sum, item) => sum + item.value, 0);
  const remaining = Math.max(0, maxLimit - totalUsed);


  return (
    <div className="budget-popup-container" data-testid="budget-popup">
      <div className="budget-popup-header">
        <h2 className="budget-popup-title" data-testid="popup-title">
          Allot your budget and divide it
        </h2>
        <div className="budget-controls">
          <div className="budget-input-section">
            <label className="budget-label" data-testid="budget-label">
              Total Budget
            </label>
            <input
              type="number"
              min={1}
              value={maxLimit}
              onChange={e => setMaxLimit(Number(e.target.value) || 1)}
              className="budget-input"
              data-testid="budget-input"
            />
            <span className="budget-currency">USD</span>
          </div>
          <div 
            className={`remaining-budget ${remaining === 0 ? 'zero' : 'positive'}`}
            data-testid="remaining-budget"
          >
            {remaining === 0
              ? "All budget allotted"
              : `Remaining: ${remaining} USD`}
          </div>
        </div>
      </div>
      <div className="budget-popup-body">
        <div className="resource-limits-title" data-testid="resource-limits-title">
          Set Resource Limits
        </div>
        {resourceList.map((res, idx) => (
          <div key={res.key} className="resource-item" data-testid={`resource-item-${res.key}`}>
            <div className="resource-header">
              <span className="resource-label" data-testid={`resource-label-${res.key}`}>
                {res.label}
              </span>
              <span 
                className="resource-value" 
                data-testid={`resource-value-${res.key}`}
                style={{ color: COLORS[idx] }}
              >
                {pricingData[res.key].value}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={maxLimit}
              value={pricingData[res.key].value}
              name={res.key}
              // TODO: Add onChange handler for slider logic
              className="resource-slider"
              data-testid={`resource-slider-${res.key}`}
              style={{
                accentColor: COLORS[idx],
                background: `linear-gradient(90deg, ${COLORS[idx]} 0%, #353945 100%)`,
              }}
            />
          </div>
        ))}
        {/* TODO: Show error message if over-allocated */}
        <div className="button-container">
          <button 
            className="cancel-button"
            // TODO: Add onClick handler for cancel logic
            data-testid="cancel-button"
          >
            Cancel
          </button>
          <button 
            className="allot-button"
            // TODO: Add onClick handler for allot logic
            data-testid="allot-button"
            // TODO: Add disabled logic
          >
            Allot Now
          </button>
        </div>
      </div>
    </div>
  );
} 