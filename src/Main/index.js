import React, { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { Divider } from "antd";
import { Button, Input, Radio } from "antd";
import { Select } from "antd";
import { Col, Row, Space } from "antd";
import { notification } from "antd";
import { List, message } from "antd";
import slug from "slug";
import { Helmet } from "react-helmet";

import categories from "../const/categories.json";
import apis from "../const/apis.json";

const tb_margin = {
  margin: "10px 0",
};
const t_margin = {
  margin: "30px 0",
};
const Main = () => {
  const [inputPrompt, setInputPrompt] = useState("");
  const [selectCate, setSelectCate] = useState("");
  const [isFormDisable, setFormDisable] = useState(false);
  const [content, setContent] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isGenerateDisable, setGenerateDisable] = useState(true);
  const [isDisable, setDisable] = useState(true);
  const [isSaveLoading, setSaveLoading] = useState(false);
  const [gtype, setGtype] = useState(true);

  const onChange = (e) => {
    setInputPrompt(e.target.value);
    if (selectCate) {
      setGenerateDisable(false);
    }
  };
  const options = categories;
  const handleChange = (value) => {
    setSelectCate(value);
    if (inputPrompt) {
      setGenerateDisable(false);
    }
  };

  const onGeterate = async () => {
    setLoading(true);
    setFormDisable(true);
    try {
      let index = -1;
      categories.find((item, i) => {
        if (item.value === selectCate) {
          index = i;
          return i;
        }
      });

      // setFormDisable(true);
      notification.open({
        message: "Hold tight!",
        duration: 15,
        description: "I'm cooking up something amazing just for you!",
      });
      if (selectCate === categories[categories.length - 1].value) {
        fetch("https://api.chatgpttop10.com/generateImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `Please generate realated to ${inputPrompt} and ${categories[index].prompt}.`,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            // console.log(data.data[0].url);
            setContent(data.data[0].url);
            showImage();
          });
      } else {
        const response = await fetch("https://api.chatgpttop10.com/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `Create 10 valuable content related to ${inputPrompt}, but each content are for ${selectCate} and must use a comma instead a full stop and generate 2 or 3 sentences and each content is that ${categories[index].prompt}. The full format is an array like [ "First Content", "Second Content" ... "Tenth Content" ].`,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setDisable(false);
          setGenerateDisable(true);
          setContent(JSON.parse(data.content));
          message.success("Success!");
        }
      }
    } catch (error) {
      console.log('generate contents', error)
    }
    setLoading(false);
  };
  const showImage = () => {
    setGtype(false);
    setLoading(false);
    setDisable(false);
    setGenerateDisable(true);
    message.success("Success!");
  };

  const [value, setValue] = useState(0);
  const onRadioChange = (e) => {
    setValue(e.target.value);
  };

  const onSave = async (e) => {
    try {
      const cate_slug = slug(selectCate);
      // console.log(content[value]);
      const keyword = inputPrompt;
      const saveContent = gtype ? content[value] : content;
      // console.log(saveContent)
      setSaveLoading(true);
      const response = await fetch(
        "https://api.chatgpttop10.com/insertArticle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: saveContent,
            cate: selectCate,
            keyword,
            cate_slug,
          }),
        }
      );
      if (response.ok) {
        // window.location.reload();
        setInputPrompt("");
        setSelectCate("");
        setFormDisable(false);
        setContent([]);
        setLoading(false);
        setGenerateDisable(true);
        setDisable(true);
        setGtype(true);
      } else {
        notification.open({
          message: "Note",
          duration: 1000,
          description: "Interal Server Error",
        });
      }
    } catch (error) {
      console.log("insert article", error);
    }
    setSaveLoading(false);
  };

  return (
    <Row>
      <Helmet>
        <title>Best AI Writing Tools Online | ChatGPT TOP 10</title>
        <meta name="description" content="Discover the best AI writing tools online, including ChatGPT, for powerful and efficient content creation. Boost your writing process with blog ideas generator tool Ai." />
        <link rel="canonical" href={`https://chatgpttop10.com/main/`} />
      </Helmet>
      <Col className="gutter-row" xs={20} sm={20} md={16} lg={16} offset={2}>
        <Space direction="vertical" style={{ display: "flex" }}>
          Enter Any Keyword to Generate Ideas
          <Input
            style={tb_margin}
            size="large"
            maxLength={100}
            disabled={isFormDisable}
            allowClear
            onChange={onChange}
            value={inputPrompt}
          />
          Choose From Any Category Below
          <Select
            showSearch
            allowClear
            style={{
              width: "100%",
              margin: "10px 0",
            }}
            size="large"
            placeholder="Select Your Favorite"
            onChange={handleChange}
            disabled={isFormDisable}
            options={options}
            value={selectCate}
          />
          <Space
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "3rem",
            }}>
            <Button
              type="default"
              danger
              size="large"
              loading={isLoading}
              disabled={isGenerateDisable}
              className="green-button"
              onClick={onGeterate}>
              Idea Generation Button!
            </Button>
          </Space>
        </Space>
        <Divider style={{ margin: "20px 0" }} />
        {gtype ? (
          <>
            Select Your Favorite
            <Space direction="vertical" style={{ display: "block" }}>
              <Radio.Group
                style={{ display: "block" }}
                onChange={onRadioChange}
                value={value}>
                <List
                  style={t_margin}
                  width={100}
                  size="large"
                  bordered
                  itemLayout="horizontal"
                  dataSource={content}
                  // locale={emptyVal}
                  description="sdsd"
                  renderItem={(item, index) =>
                    item && (
                      <List.Item>
                        <List.Item.Meta
                          description={<Radio value={index}>{item}</Radio>}
                        />
                      </List.Item>
                    )
                  }
                />
              </Radio.Group>
            </Space>
            <Space
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "3rem",
              }}>
              <Button
                type="default"
                danger
                size="large"
                disabled={isDisable}
                loading={isSaveLoading}
                className="green-button"
                onClick={onSave}>
                Choose One Favorite Idea
              </Button>
            </Space>
          </>
        ) : (
          <>
            <Space
              direction="vertical"
              style={{ display: "flex", textAlign: "center" }}>
              <img src={content} alt="" />
            </Space>
            <Space
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "3rem",
              }}>
              <Button
                type="default"
                danger
                size="large"
                disabled={isDisable}
                loading={isSaveLoading}
                className="green-button"
                onClick={onSave}>
                Save Image
              </Button>
            </Space>
          </>
        )}
      </Col>
      <Col
        className="gutter-row api-panel"
        xs={22}
        sm={22}
        md={4}
        lg={4}
        offset={1}>
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          {ReactHtmlParser(apis[2])}
        </div>
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          {ReactHtmlParser(apis[3])}
        </div>
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          {ReactHtmlParser(apis[4])}
        </div>
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          {ReactHtmlParser(apis[5])}
        </div>
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          {ReactHtmlParser(apis[6])}
        </div>
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          {ReactHtmlParser(apis[0])}
        </div>
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          {ReactHtmlParser(apis[1])}
        </div>
      </Col>
    </Row>
  );
};

export default Main;
