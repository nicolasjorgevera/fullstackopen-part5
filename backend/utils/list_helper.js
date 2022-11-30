const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  else {
    const result = blogs.map ( blog => blog.likes).reduce ((prev, curr) => prev + curr, 0)
    return result
  }
}

const favoriteBlog = (blogs) => {

  const favorite =  blogs.reduce((favorite, actual) => {
    if (favorite.likes > actual.likes) {
      return favorite
    }
    else{
      return actual
    }
  }, 0)
  delete favorite['__v']
  delete favorite['_id']
  delete favorite['url']

  return favorite
}

const mostBlogs = (blogs) => {
  const accummulatedBlogs = []
  blogs.map(blog => {

    if (!accummulatedBlogs.find( accummulatedBlog => blog.author === accummulatedBlog.author)) {
      const newAccummulatedBlog = { author: blog.author ,  blogs: 1 }
      accummulatedBlogs.push (newAccummulatedBlog)

    }
    else{
      const accummulatedBlogsIndex =  accummulatedBlogs.findIndex( accummulatedBlog => blog.author === accummulatedBlog.author)
      accummulatedBlogs[accummulatedBlogsIndex].blogs++
    }
  })

  const authorWithMostBlogs =  accummulatedBlogs.reduce((author, actual) => {
    if (author.blogs > actual.blogs) {
      return author
    }
    else{
      return actual
    }
  }, 0)
  return authorWithMostBlogs
}


const mostLikes = (blogs) => {
  const accummulatedLikes = []
  blogs.map(blog => {

    if (!accummulatedLikes.find( accummulatedLike => blog.author === accummulatedLike.author)) {
      const newAccummulatedLike = { author: blog.author ,  likes: blog.likes }
      accummulatedLikes.push (newAccummulatedLike)
    }
    else{
      const accummulatedLikesIndex =  accummulatedLikes.findIndex( accummulatedLike => blog.author === accummulatedLike.author)
      accummulatedLikes[accummulatedLikesIndex].likes = accummulatedLikes[accummulatedLikesIndex].likes + blog.likes
    }
  })
  const authorWithMostLikes =  accummulatedLikes.reduce((author, actual) => {
    if (author.likes > actual.likes) {
      return author
    }
    else{
      return actual
    }
  }, 0)
  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}