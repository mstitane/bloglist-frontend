import {useState, useEffect} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from "./components/Notification";

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const SUCCESS = 'SUCCESS';
    const ERROR = 'ERROR';


    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('logged_blogs_app_user')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, [])

    const fireMessage = (message, type) => {
        setErrorMessage({text: message, type: type})
        setTimeout(() => {
            setErrorMessage({text: null, type: null})
        }, 5000)
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })
            window.localStorage.setItem(
                'logged_blogs_app_user', JSON.stringify(user)
            )
            setUser(user)
            blogService.setToken(user.token)
            setUsername('')
            setPassword('')
        } catch (exception) {
            fireMessage('Wrong credentials', ERROR)
        }
    }

    const handleLogout = async (event) => {
        event.preventDefault()
        window.localStorage.removeItem('logged_blogs_app_user')
        setUser(null)
    }
    const loginForm = () => (
        <div>
            <h2>Log in to application</h2>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        onChange={({target}) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={({target}) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )

    const handleNewBlog = (event) => {
        event.preventDefault()
        const newBlog = {
            title,
            author,
            url
        }
        try {
            blogService.create(newBlog).then(returnedBlog => {
                    setBlogs(blogs.concat(returnedBlog));
                    fireMessage('a new blog [' + title + '] by [' + author + '] added', SUCCESS)
                }
            )
        } catch (exception) {
            fireMessage(exception, ERROR)
        }
    }

    const blogsList = () => (
        <div>
            <div>{user.name} logged-in <button name="logout" onClick={handleLogout}>logout</button></div>
            <h2>create new blog</h2>
            <form onSubmit={handleNewBlog}>
                <div>
                    title :
                    <input
                        type="text"
                        value={title}
                        name="Title"
                        onChange={({target}) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author :
                    <input
                        type="text"
                        value={author}
                        name="Author"
                        onChange={({target}) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    url :
                    <input
                        type="text"
                        value={url}
                        name="Url"
                        onChange={({target}) => setUrl(target.value)}
                    />
                </div>
                <button type="submit">create</button>
            </form>
            <div>
                {blogs.map(obj => <Blog key={obj.id} blog={obj}/>)}
            </div>
        </div>
    )

    return (
        <div>
            <h2>blogs</h2>
            <Notification message={errorMessage}/>
            {user === null ? loginForm() : blogsList()}

        </div>
    )
}

export default App
