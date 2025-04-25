import { useMe } from '@/api/hooks/users';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useMe();
  const { user, isLoading } = useMe();
  console.log('Fetched user', user);
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate('/');
        console.log('Signed out successfully');
      })
      .catch();
  };

  return (
    <>
      <nav>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <p>Welcome Home, {user?.givenName ?? user?.email ?? 'user'}</p>
        )}
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    </>
  );
};

export default Home;
