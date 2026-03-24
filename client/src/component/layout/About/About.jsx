import "./About.css";

import { Typography, Avatar } from "@mui/material";

import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

const About = () => {
  return (
    <section className="aboutSection">
      <div className="aboutSectionGradient"></div>

      <div className="aboutSectionContainer">
        <Typography variant="h4" className="aboutHeading">
          About Us
        </Typography>

        <div className="aboutContent">
          <div className="aboutLeft">
            <Avatar
              src="https://res.cloudinary.com/dqkj7zp9t/image/upload/v1773305289/jikson_di7mbv.jpg"
              alt="Founder"
              className="aboutAvatar"
            />

            <Typography className="aboutDescription">
              Hi, I'm <b>JIKSON MATHEW</b>. I am a MERN Stack developer who
              built this ecommerce project to demonstrate a full-stack web
              application using MongoDB, Express, React, and Node.js.
            </Typography>
          </div>

          <div className="aboutRight">
            <Typography variant="h6">Follow Me</Typography>

            <div className="aboutSocial">
              <a
                href="https://instagram.com/gxnmtw"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon className="instagramSvgIcon" />
              </a>

              <a
                href="https://facebook.com/gxnmtw"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon className="facebookSvgIcon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
