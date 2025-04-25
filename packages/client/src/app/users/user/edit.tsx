import { usePublicUser } from '@/api/hooks/users';
import Container from '@/components/Container';
import Text from '@/components/Text';
import UserEditForm from '@/features/users/components/UserEditForm';
import React from 'react';
import { useParams } from 'react-router-dom';

const UserPage: React.FC = () => {
  const { userId } = useParams();
  const { user } = usePublicUser(userId);

  return (
    <Container id="user" column>
      <Container style={{ flex: 0 }}>
        {user?.avatar ? (
          <img key={user.avatar} src={user.avatar ?? undefined} />
        ) : (
          <Container>Placeholder</Container>
        )}
      </Container>

      <Container>
        {!user ? <Text>User not found</Text> : <UserEditForm user={user} />}
      </Container>
    </Container>
  );
};

export default UserPage;
