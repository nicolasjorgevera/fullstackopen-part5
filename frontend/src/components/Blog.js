import React, { useState } from 'react'

const Blog = ({ blog , updateBlog, user , deleteBlog }) => {
  const [fullView, setFullView] = useState (false)

  const blogStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const changeView = () => { setFullView (!fullView) }

  const fullShow = () => (
    <div style={blogStyle} className="fullShow">
    Title: {blog.title} Author: {blog.author} <button onClick={changeView}>hide</button>
      <br></br>
    URL: {blog.url}<br></br>
    Likes: {blog.likes} <button id="likeButton" onClick={() => updateBlog(blog)}>like</button><br></br>
      {user
        ? user.username === blog.user.username
          ? <button id="removeButton" onClick={() => deleteBlog(blog)}>remove</button>
          : null
        : null
      }
    </div>
  )

  const partialShow = () => (
    <div style={blogStyle} className="partialShow">
    Title: {blog.title} Author: {blog.author} <button id="showButton" onClick={changeView}>show</button>
      <br></br>
    </div>
  )
  return (
    <div>
      { fullView === true
        ?
        fullShow()
        :
        partialShow()
      }
    </div>
  )
}

export default Blog