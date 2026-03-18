import "./CartItemCard.css";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

const CartItemCard = ({ item, deleteCartItems }) => {
  if (!item || !item.product) return null;

  const handleRemove = () => {
    deleteCartItems(item._id);
    toast.success("Item removed from cart");
  };

  return (
    <div className="CartItemCard">
      <img
        src={item.product?.images?.[0]?.url || "/placeholder.png"}
        alt={item.product?.name}
      />

      <div>
        <Link to={`/product/${item.product?._id}`}>{item.product?.name}</Link>

        <span>Price: ₹{item.product?.price?.toFixed(2)}</span>

        <p onClick={handleRemove}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;
