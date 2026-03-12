import { useState } from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";

import PinDropIcon from "@mui/icons-material/PinDrop";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PublicIcon from "@mui/icons-material/Public";
import PhoneIcon from "@mui/icons-material/Phone";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";

import toast from "react-hot-toast";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo?.address || "");
  const [city, setCity] = useState(shippingInfo?.city || "");
  const [stateValue, setStateValue] = useState(shippingInfo?.state || "");
  const [country, setCountry] = useState(shippingInfo?.country || "");
  const [pinCode, setPinCode] = useState(shippingInfo?.pinCode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(phoneNo)) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    dispatch(
      saveShippingInfo({
        address,
        city,
        state: stateValue,
        country,
        pinCode,
        phoneNo,
      }),
    );

    navigate("/order/confirm");
  };

  return (
    <div className="shippingContainer">
      <div className="shippingBox">
        <h2 className="shippingHeading">Shipping Details</h2>

        <form className="shippingForm" onSubmit={handleSubmit}>
          <div className="shippingField">
            <HomeIcon />
            <input
              type="text"
              placeholder="Address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="shippingField">
            <LocationCityIcon />
            <input
              type="text"
              placeholder="City"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="shippingField">
            <PinDropIcon />
            <input
              type="text"
              placeholder="Pin Code"
              value={pinCode}
              required
              onChange={(e) => setPinCode(e.target.value)}
            />
          </div>

          <div className="shippingField">
            <PhoneIcon />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNo}
              required
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </div>

          <div className="shippingField">
            <PublicIcon />
            <select
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Select Country</option>

              {Country.getAllCountries().map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {country && (
            <div className="shippingField">
              <TransferWithinAStationIcon />

              <select
                value={stateValue}
                required
                onChange={(e) => setStateValue(e.target.value)}
              >
                <option value="">Select State</option>

                {State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button className="shippingBtn" type="submit" disabled={!stateValue}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
