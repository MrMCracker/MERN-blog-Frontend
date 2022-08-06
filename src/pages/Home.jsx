import React, {useRef} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import axios from "../axios";

import {Post} from "../components/Post";
import {TagsBlock} from "../components/TagsBlock";
import {CommentsBlock} from "../components/CommentsBlock";
import {fetchPosts, fetchTags} from "../redux/slices/posts";
import {useDispatch, useSelector} from "react-redux";
import {useParams, Link} from "react-router-dom";

export const Home = () => {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.auth.data);
    const {posts, tags} = useSelector(state => state.posts);
    const isPostLoading = posts.status === "loading";
    const isTagsLoading = posts.status === "loading";
    const {id} = useParams();
    React.useEffect(() => {
        dispatch(fetchPosts())
        dispatch(fetchTags())
    }, []);
    console.log(posts)
    const [tabItem, setTabItem] = React.useState(0);
    const renderPosts = () => {
        if (isPostLoading) {
            return [...Array(5)].map((obj, index) => (<Post key={index} isLoading={true}/>))
        } else {
            if (id) {
                switch (tabItem) {
                    case 0: {
                        return (posts.items).filter(obj => {
                            for (let i in obj.tags) {
                                if (obj.tags[i] == id) {
                                    return obj;
                                }
                            }
                        }).reverse().map((obj, index) => (<Post
                                id={obj._id}
                                key={index}
                                title={`${obj.title}`}
                                imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ""}
                                user={obj.user}
                                createdAt={obj.createdAt}
                                viewsCount={obj.viewsCount}
                                commentsCount={obj.comments.length}
                                tags={obj.tags}
                                isEditable={userData?._id === obj.user._id}
                            />))
                        break;
                    }
                    case 1: {
                        return (posts.items).filter(obj => {
                            for (let i in obj.tags) {
                                if (obj.tags[i] == id) {
                                    return obj;
                                }
                            }
                        }).sort((a, b) => (a.viewsCount > b.viewsCount ? 1 : -1)).reverse().map((obj, index) => (<Post
                                id={obj._id}
                                title={`${obj.title}`}
                                imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ""}
                                user={obj.user}
                                createdAt={obj.createdAt}
                                viewsCount={obj.viewsCount}
                                commentsCount={obj.comments.length}
                                tags={obj.tags}
                                isEditable={userData?._id === obj.user._id}
                            />))
                        break;
                    }
                }
            } else {
                switch (tabItem) {
                    case 0: {
                        return (posts.items).slice().reverse().map((obj, index) => (<Post
                            id={obj._id}
                            key={index}
                            title={`${obj.title}`}
                            imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ""}
                            user={obj.user}
                            createdAt={obj.createdAt}
                            viewsCount={obj.viewsCount}
                            commentsCount={obj.comments.length}
                            tags={obj.tags}
                            isEditable={userData?._id === obj.user._id}
                        />))
                        break;
                    }
                    case 1: {
                        return (posts.items).slice().sort((a, b) => (a.viewsCount > b.viewsCount ? 1 : -1)).reverse()
                            .map((obj, index) => (<Post
                                id={obj._id}
                                title={`${obj.title}`}
                                imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}` : ""}
                                user={obj.user}
                                createdAt={obj.createdAt}
                                viewsCount={obj.viewsCount}
                                commentsCount={obj.comments.length}
                                tags={obj.tags}
                                isEditable={userData?._id === obj.user._id}
                            />))
                        break;
                    }
                }
            }
        }
    }

    const getCommentItems = (array) => {
        let newArr = []
        if (posts.status == "loaded") {
            for (let i of array) {
                // console.log(i.comments.length == 0)
                if (!(i.comments.length == 0)) {
                    newArr.push({
                        user: {
                            fullName: i.comments[0].user.fullName,
                            avatarUrl: '',
                        },
                        text: i.comments[0].text,
                    })
                }
                if (newArr.length >= 3) {
                    break
                }
            }
            return newArr
        }
        else {
            return [];
        }
    }
    // getCommentItems()
    const commentItems = getCommentItems(posts.items)
    return (<>
        <Tabs
            style={{marginBottom: 15}}
            value={tabItem}
            aria-label="basic tabs example"
        >
            <Tab label="Новые" onClick={() => {
                setTabItem(0)
            }}/>
            <Tab label="Популярные" onClick={() => {
                setTabItem(1)
            }}/>
        </Tabs>
        <Grid container spacing={4}>
            <Grid xs={8} item>
                {renderPosts()}
            </Grid>
            <Grid xs={4} item>
                <TagsBlock
                    items={tags.items}
                    isLoading={isTagsLoading}
                />
                <CommentsBlock
                    items={commentItems}
                    // items={[{
                    //     user: {
                    //         fullName: "Вася Пупкин", avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                    //     }, text: "Это тестовый комментарий",
                    // }, {
                    //     user: {
                    //         fullName: "Иван Иванов", avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                    //     },
                    //     text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
                    // },]}
                    isLoading={false}
                />
            </Grid>
        </Grid>
    </>);
};
