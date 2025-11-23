import { trpc } from '../lib/trpc'

const CACHE_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 минут - данные считаются свежими
  gcTime: 30 * 60 * 1000, // 30 минут - данные хранятся в кеше
}

export const useReferences = () => {
  const genusQuery = trpc.getGenus.useQuery(undefined, CACHE_CONFIG)
  const variegationQuery = trpc.getVariegation.useQuery(undefined, CACHE_CONFIG)
  const lifeFormQuery = trpc.getLifeForm.useQuery(undefined, CACHE_CONFIG)

  return {
    genus: genusQuery.data?.genus || [],
    variegation: variegationQuery.data?.variegation || [],
    lifeForm: lifeFormQuery.data?.lifeForm || [],
    isLoading: genusQuery.isLoading || variegationQuery.isLoading || lifeFormQuery.isLoading,
    isError: genusQuery.isError || variegationQuery.isError || lifeFormQuery.isError,
    error: genusQuery.error || variegationQuery.error || lifeFormQuery.error,
  }
}
