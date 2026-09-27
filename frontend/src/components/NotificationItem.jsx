function NotificationItem({ title, message, time }) {
  return (
    <div className="notification-item">
      <div className="notification-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <span>{time}</span>
      </div>
    </div>
  );
}

export default NotificationItem;