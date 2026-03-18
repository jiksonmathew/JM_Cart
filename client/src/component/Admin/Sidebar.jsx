import "./sidebar.css";

import { Link } from "react-router-dom";

import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";

import toast from "react-hot-toast";

const Sidebar = () => {
  const handleNav = (text) => {
    toast.success(`${text} opened`);
  };

  return (
    <div className="sidebar">
      <Link to="/admin/dashboard" onClick={() => handleNav("Dashboard")}>
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </Link>

      <SimpleTreeView
        slots={{
          collapseIcon: ExpandMoreIcon,
          expandIcon: ChevronRightIcon,
        }}
      >
        <TreeItem itemId="1" label="Products">
          <TreeItem
            itemId="2"
            label={
              <Link
                to="/admin/products"
                className="treeItemLink"
                onClick={() => handleNav("All Products")}
              >
                <PostAddIcon /> All
              </Link>
            }
          />

          <TreeItem
            itemId="3"
            label={
              <Link
                to="/admin/product"
                className="treeItemLink"
                onClick={() => handleNav("Create Product")}
              >
                <AddIcon /> Create
              </Link>
            }
          />
        </TreeItem>
      </SimpleTreeView>

      <Link to="/admin/orders" onClick={() => handleNav("Orders")}>
        <p>
          <ListAltIcon /> Orders
        </p>
      </Link>

      <Link to="/admin/users" onClick={() => handleNav("Users")}>
        <p>
          <PeopleIcon /> Users
        </p>
      </Link>

      <Link to="/admin/reviews" onClick={() => handleNav("Reviews")}>
        <p>
          <RateReviewIcon /> Reviews
        </p>
      </Link>
    </div>
  );
};

export default Sidebar;
