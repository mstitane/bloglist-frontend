const Notification = (props) => {

    let message = props.message
    if (!message || !message.text)
        return null

    let cssClass = message.type === 'ERROR' ? 'error' : 'success'
    return (
        <p className={cssClass}>
            {message.text}
        </p>
    )
}

export default Notification