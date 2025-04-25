import { usePublicUser } from '@/api/hooks/users';
import Container from '@/components/Container';
import Text from '@/components/Text';
import React, { Fragment } from 'react';
import { Form, useParams } from 'react-router-dom';

const UserPage: React.FC = () => {
  const { userId } = useParams();
  const { user } = usePublicUser(userId);

  return (
    <Container id="user" column>
      <Container>
        {user?.avatar ? (
          <img key={user.avatar} src={user.avatar ?? undefined} />
        ) : (
          <Container>Placeholder</Container>
        )}
      </Container>

      <Container>
        {!user ? (
          <Text>User not found</Text>
        ) : (
          <Fragment>
            <h1>
              {user.givenName || user.familyName ? (
                <Text>
                  {user.givenName} {user.familyName}
                </Text>
              ) : user.email ? (
                <Text>{user.email}</Text>
              ) : (
                <Text>No Name</Text>
              )}
            </h1>

            <Container>
              <Form action="edit">
                <button type="submit">Edit</button>
              </Form>
            </Container>
          </Fragment>
        )}
      </Container>
    </Container>
  );
};

export default UserPage;
