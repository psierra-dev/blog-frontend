import {useState} from "react";

const BlogForm = ({createBlog}) => {
  const [dataBlog, setDataBlog] = useState({
    title: "",
    author: "",
    url: "",
  });

  const addBlog = (event) => {
    event.preventDefault();

    createBlog(dataBlog);
    setDataBlog({
      title: "",
      author: "",
      url: "",
    });
  };
  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <label>
          Title:{" "}
          <input
            type="text"
            data-testid="title"
            placeholder="write blog title here"
            value={dataBlog.title}
            onChange={({target}) => {
              setDataBlog({
                ...dataBlog,
                title: target.value,
              });
            }}
          />
        </label>
        <label>
          Author:{" "}
          <input
            type="text"
            data-testid="author"
            placeholder="Pedro"
            value={dataBlog.author}
            onChange={({target}) =>
              setDataBlog({
                ...dataBlog,
                author: target.value,
              })
            }
          />
        </label>
        <label>
          Url:{" "}
          <input
            type="text"
            data-testid="url"
            placeholder="http://blog.com"
            value={dataBlog.url}
            onChange={({target}) =>
              setDataBlog({
                ...dataBlog,
                url: target.value,
              })
            }
          />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
