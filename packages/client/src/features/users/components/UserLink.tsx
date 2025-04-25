import { usePublicUser } from '@/api/hooks/users';
import React from 'react';
import { Link } from 'react-router';

type Props = {
  userId: string;
  defaultName?: string;
};

const UserLink: React.FC<Props> = ({ userId, defaultName }) => {
  const { user } = usePublicUser(userId);
  return (
    <Link to={`users/${userId}`}>
      {user?.givenName || user?.familyName ? (
        <>
          {user.givenName} {user.familyName}
        </>
      ) : user?.email ? (
        <>{user.email}</>
      ) : (
        <i>{defaultName ?? 'No Name'}</i>
      )}
    </Link>
  );
};

export default UserLink;
