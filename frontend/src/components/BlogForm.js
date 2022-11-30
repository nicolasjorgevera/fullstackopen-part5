import React, { useState } from 'react'



const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState(0)

  const addNote = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    setNewLikes(0)
  }

  return (
    <form onSubmit={addNote}>
      <div>
            title
        <input
          id="title"
          type="text"
          value={newTitle}
          name="Title"
          onChange={({ target }) => setNewTitle(target.value)}
        />
      </div>
      <div>
            author
        <input
          id="author"
          type="text"
          value={newAuthor}
          name="Author"
          onChange={({ target }) => setNewAuthor (target.value)}
        />
      </div>
      <div>
            url
        <input
          id="url"
          type="text"
          value={newUrl}
          name="Url"
          onChange={({ target }) => setNewUrl(target.value)}
        />
      </div>
      <div>
            likes
        <input
          id="likes"
          type="number"
          value={newLikes}
          name="Likes"
          onChange={({ target }) => setNewLikes(target.value)}
        />
      </div>
      <button id="blogFormSubmit" type="submit">create</button>
    </form>
  )
}

export default BlogForm