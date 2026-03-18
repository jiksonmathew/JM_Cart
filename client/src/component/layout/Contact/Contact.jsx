import "./Contact.css";

import { Button, Typography } from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const Contact = () => {
  const email = "jiksonmathew14@gmail.com";
  const phone = "+919526121657";

  return (
    <section className="contactContainer">
      <div className="contactGradient"></div>

      <div className="contactCard">
        <Typography variant="h4" className="contactTitle">
          Contact Us
        </Typography>

        <Typography className="contactText">
          If you have any questions or project inquiries, feel free to contact
          me.
        </Typography>

        <a href={`mailto:${email}`} className="contactLink">
          <Button variant="contained" startIcon={<EmailIcon />}>
            Send Email
          </Button>
        </a>

        <Typography className="contactEmail">{email}</Typography>

        <a href={`tel:${phone}`} className="contactLink">
          <Button variant="outlined" startIcon={<PhoneIcon />}>
            Call Us
          </Button>
        </a>

        <Typography className="contactPhone">{phone}</Typography>
      </div>
    </section>
  );
};

export default Contact;
