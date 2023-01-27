import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders title and author only', () => {
    const blog = {
        title: 'React-testing-library',
        author: 'Mohammed STITANE',
        url: 'http://test.url.com'
    }

    render(<Blog blog={blog} />)

    const titleByAuthor = screen.getByText('React-testing-library by Mohammed STITANE')
    expect(titleByAuthor).toBeVisible()
    const noUrlDisplayed = screen.getByText('http://test.url.com')
    expect(noUrlDisplayed).not.toBeVisible()
    const noLikeDisplayed = screen.quer('likes')
    expect(noLikeDisplayed).not.toBeVisible()
})

test('clicking the button shows the url and number of likes', async () => {
    const blog = {
        title: 'React-testing-library',
        author: 'Mohammed STITANE',
        url: 'http://test.url.com',
        likes : 11
    }

    const mockHandler = jest.fn()

    const { container } = render(<Blog blog={blog} updateLikes={mockHandler}/>)

    const user = userEvent.setup()
    const showButton = screen.getByText('view')
    expect(showButton).toBeVisible()
    await user.click(showButton)

    const hideButton = screen.getByText('hide')
    expect(hideButton).toBeVisible()

    const urlDisplayed = container.querySelector('#blog-url')
    expect(urlDisplayed).toBeVisible()
    const likesDisplayed = container.querySelector('#blog-likes')
    expect(likesDisplayed).toBeVisible()
    expect(likesDisplayed.innerHTML).toContain(`likes ${blog.likes}`)

})

test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
    const blog = {
        title: 'React-testing-library',
        author: 'Mohammed STITANE',
        url: 'http://test.url.com',
        likes : 11
    }

    const mockHandler = jest.fn()

    const { container } = render(<Blog blog={blog} updateLikes={mockHandler}/>)

    const user = userEvent.setup()
    const showButton = screen.getByText('view')
    await user.click(showButton)

    const buttonLikes = container.querySelector('#button-likes')
    await user.click(buttonLikes)
    await user.click(buttonLikes)
    expect(mockHandler.mock.calls).toHaveLength(2)

})