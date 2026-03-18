import "./NotFound.css";

import { Typography } from "@mui/material";

import { Link } from "react-router-dom";

import ErrorIcon from "@mui/icons-material/Error";

const NotFound = () => {
  return (
    <div className="pageNotFound">
      <ErrorIcon className="notFoundIcon" />

      <Typography variant="h5" className="notFoundText">
        Page Not Found
      </Typography>

      <Link to="/" className="notFoundBtn">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
