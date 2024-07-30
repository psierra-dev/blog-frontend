import {useState} from "react";

const Blog = ({blog, onUpdateLike, isOwn, onDeleteBlog}) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle} className="blog" data-testid="blog-item">
      <div>
        <p>{blog.title}</p>
        <p>{blog.author}</p>
      </div>
      <button onClick={() => setVisible(!visible)}>
        {!visible ? "view" : "hide"}
      </button>

      {visible && (
        <div>
          <a href={blog.url}>{blog.url}</a>
          <div>
            <p data-testid="blog-likes">likes {blog.likes}</p>
            <button onClick={onUpdateLike}>Like</button>
          </div>
          <p>{blog.user.name}</p>
          {isOwn && <button onClick={onDeleteBlog}>remove</button>}
        </div>
      )}
    </div>
  );
};

export default Blog;
