import {useState} from "react";

const Blog = ({blog, updateLikes}) => {
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

            </div>
        </div>
    )
}

export default Blog