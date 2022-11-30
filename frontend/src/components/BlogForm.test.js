import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'


describe('Test to blog from', () => {
  test('Add blog with a blog form', () => {
    const createBlog = jest.fn()
    const component = render(
      <BlogForm createBlog={createBlog} />
    )
    const form = component.container.querySelector('form')
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const likes = component.container.querySelector('#likes')

    fireEvent.change(title, {
      target: { value: 'Incredible moments of making webs' }
    })
    fireEvent.change(author, {
      target: { value: 'Stive Martin' }
    })
    fireEvent.change(url, {
      target: { value: 'localhost' }
    })
    fireEvent.change(likes, {
      target: {
        value: 10
      }
    })

    fireEvent.submit(form)

    const blog = {
      title: 'Incredible moments of making webs',
      author: 'Stive Martin',
      url: 'localhost',
      likes: '10'
    }

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toStrictEqual(blog)
  })

})