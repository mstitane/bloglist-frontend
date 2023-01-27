import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, displayDelete }) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }
    const handleLikeButton = (blog) => {
        updateLikes({
            ...blog,
            likes: blog.likes + 1
        })
    }

    const handleDeleteButton = (blog) => {
        if (window.confirm(`Are you sure you want to remove this blog ${blog.title} ?`))
            deleteBlog(blog)
    }
    const hideWhenUserIsDifferent = { display: displayDelete ? '' : 'none' }

    return (
        <div className="blog">
            <div style={hideWhenVisible}>
                {blog.title} by {blog.author}
                <button onClick={toggleVisibility}>view</button>
            </div>
            <div style={showWhenVisible}>
                <div id="blog-title"> {blog.title}
                    <button onClick={toggleVisibility}>hide</button>
                </div>
                <div id="blog-url"> {blog.url}</div>
                <div id="blog-likes"> likes {blog.likes}
                    <button onClick={() => handleLikeButton(blog)}>like</button>
                </div>
                <div id="blog-author"> {blog.author}</div>
                <div style={hideWhenUserIsDifferent}>
                    <button onClick={() => handleDeleteButton(blog)}>remove</button>
                </div>
            </div>
        </div>
    )
}

export default Blog