import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./styles.css";

const resourceList = [
  { key: "cpu", label: "CPU" },
  { key: "gpu", label: "GPU" },
  { key: "memory", label: "Memory" },
  { key: "other", label: "Other" },
];



const COLORS = ["#93C2FF", "#D3C2FF", "#DCB7BC", "#FBDB86"];

export default function BudgetPopup() {
  const [maxLimit, setMaxLimit] = useState(100);
  const [pricingData, setPricingData] = useState({
    cpu: { value: 0 },
    gpu: { value: 0 },
    memory: { value: 0 },
    other: { value: 0 },
  });

  useEffect(() => {
    setPricingData({
      cpu: { value: 0 },
      gpu: { value: 0 },
      memory: { value: 0 },
      other: { value: 0 },
    });
  }, [maxLimit]);

  const totalUsed = Object.values(pricingData).reduce((sum, item) => sum + item.value, 0);
  const remaining = Math.max(0, maxLimit - totalUsed);

  const handleSliderBudgetChange = (e) => {
    const newValue = Number(e.target.value);
    const currentName = e.target.name;
    const oldValue = pricingData[currentName].value;
    const delta = newValue - oldValue;

    const total = Object.values(pricingData).reduce((sum, item) => sum + item.value, 0);
    const projectedTotal = total + delta;

    if (projectedTotal <= maxLimit) {
      setPricingData((prev) => ({
        ...prev,
        [currentName]: {
          ...prev[currentName],
          value: newValue,
        },
      }));
      return;
    }

    const excess = projectedTotal - maxLimit;
    const otherKeys = Object.keys(pricingData).filter((key) => key !== currentName);
    const totalOtherValue = otherKeys.reduce((sum, key) => sum + pricingData[key].value, 0);

    const updatedData = { ...pricingData };

    otherKeys.forEach((key) => {
      const currentVal = pricingData[key].value;
      if (totalOtherValue === 0 || currentVal === 0) return;

      const reduction = Math.min(
        currentVal,
        Math.round((currentVal / totalOtherValue) * excess)
      );

      updatedData[key] = {
        ...updatedData[key],
        value: Math.max(0, currentVal - reduction),
      };
    });

    updatedData[currentName] = {
      ...updatedData[currentName],
      value: newValue,
    };

    setPricingData(updatedData);
  };

  const handleCancel = () => {
    Swal.fire({
      title: 'Cancel?',
      text: 'All changes will be lost.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FBDB86',
      cancelButtonColor: '#23272F',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        setPricingData({
          cpu: { value: 0 },
          gpu: { value: 0 },
          memory: { value: 0 },
          other: { value: 0 },
        });
        setMaxLimit(100);
        Swal.fire(
          'Reset!',
          'Budget allocation reset.',
          'success'
        );
      }
    });
  };

  const handleAllotNow = () => {
    Swal.fire({
      title: 'Success!',
      text: 'Budget allocated successfully.',
      icon: 'success',
      confirmButtonColor: '#FBDB86'
    });
    setPricingData({
      cpu: { value: 0 },
      gpu: { value: 0 },
      memory: { value: 0 },
      other: { value: 0 },
    });
    setMaxLimit(100);
  };

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
              onChange={handleSliderBudgetChange}
              className="resource-slider"
              data-testid={`resource-slider-${res.key}`}
              style={{
                accentColor: COLORS[idx],
                background: `linear-gradient(90deg, ${COLORS[idx]} 0%, #353945 100%)`,
              }}
            />
          </div>
        ))}
        {/* {totalUsed > maxLimit && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1em', textAlign: 'center' }}>
            Allocation exceeds total budget!
          </div>
        )} */}
        <div className="button-container">
          <button 
            className="cancel-button"
            onClick={handleCancel}
            data-testid="cancel-button"
          >
            Cancel
          </button>
          <button 
            className="allot-button"
            onClick={handleAllotNow}
            data-testid="allot-button"
            disabled={totalUsed === 0 || totalUsed > maxLimit}
          >
            Allot Now
          </button>
        </div>
      </div>
    </div>
  );
} 