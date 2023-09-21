import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import { usersCol } from '../services/firebase';
import { UserFormData } from '../types/User.types';
import useAuth from '../hooks/useAuth';
import useGetCollection from '../hooks/useGetCollection';

const AdminPage = () => {
  const { data: users, loading } = useGetCollection<UserFormData>(usersCol);
  const { currentUser } = useAuth();

  const admins = users?.filter((user) => user.admin === true);

  return (
    <Container className="py-3">
      {loading ? (
        <p>Loading...</p>
      ) : users && currentUser ? (
        admins?.some((admin) => admin.email === currentUser.email) ? (
          <div>
            {users.map((user) => (
              <ListGroup.Item key={user.uid}>
                <p>Email: {user.email}</p>
                <p>Admin: {user.admin ? 'Yes' : 'No'}</p>
              </ListGroup.Item>
            ))}
          </div>
        ) : (
          <p>You do not have permission to view this page.</p>
        )
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

export default AdminPage;