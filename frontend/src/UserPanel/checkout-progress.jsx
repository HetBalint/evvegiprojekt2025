import React from "react"

const CheckoutProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, name: "Kosár" },
    { id: 2, name: "Rendelés áttekintése" },
    { id: 3, name: "Cím megadása" },
  ]

  return (
    <div className="checkout-progress">
      {steps.map((step) => (
        <React.Fragment key={step.id}>
          <div className={`step ${currentStep === step.id ? "active" : ""}`}>
            <div className="step-number">{step.id}</div>
            <div className="step-name">{step.name}</div>
          </div>
          {step.id < steps.length && <div className={`connector ${currentStep > step.id ? "completed" : ""}`}></div>}
        </React.Fragment>
      ))}
    </div>
  )
}

export default CheckoutProgress
