import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getContacts, deleteContact, updateContact } from '../api/api';
import { toast } from 'react-toastify';
import ContactCard from '../components/ContactCard';
import ContactModal from '../components/ContactModal';
import { 
  FiPlus, 
  FiSearch, 
  FiLogOut, 
  FiUsers, 
  FiStar,
  FiGrid,
  FiList
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, favorites
  const [selectedTag, setSelectedTag] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, filter, selectedTag]);

  const fetchContacts = async () => {
    try {
      const response = await getContacts();
      setContacts(response.data);
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let result = [...contacts];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (contact) =>
          contact.name?.toLowerCase().includes(term) ||
          contact.email?.toLowerCase().includes(term) ||
          contact.phone?.includes(term) ||
          contact.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Favorites filter
    if (filter === 'favorites') {
      result = result.filter((contact) => contact.isFavorite);
    }

    // Tag filter
    if (selectedTag) {
      result = result.filter((contact) => 
        contact.tags?.includes(selectedTag)
      );
    }

    setFilteredContacts(result);
  };

  const getAllTags = () => {
    const tags = new Set();
    contacts.forEach(contact => {
      contact.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }
    
    try {
      await deleteContact(id);
      setContacts(contacts.filter((c) => c._id !== id));
      toast.success('Contact deleted successfully');
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const handleToggleFavorite = async (contact) => {
    try {
      const updated = await updateContact(contact._id, {
        ...contact,
        isFavorite: !contact.isFavorite,
      });
      setContacts(
        contacts.map((c) => (c._id === contact._id ? updated.data : c))
      );
    } catch (error) {
      toast.error('Failed to update contact');
    }
  };

  const handleOpenModal = (contact = null) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedContact(null);
    setIsModalOpen(false);
  };

  const handleSaveContact = (savedContact) => {
    if (selectedContact) {
      setContacts(
        contacts.map((c) => (c._id === savedContact._id ? savedContact : c))
      );
    } else {
      setContacts([...contacts, savedContact]);
    }
    handleCloseModal();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('Logged out successfully');
  };

  const favoritesCount = contacts.filter((c) => c.isFavorite).length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>
            <FiUsers /> Contacts
          </h1>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="stats-bar">
          <div className="stat-item">
            <FiUsers />
            <span>{contacts.length} Contacts</span>
          </div>
          <div className="stat-item">
            <FiStar />
            <span>{favoritesCount} Favorites</span>
          </div>
        </div>

        <div className="controls-bar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
                onClick={() => setFilter('favorites')}
              >
                <FiStar /> Favorites
              </button>
            </div>

            {getAllTags().length > 0 && (
              <select
                className="tag-filter"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">All Tags</option>
                {getAllTags().map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            )}

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <FiList />
              </button>
            </div>
          </div>

          <button className="add-btn" onClick={() => handleOpenModal()}>
            <FiPlus /> Add Contact
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="empty-state">
            <FiUsers className="empty-icon" />
            <h3>No contacts found</h3>
            <p>
              {searchTerm || filter !== 'all' || selectedTag
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first contact'}
            </p>
            {!searchTerm && filter === 'all' && !selectedTag && (
              <button className="add-btn" onClick={() => handleOpenModal()}>
                <FiPlus /> Add Contact
              </button>
            )}
          </div>
        ) : (
          <div className={`contacts-container ${viewMode}`}>
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact._id}
                contact={contact}
                viewMode={viewMode}
                onEdit={() => handleOpenModal(contact)}
                onDelete={() => handleDeleteContact(contact._id)}
                onToggleFavorite={() => handleToggleFavorite(contact)}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <ContactModal
          contact={selectedContact}
          onClose={handleCloseModal}
          onSave={handleSaveContact}
        />
      )}
    </div>
  );
};

export default Dashboard;
