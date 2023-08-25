import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "antd";
import { FireFilled, CrownOutlined, TagOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Pagination } from 'antd';

import slug from "slug";

import categories from "../const/categories.json";

const LeftMenu = ({ mode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const menuLocation = []
  const location = useLocation()
  menuLocation.push(location.pathname)

  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  return (
    <Menu theme="dark" mode={mode} defaultSelectedKeys={['/main']} selectedKeys={menuLocation}>
      <Menu.Item key="/main" path="/main">
        <Link to={"/main"}>
          <FireFilled style={{ color: "#fb2a2af7", fontSize: "1.2rem", marginRight:"5px" }} />
          Inspiration Generator
        </Link>
      </Menu.Item>
      <Menu.Item key="/top">
        <Link to={"/top"}>
          <CrownOutlined style={{marginRight:"5px"}}/>
          Top Ideas
        </Link>
      </Menu.Item>
      <Menu.SubMenu
        key="/article"
        title={
          <>
            <TagOutlined style={{marginRight:"5px"}}/>Categories
          </>
        }
        >
        <Pagination
          size="small"
          current={currentPage}
          total={categories.length}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
          style={{padding:"20px", width:"270px"}}
        />
        {currentItems.map((item) => (
          <Menu.Item
            key={"/article/" + slug(item.value)}
            >
              <Link to={"/article/" + slug(item.value)}>
                {item.value}
              </Link>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.Item>
        <Link to="#"
          onClick={(e) => {
            window.location.href = "mailto:hello@chatgpttop10.com";
          }}
        >
          <MailOutlined style={{marginRight:"5px"}}/>
          Contact
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default LeftMenu;
