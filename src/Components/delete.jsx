import { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

export default function DeleteAccountButton() {
  const { deleteAccount, isDeleting } = useAuth();
  const [error, setError] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleDelete = async () => {
    if (!confirmed) {
      setConfirmed(true); 
      return;
    }

    setError(null);
    try {
      await deleteAccount();
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setError('Session expired. Please log out and log back in before deleting.');
      } else {
        setError('Failed to delete account. Please try again.');
      }
      setConfirmed(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {confirmed && !isDeleting && (
        <p style={{ color: 'orange' }}>
          Are you sure? This cannot be undone.
        </p>
      )}

      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting
          ? 'Deleting...'
          : confirmed
          ? 'Yes, Delete My Account'
          : 'Delete Account'}
      </button>

      {confirmed && !isDeleting && (
        <button onClick={() => setConfirmed(false)} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      )}
    </div>
  );
}