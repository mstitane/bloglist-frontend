import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

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
    const noLikeDisplayed = screen.getByText('likes')
    expect(noLikeDisplayed).not.toBeVisible()
})