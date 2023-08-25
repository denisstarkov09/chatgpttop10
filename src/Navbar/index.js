import React, { useState } from "react";
import { Layout, Button, Drawer } from "antd";
import LeftMenu from "./LeftMenu";
import { Link } from "react-router-dom";

import { MenuOutlined } from "@ant-design/icons";
import Brand from "../assets/logo.png";
// import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(!visible);
  };

  // If you do not want to auto-close the mobile drawer when a path is selected
  // Delete or comment out the code block below
  // From here
  // let { pathname: location } = useLocation();
  // useEffect(() => {
  //   setVisible(false);
  // }, [location]);
  // Upto here
  return (
    <nav className="navbar">
      <Layout>
        <Layout.Header className="nav-header bg-black">
          <Link to={"/main"}>
            <div className="logo logo-wrapper">
              <img src={Brand} alt="" />
              <h3 className="brand-font">ChatGPTTOP 10</h3>
            </div>
          </Link>
          <div className="navbar-menu">
            <div className="leftMenu">
              <LeftMenu mode={"horizontal"} />
            </div>
            <Button className="menuButton" type="text" onClick={showDrawer}>
              <MenuOutlined />
            </Button>
            <Drawer
              className="menu-drawer"
              placement="right"
              closable={true}
              onClose={showDrawer}
              open={visible}
              style={{ zIndex: 99999 }}>
              <LeftMenu mode={"inline"} />
            </Drawer>
          </div>
        </Layout.Header>
      </Layout>
    </nav>
  );
};

export default Navbar;
