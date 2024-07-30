import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import BlogForm from "./BlogForm";

test("renders content", async () => {
  const blog = {
    title: "Boca campeon",
    author: "Roman",
    likes: 0,
    url: "http://blog.com",
    user: {
      username: "psierra",
      name: "Pablo Sierra",
    },
  };

  render(<Blog blog={blog} />);

  const elementTitle = await screen.findByText("Boca campeon");
  const elementAuthor = await screen.findByText("Roman");
  const elementUrl = screen.queryByText("http://blog.com");
  const elementName = screen.queryByText("Pablo Sierra");
  expect(elementTitle).toBeDefined();
  expect(elementAuthor).toBeDefined();
  expect(elementUrl).toBeNull();
  expect(elementName).toBeNull();
});

test("show url and name when clicking on the visible button", async () => {
  const blog = {
    title: "Boca campeon",
    author: "Roman",
    likes: 3,
    url: "http://blog.com",
    user: {
      username: "psierra",
      name: "Pablo Sierra",
    },
  };

  //const mockHandler = vi.fn();

  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const elementUrl = await screen.findByText("http://blog.com");
  const elementLikes = await screen.findByText("likes 3");

  expect(elementUrl).toBeDefined();
  expect(elementLikes).toBeDefined();
});

test("double likes with double call to handleLikes props", async () => {
  const blog = {
    title: "Boca campeon",
    author: "Roman",
    likes: 3,
    url: "http://blog.com",
    user: {
      username: "psierra",
      name: "Pablo Sierra",
    },
  };

  const user = userEvent.setup();
  const updateLike = vi.fn();

  render(<Blog blog={blog} onUpdateLike={updateLike} />);

  const viewButton = screen.getByText("view");
  await user.click(viewButton);
  const likeButton = screen.getByText("Like");

  await user.click(likeButton);
  await user.click(likeButton);

  expect(updateLike.mock.calls).toHaveLength(2);
});

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();
  render(<BlogForm createBlog={createBlog} />);

  const input = screen.getByPlaceholderText("write blog title here");
  const sendButton = screen.getByText("Create");

  await user.type(input, "como centrar un div");
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  console.log(createBlog.mock.calls[0][0].title, "content");
  expect(createBlog.mock.calls[0][0].title).toBe("como centrar un div");
});
