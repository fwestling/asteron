import { useCallback } from 'react';
import {
  UserPatchDto,
  UsersControllerUploadUserAvatarBody,
} from '../__generated/models';
import {
  useUsersControllerGetAll,
  useUsersControllerGetMe,
  useUsersControllerGetUserPublic,
  useUsersControllerUpdateUser,
  useUsersControllerUploadUserAvatar,
} from '../__generated/users/users';
import useMessage from '@/hooks/useMessage';
import { useQueryClient } from '@tanstack/react-query';

const queryKeys = {
  users: () => ['users'] as const,
  userMe: () => ['users', 'me'] as const,
  user: (userId: string) => ['users', userId] as const,
};

export const useMe = () => {
  const { data, ...rest } = useUsersControllerGetMe({
    query: { queryKey: queryKeys.userMe() },
  });

  return { user: data?.data, ...rest };
};

export const usePublicUsers = () => {
  const { data, ...rest } = useUsersControllerGetAll({
    query: { queryKey: queryKeys.users() },
  });

  return { users: data?.data ?? [], ...rest };
};

export const usePublicUser = (userId?: string) => {
  const { data, ...rest } = useUsersControllerGetUserPublic(userId ?? '', {
    query: { enabled: !!userId, queryKey: queryKeys.user(userId ?? '') },
  });

  return { user: data?.data, ...rest };
};

// ~~ Mutation template:
export const usePatchUser = (userId: string) => {
  const queryClient = useQueryClient();

  // ~~ Success and error handling, including invalidating query keys.
  const { alert, error } = useMessage();
  const { mutate, ...rest } = useUsersControllerUpdateUser({
    mutation: {
      onSuccess: ({ data }) => {
        alert(`${data.givenName ?? data.email} updated successfully`);
        queryClient.invalidateQueries({ queryKey: queryKeys.user(data.id) });
      },
      onError: () => error('Failed to update user'),
    },
  });

  // ~~ Perform mutation, invalidate query keys
  const patchUser = useCallback(
    (user: UserPatchDto) => mutate({ data: user, userId }),
    [userId, mutate],
  );

  return { patchUser, ...rest };
};

// ~~ Mutation template:
export const usePostAvatar = (userId: string) => {
  const queryClient = useQueryClient();

  // ~~ Success and error handling, including invalidating query keys.
  const { alert, error } = useMessage();
  const { mutate, ...rest } = useUsersControllerUploadUserAvatar({
    mutation: {
      onSuccess: ({ data }) => {
        alert(`${data.givenName ?? data.email} profile uploaded successfully`);
        queryClient.invalidateQueries({ queryKey: queryKeys.user(data.id) });
      },
      onError: () => error('Failed to update user'),
    },
  });

  // ~~ Perform mutation, invalidate query keys
  const postAvatar = useCallback(
    (user: UsersControllerUploadUserAvatarBody) =>
      mutate({ data: user, userId }),
    [userId, mutate],
  );

  return { postAvatar, ...rest };
};
