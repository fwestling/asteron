import { queryOptions } from "@tanstack/react-query";
import { usersControllerGetMe } from "./__generated/users/users";

const Users = {
  getMe: queryOptions({
    queryKey: ['users', 'me'],
    queryFn: () =>usersControllerGetMe(),
  })
}

export default Users;