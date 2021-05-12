import React, { useState, useEffect, Fragment } from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress
} from '@material-ui/core';
import {
  Comment,
} from '@material-ui/icons';

export default function NewsCard(props) {
  const [show, setShow] = useState(true);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTopStories();
  }, []);

  async function getTopStories() {
    setIsLoading(true);
    const url = " https://hacker-news.firebaseio.com/v0/topstories.json";
    try {
      const response = await fetch(url);
      if (response.ok === false) {
        throw new Error("Error:" + response.text);
      }
      const topStories = await response.json();
      const storyDetailPromises = topStories
        .slice(0, 10)
        .map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
            response => response.json()
          )
        );
      const posts = await Promise.all(storyDetailPromises);

      let commentDetailPromises = []
      posts
        .forEach((post) => {
          post?.kids?.slice(0, 20)?.forEach((commentId) => {
            commentDetailPromises.push(
              fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`).then(
                response => response.json()
              )
            )
          })
        })

      const comments = await Promise.all(commentDetailPromises);
      setComments(comments);
      setPosts(posts);
    } catch (err) {
      alert("Error Occured, Please try again!");
      console.log(err)
    }
    finally {
      setIsLoading(false);
    }
  }

  const renderCard = (card, index) => {
    return (
      <Card
        className="card" key={index}
      >
        <CardActionArea onClick={() => {
          window.open(card.url, "_blank")
        }} className="card_detail">
          <CardMedia className="media" image={"./Images/vaccine.jpeg"} title={card.title} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {card.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {card.url}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <IconButton aria-label="add comment" onClick={() => setShow(!show)}>
            <Comment />
          </IconButton>
        </CardActions>

        {show ? (
          <List className="list">
            {
              card?.kids?.map((commentId, index) => {
                const commentDetails = comments?.find(ele => ele?.id === commentId);
                if (commentDetails && Object.keys(commentDetails).length > 0)
                  return (
                    <Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar alt="Remy Sharp" src="" />
                        </ListItemAvatar>
                        <ListItemText
                          primary={commentDetails?.by}
                          secondary={
                            <div dangerouslySetInnerHTML={{__html: commentDetails?.text}}>
                              
                            </div>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </Fragment>
                  )
                else return null
              })
            }
          </List>
        ) : null}
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-align-center mt-2">
        <CircularProgress />
      </div>
    )
  }

  return <div>{posts.map(renderCard)}</div>;
}
