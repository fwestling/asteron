import React from 'react';
import { Form, Outlet } from 'react-router-dom';

import { usePublicUsers } from '@/api/hooks/users';
import Container from '@/components/Container';
import UserLink from '@/features/users/components/UserLink';

export async function action() {}

// export async function loader() {
//   const users =
//   return { users };
// }

const Root: React.FC = () => {
  const { users } = usePublicUsers();
  // useLoaderData() as { users: UserGetDto[] };

  return (
    <>
      <Container id="sidebar" column>
        <h1>React Router Users</h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search users"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          <p>Users</p>
          {users.length ? (
            <ul>
              {users.map((user) => (
                <li key={user.id as string}>
                  <UserLink
                    userId={user.id}
                    defaultName={
                      user.givenName || user.familyName
                        ? `${user.givenName} ${user.familyName}`
                        : user.email
                    }
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No users</i>
            </p>
          )}
        </nav>
      </Container>
      <Container id="detail">
        <Outlet />
      </Container>
    </>
  );
};

export default Root;
