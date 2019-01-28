function user(parent, args, ctx, info) {
  return ctx.prisma.vote({ id: parent.id }).user();
}

function post(parent, args, ctx, info) {
  return ctx.prisma.vote({ id: parent.id }).post();
}

module.exports = {
  user,
  post
};
