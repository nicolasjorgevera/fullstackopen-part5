import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginServices from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successful, setSuccessful] = useState (true)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll()
      .then(blogs => {
        setBlogsToShow( blogs )
      }
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const setBlogsToShow = (blogs) => {
    blogs.sort( function (a, b) {
      return (b.likes - a.likes)
    })
    setBlogs(blogs )
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginServices.login({
        username, password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
      setSuccessful(true)
      setErrorMessage('successful login')
      setTimeout(() => { setErrorMessage(null) }, 5000)
    } catch (exception) {
      setSuccessful(false)
      setErrorMessage(`ERROR: ${exception.response.data.error}`)
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
    setSuccessful(true)
    setErrorMessage('successful logout')
    setTimeout(() => { setErrorMessage(null) }, 5000)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      setBlogsToShow(blogs.concat(returnedBlog))
      setSuccessful(true)
      setErrorMessage(`A new blog ${blogObject.newTitle} by ${blogObject.newAuthor} added`)
      setTimeout(() => { setErrorMessage(null) }, 5000)
    } catch(error) {
      setSuccessful(false)
      setErrorMessage(`ERROR: ${error.response.data.error}`)
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  const updateBlog = async (blogObject) => {
    const newLikes = blogObject.likes + 1
    const updatedBlog = { ...blogObject, likes: newLikes }
    try {
      await blogService.update(updatedBlog)
      const newBlogs = blogs.map (blog => {
        if (blog.id === blogObject.id) {
          return { ...blog, likes: newLikes }
        }
        return blog
      })
      setBlogsToShow(newBlogs)
    } catch (error) {
      setSuccessful(false)
      setErrorMessage(`ERROR: ${error.response.data.error}`)
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  const deleteBlog = async (blogObject) => {
    console.log('ESTE ES EL BLOG:', blogObject)
    if (window.confirm(`remove ${blogObject.title} by ${blogObject.author}?`)) {
      try {
        await blogService.remove(blogObject)
        const newBlogs = blogs.filter (blog => blog.id !== blogObject.id)
        setBlogsToShow(newBlogs)
        setSuccessful(true)
        setErrorMessage(`The blog ${blogObject.title} by ${blogObject.author} deleted`)
        setTimeout(() => { setErrorMessage(null) }, 5000)
      } catch (error) {
        setSuccessful(false)
        setErrorMessage(`ERROR: ${error.response.data.error}`)
        setTimeout(() => { setErrorMessage(null) }, 5000)
      }
    }

  }

  const NewBlog = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
            username
        <input
          id='loginFormUsername'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
          password
        <input
          id='loginFormPassword'
          type="text"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
        <br></br>
        <button id='loginFormSubmit' type="submit">login</button>
      </div>
    </form>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} successful={successful} />
      {user === null
        ? loginForm()
        :
        <div>
          <p>{user.username} is logged in</p>
          <button id="logoutButton" onClick={handleLogout}>log out</button>
        </div>
      }
      <br></br>
      {user === null
        ? null
        : NewBlog()
      }
      <br></br>
      <div id="blogList">
        {
          blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} user={user} deleteBlog={deleteBlog}/>
          )
        }
      </div>
    </div>
  )
}

export default App
