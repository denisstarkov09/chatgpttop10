import React, { useState, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import { useLocation } from "react-router-dom";
import { Tag, Card, Skeleton, Badge, Modal, Button, Image, Empty } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";
import { Helmet } from "react-helmet";

import placeImg from "../assets/download.png";

import apis from "../const/apis.json";
import categories from "../const/categories.json";
import metadata from "../const/metadata.json";


const { Meta } = Card;

const Top = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalCate, setModalCate] = useState("");
  const [modalKeyword, setModalKeyword] = useState("");
  const [upvotedIds, setUpvotedIds] = useState([]);
  const [downvotedIds, setDownvotedIds] = useState([]);
  
  const location = useLocation();
  
  const temp = location.pathname.split("/");
  const arrayslug = { ...temp };
  const slug = arrayslug[2];
  const meta = metadata[slug]

  useEffect(() => {
    const getArticles = async () => {
      try {
        const response = await fetch("https://api.chatgpttop10.com/article", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
          }),
        });

        const data = await response.json();
        if (data) {
          setArticles(data.articles);
          setLoading(false);
          // console.log(articles);
        }
      } catch (error) { }
    };

    const uids = localStorage.getItem("article_upvote_ids");
    uids && setUpvotedIds(JSON.parse(uids).ids);
    const dids = localStorage.getItem("article_downvote_ids");
    dids && setDownvotedIds(JSON.parse(dids).ids);

    getArticles();
  }, [slug]);

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

  const updateVote = async (id, count, flag) => {
    try {
      await fetch("https://api.chatgpttop10.com/updateVote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          count,
          flag,
        }),
      });
    } catch (error) {
      console.log("update vote", error);
    }
  };

  const upvote = (id, count, index) => {
    updateVote(id, count, true);

    downvotedIds.indexOf(id) !== -1 &&
      downvotedIds.splice(downvotedIds.indexOf(id), 1);
    upvotedIds.indexOf(id) === -1 && upvotedIds.push(id);
    localStorage.setItem(
      "article_upvote_ids",
      JSON.stringify({ ids: upvotedIds })
    );
    localStorage.setItem(
      "article_downvote_ids",
      JSON.stringify({ ids: downvotedIds })
    );
    const newArticles = [...articles];
    newArticles[index] = {
      ...newArticles[index],
      vote: count + 1,
    };
    setArticles(newArticles);
  };
  const devote = (id, count, index) => {
    updateVote(id, count, false);

    upvotedIds.indexOf(id) !== -1 &&
      upvotedIds.splice(upvotedIds.indexOf(id), 1);
    downvotedIds.indexOf(id) === -1 && downvotedIds.push(id);
    localStorage.setItem(
      "article_upvote_ids",
      JSON.stringify({ ids: upvotedIds })
    );
    localStorage.setItem(
      "article_downvote_ids",
      JSON.stringify({ ids: downvotedIds })
    );
    const newArticles = [...articles];
    newArticles[index] = {
      ...newArticles[index],
      vote: count - 1,
    };
    setArticles(newArticles);
  };
  const upvoteComponent = (count, id, index) => {
    const ids = localStorage.getItem("article_upvote_ids")
      ? JSON.parse(localStorage.getItem("article_upvote_ids")).ids
      : null;
    return (
      <>
        <Button
          disabled={ids && ids.indexOf(id) !== -1}
          loading={loading}
          onClick={() => upvote(id, count, index)}
          shape="circle"
          icon={<LikeOutlined />}
        />
      </>
    );
  };
  const devoteComponent = (count, id, index) => {
    const ids = localStorage.getItem("article_downvote_ids")
      ? JSON.parse(localStorage.getItem("article_downvote_ids")).ids
      : null;
    return (
      <>
        <Button
          disabled={ids && ids.indexOf(id) !== -1}
          loading={loading}
          onClick={() => devote(id, count, index)}
          shape="circle"
          icon={<DislikeOutlined />}
        />
      </>
    );
  };
  const voteComponent = (count) => {
    return <Badge count={count} showZero style={{ backgroundColor: "#444" }} />;
  };

  const keywordComponent = () => {
    return (
      <span>
        <Tag color="blue">{modalKeyword}</Tag>
      </span>
    );
  };
  const imageComponent = (content) => {
    return (
      <>
        <Image width={200} height={200} src={content} fallback={placeImg} />
      </>
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
  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={`https://chatgpttop10.com/article/${slug}/`} />
      </Helmet>
      <Modal
        title={modalCate}
        open={isModalOpen}
        footer={keywordComponent()}
        width={800}
        onCancel={handleCancel}>
        <div
          style={{ margin: "0 3rem" }}
          dangerouslySetInnerHTML={createMarkup(modalContent)}
        />
      </Modal>
      <Row>
        <Col xs={20} sm={20} md={16} lg={16} offset={2}>
          <Row>
            {articles.length !== 0
              ? articles.map((article, index) => (
                <Col
                  className="badge-card"
                  key={index}
                  xs={22}
                  sm={22}
                  md={7}
                  lg={7}
                  offset={1}>
                  <Badge.Ribbon
                    text={
                      article.keyword.length > 25
                        ? article.keyword.slice(0, 25) + "..."
                        : article.keyword
                    }
                    color="volcano">
                    <Card
                      style={{ margin: "10px 0", cursor: "pointer" }}
                      actions={[
                        upvoteComponent(article.vote, article.id, index),
                        voteComponent(article.vote),
                        devoteComponent(article.vote, article.id, index),
                      ]}>
                      <Skeleton loading={loading} avatar active>
                        {article.cate ===
                          categories[categories.length - 1].value ? (
                          <Meta
                            className="meta-content image-content"
                            description={imageComponent(article.content)}
                          />
                        ) : (
                          <Meta
                            className="meta-content"
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
                        <span className="date-card dir-right">
                          {article.createdAt}
                        </span>
                      </Skeleton>
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
    </>
  );
};

export default Top;
