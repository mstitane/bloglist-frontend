import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const titleInput = container.querySelector('input[name="Title"]')
    const authorInput = container.querySelector('input[name="Author"]')
    const urlInput = container.querySelector('input[name="Url"]')
    const createButton = screen.getByRole('button', { name : /create/i })

    await user.type(titleInput, 'testing a form title')
    await user.type(authorInput, 'testing a form author')
    await user.type(urlInput, 'testing a form url')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing a form title')
})