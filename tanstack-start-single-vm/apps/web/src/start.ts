import { createCsrfMiddleware, createStart } from '@tanstack/react-start';

// Behind a proxy the server sees its own loopback URL, not the public one. The
// proxy states the public origin in X-Forwarded-*; accept that origin too.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
  origin: (origin, ctx) => {
    const host = ctx.request.headers.get('x-forwarded-host');
    const proto = ctx.request.headers.get('x-forwarded-proto') ?? 'https';
    return (
      origin === new URL(ctx.request.url).origin ||
      (host !== null && origin === `${proto}://${host}`)
    );
  },
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware],
}));
