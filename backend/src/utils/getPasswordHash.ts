import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export const getPasswordHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}
