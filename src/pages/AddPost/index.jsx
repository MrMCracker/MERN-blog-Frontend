import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";
import axios from "../../axios.js"

export const AddPost = () => {
  const {id} = useParams();
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');

  const isEditing = Boolean(id);

  const inputFileRef = React.useRef();

  const handleChangeFile = async (event) => {
      try {
        const formData = new FormData();
        const file = event.target.files[0];
        formData.append('image', file);
        const { data } = await axios.post("/upload", formData);
        setImageUrl(data.url);
      } catch (e) {
        console.log(e);
        alert("Ошибка при загрузке файла!");
      }
  };

  const onClickRemoveImage = () => {
      setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
      try {
          setLoading(true);
          const fields = {
              title,
              imageUrl,
              tags,
              text,
          }
          const { data } = isEditing
              ? await axios.patch(`/posts/${id}`, fields)
              : await axios.post('/posts', fields);
          const _id = isEditing ? id : data._id;
          navigate(`/posts/${_id}`);
      } catch (e) {
          console.log(e);
          alert("Не удалось создать статью!");
      }
  }

  React.useEffect(() => {
    if (id) {
        axios.get(`/posts/${id}`).then(({data}) => {
            setTitle(data.title);
            setTags(data.tags.join(","));
            setImageUrl(data.imageUrl);
            setText(data.text);
        }).catch((e) => {
            console.log(e)
        })
    }
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to='/'/>
  }


  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => {inputFileRef.current.click()}} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4000${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        value={title}
        onChange={(e) => {setTitle(e.target.value)}}
        placeholder="Заголовок статьи..."
        fullWidth
      />
      <TextField
          classes={{ root: styles.tags }}
          variant="standard"
          value={tags}
          onChange={(e) => {setTags(e.target.value)}}
          placeholder="Тэги"
          fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
            {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
