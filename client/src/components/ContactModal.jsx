import { useState, useEffect } from 'react';
import { addContact, updateContact } from '../api/api';
import { toast } from 'react-toastify';
import { 
  FiX, 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiFileText,
  FiTag,
  FiPlus,
  FiStar
} from 'react-icons/fi';
import './ContactModal.css';

const ContactModal = ({ contact, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    tags: [],
    isFavorite: false,
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        phone: contact.phone || '',
        email: contact.email || '',
        notes: contact.notes || '',
        tags: contact.tags || [],
        isFavorite: contact.isFavorite || false,
      });
    }
  }, [contact]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      let response;
      if (contact) {
        response = await updateContact(contact._id, formData);
        toast.success('Contact updated successfully');
      } else {
        response = await addContact(formData);
        toast.success('Contact added successfully');
      }
      onSave(response.data);
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Failed to save contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{contact ? 'Edit Contact' : 'Add New Contact'}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className={`form-group ${errors.name ? 'error' : ''}`}>
            <label>
              <FiUser /> Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className={`form-group ${errors.phone ? 'error' : ''}`}>
            <label>
              <FiPhone /> Phone
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className={`form-group ${errors.email ? 'error' : ''}`}>
            <label>
              <FiMail /> Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>
              <FiTag /> Tags
            </label>
            <div className="tags-input">
              <div className="tags-list">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)}>
                      <FiX />
                    </button>
                  </span>
                ))}
              </div>
              <div className="add-tag">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button type="button" onClick={handleAddTag}>
                  <FiPlus />
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>
              <FiFileText /> Notes
            </label>
            <textarea
              name="notes"
              placeholder="Add any notes about this contact..."
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isFavorite"
                checked={formData.isFavorite}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <FiStar /> Mark as Favorite
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? 'Saving...' : contact ? 'Update Contact' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
