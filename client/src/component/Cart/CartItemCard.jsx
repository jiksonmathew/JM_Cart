import "./CartItemCard.css";
import { Link } from "react-router-dom";

const CartItemCard = ({ item, deleteCartItems }) => {
  if (!item || !item.product) return null;

  return (
    <div className="CartItemCard">
      <img
        src={item.product?.images?.[0]?.url || "/placeholder.png"}
        alt={item.product?.name}
      />

      <div>
        <Link to={`/product/${item.product?._id}`}>{item.product?.name}</Link>

        <span>Price: ₹{item.product?.price}</span>

        <p onClick={() => deleteCartItems(item._id)}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;
