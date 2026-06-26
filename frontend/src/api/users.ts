import { apiClient } from './client'
import type { User } from './projects'

type LookupResponse = {
  success: true
  data: Pick<User, '_id' | 'username'>
}

export async function lookupUserByUsername(
  username: string,
): Promise<Pick<User, '_id' | 'username'>> {
  const { data } = await apiClient.get<LookupResponse>('/users/lookup', {
    params: { username },
  })
  return data.data
}