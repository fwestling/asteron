import { UserPatchDto } from '@/api/__generated/models';
import { usePatchUser, usePostAvatar } from '@/api/hooks/users';
import { User } from '@/api/interfaces/users';
import Action from '@/components/Action';
import Container from '@/components/Container';
import { useForm } from 'react-hook-form';

interface UserEditFormProps {
  user: User;
}

const UserEditForm = ({ user }: UserEditFormProps) => {
  const { patchUser } = usePatchUser(user.id);
  const { postAvatar } = usePostAvatar(user.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserPatchDto & { avatar: File }>({
    defaultValues: {
      givenName: user.givenName,
      familyName: user.familyName,
      // phone: user.phone,
    },
  });

  const onSubmit = handleSubmit(({ avatar, ...data }) => {
    if (avatar) postAvatar({ file: avatar });
    patchUser(data);
  });

  return (
    <Container column>
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        onSubmit={onSubmit}
      >
        <label htmlFor="givenName">Given Name</label>
        <input type="text" id="givenName" {...register('givenName')} required />
        <label htmlFor="familyName">Family Name</label>
        <input
          type="text"
          id="familyName"
          {...register('familyName')}
          required
        />
        {/* <input type="text" {...register("phone")} /> */}

        <input type="file" {...register('avatar')} accept="image/*" />

        {errors.givenName && <p>{errors.givenName.message}</p>}
        {errors.familyName && <p>{errors.familyName.message}</p>}
        <Action type="submit">Update</Action>
      </form>
    </Container>
  );
};

export default UserEditForm;
