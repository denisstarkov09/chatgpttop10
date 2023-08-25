import React, { useState, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import {
  Tag,
  Card,
  Badge,
  Modal,
  Image,
  Row,
  Alert,
  Empty,
  Col,
} from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";

import cateories from "../const/categories.json";
import apis from "../const/apis.json";

import placeImg from "../assets/download.png";

const { Meta } = Card;

const Top = () => {
  const [articles, setArticles] = useState([]);
  const slug = "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalCate, setModalCate] = useState("");
  const [modalKeyword, setModalKeyword] = useState("");

  useEffect(() => {
    try {
      fetch("https://api.chatgpttop10.com/topArticle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
        .then((res) => res.json())
        .then((data) => {
          setArticles(data.articles);
          // console.log(data.articles);
        })
        .catch();
    } catch (error) {
      console.log('top article', error)
    }
  }, [slug]);

  const voteComponent = (title) => {
    return (
      <Tag color="magenta">
        <HeartOutlined /> {title}
      </Tag>
    );
  };
  const keywordComponent = () => {
    return (
      <span>
        <Tag color="blue">{modalKeyword}</Tag>
      </span>
    );
  };

  const cateComponent = (cate) => {
    return (
      <span>
        <Alert
          message={cate}
          type="success"
          style={{ padding: "2px 2px", textAlign: "center" }}
        />
      </span>
    );
  };
  const emptyComponent = () => {
    return (
      <>
        <Empty
          description="No Ideas Posted Yet!"
          style={{
            width: "100%",
            padding: "100px 0",
            backgroundColor: "white",
          }}
        />
      </>
    );
  };
  const imageComponent = (content) => {
    return (
      <>
        <Image width={200} height={200} src={content} fallback={placeImg} />
      </>
    );
  };
  const showModal = (content, cate, keyword) => {
    content += `<br>`;
    content += `<br>`;
    content += apis[Math.floor(Math.random() * apis.length)];
    setIsModalOpen(true);
    setModalContent(content);
    setModalCate(cate);
    setModalKeyword(keyword);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function createMarkup(content) {
    let temp = "";
    temp = content.replaceAll("\n", "<br>");
    return { __html: temp };
  }

  return (
    <>
      <Helmet>
        <title>AI Top Ideas Generator tool | ChatGPT TOP 10</title>
        <meta name="description" content="Unleash your creativity with ChatGPT TOP 10 AI Top Ideas Generator tool. Discover the top innovative and inspiring ideas for your next project, venture, or adventure." />
        <link rel="canonical" href={`https://chatgpttop10.com/top/`} />
      </Helmet>
      <Row>
        <Col xs={20} sm={20} md={16} lg={16} offset={2}>
          <Modal
            title={modalCate}
            open={isModalOpen}
            footer={keywordComponent()}
            width={800}
            onCancel={handleCancel}
          >
            <div
              style={{ margin: "0 3rem" }}
              dangerouslySetInnerHTML={createMarkup(modalContent)}
            />
          </Modal>
          <Row>
            {articles.length !== 0
              ? articles.map((article, index) => (
                <Col key={index} xs={22} sm={22} md={7} lg={7} offset={1}>
                  <Badge.Ribbon
                    text={
                      article.keyword.length > 25
                        ? article.keyword.slice(0, 25) + "..."
                        : article.keyword
                    }
                    color="volcano">
                    <Card style={{ margin: "10px 0", cursor: "pointer" }}>
                      {article.cate ===
                        cateories[cateories.length - 1].value ? (
                        <Meta
                          className="meta-content image-content"
                          description={imageComponent(article.content)}
                        />
                      ) : (
                        <Meta
                          className="meta-content"
                          title={cateComponent(article.cate)}
                          description={article.content}
                          onClick={() =>
                            showModal(
                              article.content,
                              article.cate,
                              article.keyword
                            )
                          }
                        />
                      )}
                      <span className="date-card dir-left">
                        {voteComponent(article.vote)}
                      </span>
                      <span className="date-card dir-right">
                        {article.createdAt}
                      </span>
                    </Card>
                  </Badge.Ribbon>
                </Col>
              ))
              : emptyComponent()}
          </Row>
        </Col>
        <Col
          className="gutter-row api-panel"
          xs={22}
          sm={22}
          md={4}
          lg={4}
          offset={1}
        >
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
    </>
  );
};

export default Top;
