import { Typography, Stepper, Step, StepLabel } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import "./CheckoutSteps.css";

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

const CheckoutSteps = ({ activeStep = 0 }) => {
  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      sx={{
        width: "100%",
        margin: "30px 0",
      }}
    >
      {steps.map((step, index) => (
        <Step key={step.label} completed={activeStep >= index}>
          <StepLabel
            icon={step.icon}
            sx={{
              "& .MuiStepLabel-label": {
                fontWeight: 500,
                color: activeStep >= index ? "tomato" : "#555",
              },
            }}
          >
            <Typography variant="body2">{step.label}</Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutSteps;
