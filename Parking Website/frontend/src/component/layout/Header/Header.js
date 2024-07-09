import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoIosSearch } from "react-icons/io"; 
import { CiShoppingCart } from "react-icons/ci";
import { ReactNavbar } from "overlay-navbar";
import "./Header.css"
const Header = () => {
  return (
    <>
      
        <ReactNavbar 
          logo="https://www.lunapic.com/editor/premade/transparent.gif"
          burgerColor="black"
          navColor1="#2b6c87"
          burgerColorHover="#481E14"
          logoWidth="50%"
          logoHoverColor="crimson"
          link1Size="1.2rem"
          link1Color="#d9f3ed"
          link1Padding="1vmax"
          link1ColorHover="crimson"
          nav2justifyContent="flex-end"
          link1Margin="1vmax"
          link2Margin="0"
          link3Margin="0"
          link4Margin="1vmax"
          link1Url="/"
          link2Url="/parkings"
          link3Url="/aboutus"
          link4Url="/contact"
          nav3justifyContent="flex-start"
          link1Text="Home"
          link1Family="sans-serif"
          link2Text="Parkings"
          link3Text="About Us"
          link4Text="Contact Us"
          nav4justifyContent="flex-start"
          searchIconMargin="0.5vmax"
          cartIconMargin="1vmax"
          profileIconMargin="0.5vmax"
          searchIconColor="#d9f3ed"
          cartIconColor="#d9f3ed"
          profileIconColor="#d9f3ed"
          searchIconColorHover="crimson"
          cartIconColorHover="crimson"
          profileIconColorHover="crimson"
          searchIcon={true}
          searchIconUrl="/search"
          profileIconUrl="/login"
          SearchIconElement={IoIosSearch}
          profileIcon={true}
          ProfileIconElement={CgProfile}
          
          CartIconElement={CiShoppingCart}
          profileIconSize="2vmax"
          burgerMargin="0.5vmax" // Adjust the margin between hamburger lines
        />
      
    </>
  );
};

export default Header;
