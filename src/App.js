import {useEffect, useState} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";


const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const SUCCESS = 'SUCCESS';
    const ERROR = 'ERROR';
    const [loginVisible, setLoginVisible] = useState(false)

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(sortByLikes(blogs))
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
    const loginForm = () => {
        const hideWhenVisible = {display: loginVisible ? 'none' : ''}
        const showWhenVisible = {display: loginVisible ? '' : 'none'}

        return (
            <div>
                <div style={hideWhenVisible}>
                    <button onClick={() => setLoginVisible(true)}>log in</button>
                </div>
                <div style={showWhenVisible}>
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({target}) => setUsername(target.value)}
                        handlePasswordChange={({target}) => setPassword(target.value)}
                        handleSubmit={handleLogin}
                    />
                    <button onClick={() => setLoginVisible(false)}>cancel</button>
                </div>
            </div>
        )
    }

    const handleNewBlog = (newBlog) => {
        try {
            blogService.create(newBlog).then(returnedBlog => {
                setBlogs(sortByLikes(blogs.concat(returnedBlog)));
                fireMessage('a new blog [' + returnedBlog.title + '] by [' + returnedBlog.author + '] added', SUCCESS)
            })
                .catch(e => {
                    fireMessage(e.message, ERROR)
                })
        } catch (exception) {
            fireMessage(exception, ERROR)
        }
    }

    const handleUpdateLikes = (updatedBlog) => {
        try {
            blogService.update(updatedBlog).then(returnedBlog => {
                fireMessage('you liked the blog [' + returnedBlog.title + ']', SUCCESS)
                setBlogs(sortByLikes(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b)));
            })
                .catch(e => {
                    fireMessage(e.message, ERROR)
                })
        } catch (exception) {
            fireMessage(exception, ERROR)
        }
    }

    const sortByLikes = (blogs) => {
        return blogs.sort((a, b) => b.likes - a.likes)
    }

    const blogsList = () => (
        <div>
            <div>{user.name} logged-in <button name="logout" onClick={handleLogout}>logout</button></div>
            <br/>
            <Togglable buttonLabel="new blog">
                <h2>create new blog</h2>
                <BlogForm createBlog={handleNewBlog}/>
            </Togglable>
            <br/>
            <div>
                {blogs.map(obj => <Blog key={obj.id} blog={obj} updateLikes={handleUpdateLikes}/>)}
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
