import {useState} from "react";

const Blog = ({blog, updateLikes, deleteBlog, displayDelete}) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = {display: visible ? 'none' : ''}
    const showWhenVisible = {display: visible ? '' : 'none'}

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
    const hideWhenUserIsDifferent = {display: displayDelete ?  '' : 'none'}

    return (
        <div className="blog">
            <div style={hideWhenVisible}>
                {blog.title}
                <button onClick={toggleVisibility}>view</button>
            </div>
            <div style={showWhenVisible}>
                <div> {blog.title}
                    <button onClick={toggleVisibility}>hide</button>
                </div>
                <div> {blog.url}</div>
                <div> likes {blog.likes}
                    <button onClick={() => handleLikeButton(blog)}>like</button>
                </div>
                <div> {blog.author}</div>
                <div style={hideWhenUserIsDifferent}>
                    <button onClick={() => handleDeleteButton(blog)}>remove</button>
                </div>
            </div>
        </div>
    )
}

export default Blog