import {useState} from "react";

const Blog = ({blog}) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }
    return (
        <div className="blog">
            <div style={hideWhenVisible}>
                {blog.title} <button onClick={toggleVisibility}>view</button>
            </div>
            <div style={showWhenVisible}>
                <div> {blog.title} <button onClick={toggleVisibility}>hide</button> </div>
                <div> {blog.url}</div>
                <div> likes {blog.likes} <button onClick="">like</button></div>
                <div> {blog.author}</div>

            </div>
        </div>
    )
}

export default Blog