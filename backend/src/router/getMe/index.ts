import _ from 'lodash'

import { publicProcedure } from '../../lib/trpc'

export const getMeTrpcRoute = publicProcedure.query(({ ctx }) => {
  return { me: ctx.me && _.pick(ctx.me, ['id', 'nick', 'role']) }
})
