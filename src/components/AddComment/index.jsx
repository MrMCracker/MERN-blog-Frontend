import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from "../../axios";
import {useParams} from "react-router-dom";

export const Index = ({ data, setComments, comments }) => {
    const [text, setText] = React.useState("");
    const {id} = useParams()
    const onSubmit = async () => {
        if (text.length <= 1) {
            return alert("Комментарий должен быть длинее 1 символа")
        }
        const data = await axios.patch(`/comments/${id}`, {comment: {text: text}, })
        setComments(data.data.comments)
        setText("")
    }
    return (
        <>
            <div className={styles.root}>
                <Avatar
                    classes={{root: styles.avatar}}
                    src=""
                />
                <div className={styles.form}>
                    <TextField
                        value={text}
                        onChange={e => {
                            setText(e.target.value)
                        }}
                        label="Написать комментарий"
                        variant="outlined"
                        maxRows={10}
                        multiline
                        fullWidth
                    />
                    <Button onClick={onSubmit} variant="contained">Отправить</Button>
                </div>
            </div>
        </>
    );
};
