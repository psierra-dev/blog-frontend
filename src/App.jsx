import {useState, useEffect} from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/auth.js";
import Notification from "./components/Notification.jsx";
import Togglable from "./components/Togglable.jsx";
import BlogForm from "./components/BlogForm.jsx";
import LoginForm from "./components/LoginForm.jsx";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const blogsSorted = blogs.sort((a, b) => b.likes - a.likes);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const {data: user} = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleCreateBlog = async (newBlog) => {
    try {
      const blog = await blogService.create(newBlog);

      setBlogs([
        ...blogs,
        {
          ...blog,
          user: {
            name: user.name,
            username: user.username,
          },
        },
      ]);
      setSuccessMessage(`a new blog ${blog.title} by ${blog.author} added`);
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (error) {
      console.log(error.response.data.error, "error");
      setErrorMessage(error.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleUpdateBlog = async (blog) => {
    try {
      await blogService.update(blog.id, {...blog, likes: blog.likes + 1});

      const newBlogs = blogs.map((b) => {
        if (b.id === blog.id) {
          return {
            ...b,
            likes: b.likes + 1,
          };
        }

        return b;
      });
      setBlogs(newBlogs);
    } catch (error) {
      console.log(error, "errorUpdate");
    }
  };

  const handleDeleteBlog = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) return;
    try {
      await blogService.remove(blog.id);
      const newBlogs = blogs.filter((b) => b.id !== blog.id);
      setBlogs(newBlogs);
    } catch (error) {
      console.log(error, "error-delete");
    }
  };
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    window.location.reload();
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      console.log(blogs, "blogs");
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <Notification message={errorMessage} type="error" />}
        <LoginForm
          username={username}
          password={password}
          handleSubmit={handleLogin}
          handlePasswordChange={(e) => setPassword(e.target.value)}
          handleUsernameChange={(e) => setUsername(e.target.value)}
        />
      </div>
    );
  }

  console.log(blogs, "blogs");
  return (
    <div>
      <h1>blogs</h1>
      {successMessage && (
        <Notification message={successMessage} type="success" />
      )}
      {errorMessage && <Notification message={errorMessage} type="error" />}
      <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <Togglable buttonLabel="new blog">
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
      <div>
        {blogsSorted?.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            isOwn={user.username === blog.user.username}
            onUpdateLike={() => handleUpdateBlog(blog)}
            onDeleteBlog={() => handleDeleteBlog(blog)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
