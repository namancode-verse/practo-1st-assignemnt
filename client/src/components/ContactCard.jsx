import { 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiStar, 
  FiEdit2, 
  FiTrash2,
  FiTag
} from 'react-icons/fi';
import './ContactCard.css';

const ContactCard = ({ contact, viewMode, onEdit, onDelete, onToggleFavorite }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#43e97b', '#fa709a', '#fee140',
      '#30cfd0', '#a8edea'
    ];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={`contact-card ${viewMode}`}>
      <div className="contact-main">
        <div 
          className="contact-avatar"
          style={{ background: getAvatarColor(contact.name) }}
        >
          {getInitials(contact.name)}
        </div>
        
        <div className="contact-info">
          <div className="contact-header">
            <h3 className="contact-name">{contact.name || 'Unnamed'}</h3>
            <button 
              className={`favorite-btn ${contact.isFavorite ? 'active' : ''}`}
              onClick={onToggleFavorite}
              title={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FiStar />
            </button>
          </div>
          
          {contact.phone && (
            <div className="contact-detail">
              <FiPhone />
              <span>{contact.phone}</span>
            </div>
          )}
          
          {contact.email && (
            <div className="contact-detail">
              <FiMail />
              <span>{contact.email}</span>
            </div>
          )}

          {contact.tags && contact.tags.length > 0 && (
            <div className="contact-tags">
              {contact.tags.map((tag, index) => (
                <span key={index} className="tag">
                  <FiTag /> {tag}
                </span>
              ))}
            </div>
          )}

          {contact.notes && viewMode === 'list' && (
            <p className="contact-notes">{contact.notes}</p>
          )}
        </div>
      </div>

      <div className="contact-actions">
        <button className="action-btn edit" onClick={onEdit} title="Edit contact">
          <FiEdit2 />
          {viewMode === 'list' && <span>Edit</span>}
        </button>
        <button className="action-btn delete" onClick={onDelete} title="Delete contact">
          <FiTrash2 />
          {viewMode === 'list' && <span>Delete</span>}
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
