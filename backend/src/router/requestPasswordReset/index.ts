import { TRPCError } from '@trpc/server'

import { zRequestPasswordResetInput } from './input'
import { sendTelegramMessage } from '../../lib/telegram'
import { trpc } from '../../lib/trpc'

// -B> #'+ @>CB - ?>;L7>20B5;L =5 02B>@87>20= (701K; ?0@>;L)
export const requestPasswordResetTrpcRoute = trpc.procedure
  .input(zRequestPasswordResetInput)
  .mutation(async ({ ctx, input }) => {
    // @>25@O5< GB> ?>;L7>20B5;L A B0:8< =8:>< ACI5AB2C5B
    const user = await ctx.prisma.user.findUnique({
      where: { nick: input.nick },
      select: {
        id: true,
        nick: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: '>;L7>20B5;L A B0:8< =8:=59<>< =5 =0945=',
      })
    }

    // $>@<8@C5< A>>1I5=85 4;O 04<8=0 2 Telegram
    const message = `
= <b>0?@>A =0 A1@>A ?0@>;O</b>

=d <b>>;L7>20B5;L:</b> ${user.nick}
<� <b>ID:</b> ${user.id}
=n <b> >;L:</b> ${user.role === 'ADMIN' ? '4<8=' : '>;L7>20B5;L'}
=� <b>0@538AB@8@>20=:</b> ${new Date(user.createdAt).toLocaleDateString('ru-RU')}

=� <b>>=B0:B=K5 40==K5:</b>
${input.contactInfo}

9 <i>!2O68B5AL A ?>;L7>20B5;5< 8 A35=5@8@C9B5 AAK;:C 4;O A1@>A0 ?0@>;O 2 04<8=-?0=5;8</i>
    `.trim()

    // B?@02;O5< A>>1I5=85 2 Telegram
    const sent = await sendTelegramMessage(message)

    if (!sent) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: '5 C40;>AL >B?@028BL 70?@>A 04<8=8AB@0B>@C. >?@>1C9B5 ?>765 8;8 A2O68B5AL A =0<8 =0?@O<CN.',
      })
    }

    return {
      success: true,
      message: '0?@>A >B?@02;5= 04<8=8AB@0B>@C. K A2O65<AO A 20<8 2 1;8609H55 2@5<O ?> C:070==K< :>=B0:B=K< 40==K<.',
    }
  })
