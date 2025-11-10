import { type Express, type Request, type Response, type NextFunction } from 'express'
import { Passport } from 'passport'
import { type AuthenticateCallback } from 'passport'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'

import { type AppContext } from './ctx'
import { env } from './env'

export const applyPassportToExpressApp = (expressApp: Express, ctx: AppContext) => {
  const passport = new Passport()

  passport.use(
    new JWTStrategy(
      {
        secretOrKey: env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      },
      (jwtPayload: string, done) => {
        {
          ctx.prisma.user
            .findUnique({
              where: { id: jwtPayload },
            })
            .then((user) => {
              if (!user) {
                done(null, false)
                return
              }
              done(null, user)
            })
            .catch((error) => {
              done(error, false)
            })
        }
      },
    ),
  )

  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      next()
      return
    }

    const callback: AuthenticateCallback = (error, user) => {
      if (error) {
        next(error)
        return
      }
      req.user = user || undefined
      next()
    }

    const authenticate = passport.authenticate('jwt', { session: false }, callback) as (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void

    authenticate(req, res, next)
  })
}
