import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe ('Blog component tests', () => {
  let component
  const updateBlog = jest.fn()
  const deleteBlog = jest.fn()

  beforeEach(() => {

    const blog = {
      title: 'Incredible moments of making webs',
      author: 'Stive Martin',
      url: 'localhost',
      likes: 10,
      user: {
        username: 'mattsacott'
      }
    }
    const user = {
      username: 'mattscott',

    }
    component = render(
      <Blog blog={blog} updateBlog={updateBlog} user={user} deleteBlog={deleteBlog} />
    )
  })

  test ('Correct initial show', () => {
    expect(
      component.container.querySelector('.partialShow')
    ).toBeDefined()
    expect(
      component.container.querySelector('.fullShow')
    ).toBeNull()
  })

  test('Full show on click button show', () => {
    const button = component.getByText('show')
    fireEvent.click(button)
    expect(
      component.container.querySelector('.fullShow')
    ).toBeDefined()
    expect(
      component.container.querySelector('.partialShow')
    ).toBeNull()
    expect(component.container).toHaveTextContent('localhost')
    expect(component.container).toHaveTextContent('10')
  })

  test('Test like button', () => {
    const buttonShow = component.getByText('show')
    fireEvent.click(buttonShow)
    const buttonLike = component.getByText('like')
    fireEvent.click(buttonLike)
    fireEvent.click(buttonLike)
    expect(updateBlog.mock.calls).toHaveLength(2)
  })

})