import React from "react";
import {useParams} from "react-router-dom";
import {Post} from "../components/Post";
import {Index} from "../components/AddComment";
import {CommentsBlock} from "../components/CommentsBlock";
import axios from "../axios.js"
import ReactMarkdown from "react-markdown"

export const FullPost = () => {
    const [data, setData] = React.useState();
    const [comments, setComments] = React.useState();
    const [isLoading, setLoading] = React.useState(true);
    const {id} = useParams();
    React.useEffect(() => {
        axios.get(`/posts/${id}`).then(res => {
            setData(res.data);
            setComments(res.data.comments)
            setLoading(false);
        }).catch((err) => {
            console.log(err)
            alert("Ошибка при плучении статьи")
        });
    }, [])

    if (isLoading) {
        return <Post isLoading={isLoading} isFullPost/>
    }

    const getCommentItems = (array) => {
        let newArr = []
        for (let i of array) {
            newArr.push({
                user: {
                    fullName: i.user.fullName,
                    avatarUrl: '',
                },
                text: i.text,
            })
        }
        return newArr
    }
    const commentItems = getCommentItems(comments)
    return (
        <>
            <Post
                id={data.id}
                title={data.title}
                imageUrl={data.imageUrl ? `${process.env.REACT_APP_API_URL}${data.imageUrl}` : ""}
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={comments.length}
                tags={data.tags}
                isFullPost
            >
                <p>
                    <ReactMarkdown children={data.text}/>
                </p>
            </Post>
            <CommentsBlock
                items={commentItems}
                // items={[
                //   {
                //     user: {
                //       fullName: "Вася Пупкин",
                //       avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                //     },
                //     text: "Это тестовый комментарий 555555",
                //   },
                //   {
                //     user: {
                //       fullName: "Иван Иванов",
                //       avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                //     },
                //     text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
                //   },
                // ]}
                isLoading={isLoading}
            >
                <Index data={data} setComments={setComments} comments={comments}/>
            </CommentsBlock>
        </>
    );
};
