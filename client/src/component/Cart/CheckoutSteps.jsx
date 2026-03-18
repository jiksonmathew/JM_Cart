import { Typography, Stepper, StepLabel, Step } from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

import "./CheckoutSteps.css";
import logo from "../../images/jm_cart.png";
const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    {
      label: "Shipping Details",
      icon: <LocalShippingIcon />,
    },
    {
      label: "Confirm Order",
      icon: <LibraryAddCheckIcon />,
    },
    {
      label: "Payment",
      icon: <AccountBalanceIcon />,
    },
  ];

  return (
    <>
      <div className="stepContainer">
        <div className="logo">
          {" "}
          <img src={logo} alt="JM_CART" className="logo" />
        </div>
        <div className="stepper">
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((step, index) => (
              <Step key={index} completed={activeStep >= index}>
                <StepLabel icon={step.icon}>
                  <Typography
                    style={{
                      color: activeStep >= index ? "tomato" : "rgba(0,0,0,0.6)",
                    }}
                  >
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>
    </>
  );
};

export default CheckoutSteps;
