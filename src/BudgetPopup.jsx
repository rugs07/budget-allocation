import React, { useState, useEffect } from "react";

const resourceList = [
  { key: "cpu", label: "CPU" },
  { key: "gpu", label: "GPU" },
  { key: "memory", label: "Memory" },
  { key: "otherservices", label: "Other Services" },
];

const setSliderBackground = () => {};

const COLORS = ["#4F8EF7", "#F76C5E", "#43D9AD", "#F7C948"];

export default function BudgetPopup() {
  const [maxLimit, setMaxLimit] = useState(100);
  const [pricingData, setPricingData] = useState({
    cpu: { value: 0, price: 0 },
    gpu: { value: 0, price: 0 },
    memory: { value: 0, price: 0 },
    otherservices: { value: 0, price: 0 },
  });

  useEffect(() => {
    setPricingData({
      cpu: { value: 0, price: 0 },
      gpu: { value: 0, price: 0 },
      memory: { value: 0, price: 0 },
      otherservices: { value: 0, price: 0 },
    });
  }, [maxLimit]);

  const totalUsed = Object.values(pricingData).reduce((sum, item) => sum + item.value, 0);
  const remaining = maxLimit - totalUsed;

  const handleSliderBudgetChange = (e) => {
    const newValue = Number(e.target.value);
    const currentName = e.target.name;
    const oldValue = pricingData[currentName].value;
    const delta = newValue - oldValue;

    const total = Object.values(pricingData).reduce((sum, item) => sum + item.value, 0);
    const projectedTotal = total + delta;

    if (projectedTotal <= maxLimit) {
      setSliderBackground(e.target, newValue);
      setPricingData((prev) => ({
        ...prev,
        [currentName]: {
          ...prev[currentName],
          value: newValue,
          price: newValue * 10,
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
        price: Math.max(0, (currentVal - reduction) * 10),
      };
    });

    updatedData[currentName] = {
      ...updatedData[currentName],
      value: newValue,
      price: newValue * 10,
    };

    setSliderBackground(e.target, newValue);
    setPricingData(updatedData);
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: "2rem auto",
      background: "#181A1B",
      color: "#F5F6FA",
      border: "1.5px solid #23272F",
      boxShadow: "0 2px 12px 0 rgba(0,0,0,0.10)",
      padding: 0,
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: 16,
      letterSpacing: 0.1,
      borderRadius: 0,
    }}>
      <div style={{
        background: "#23272F",
        padding: "1.5rem 2rem 1rem 2rem",
        borderBottom: "1.5px solid #23272F",
        borderRadius: 0,
      }}>
        <h2 style={{
          margin: 0,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: 0.5,
          color: "#F5F6FA"
        }}>Allot your budget and divide it later</h2>
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 18 }}>
          <label style={{ flex: 1, fontWeight: 500, color: "#B5B8C5" }}>
            Total Budget
            <input
              type="number"
              min={1}
              value={maxLimit}
              onChange={e => setMaxLimit(Number(e.target.value) || 1)}
              style={{
                marginLeft: 10,
                width: 90,
                background: "#23272F",
                color: "#F5F6FA",
                border: "1.5px solid #353945",
                padding: "6px 10px",
                outline: "none",
                fontWeight: 600,
                borderRadius: 0,
              }}
            />
            <span style={{ marginLeft: 8, color: "#F7C948", fontWeight: 700 }}>USD</span>
          </label>
          <div style={{ flex: 1, textAlign: "right", color: remaining === 0 ? "#F76C5E" : "#43D9AD", fontWeight: 600 }}>
            {remaining === 0
              ? "All budget allotted"
              : `Remaining: ${remaining} USD`}
          </div>
        </div>
      </div>
      <div style={{ background: "#202226", padding: "1.5rem 2rem 2rem 2rem" }}>
        <div style={{ fontWeight: 600, color: "#B5B8C5", marginBottom: 18, fontSize: 15, letterSpacing: 0.2 }}>
          Set Resource Limits
        </div>
        {resourceList.map((res, idx) => (
          <div key={res.key} style={{ margin: "1.2rem 0 0.8rem 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 500, color: "#F5F6FA", fontSize: 15 }}>{res.label}</span>
              <span style={{ fontWeight: 700, color: COLORS[idx], fontSize: 15 }}>{pricingData[res.key].value}</span>
            </div>
            <input
              type="range"
              min={0}
              max={maxLimit}
              value={pricingData[res.key].value}
              name={res.key}
              onChange={handleSliderBudgetChange}
              style={{
                width: "100%",
                marginTop: 8,
                accentColor: COLORS[idx],
                height: 4,
                background: `linear-gradient(90deg, ${COLORS[idx]} 0%, #353945 100%)`,
                border: "none",
                outline: "none",
                borderRadius: 0,
                boxShadow: "none",
                appearance: "none",
              }}
            />
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 32 }}>
          <button style={{
            background: "#23272F",
            color: "#F5F6FA",
            border: "1.5px solid #353945",
            padding: "10px 36px",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            borderRadius: 0,
            transition: "background 0.2s, color 0.2s",
          }}>Cancel</button>
          <button style={{
            background: "#F7C948",
            color: "#23272F",
            border: "none",
            padding: "10px 32px",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
            borderRadius: 0,
            transition: "background 0.2s, color 0.2s",
          }}>Allot Now</button>
        </div>
      </div>
    </div>
  );
} 