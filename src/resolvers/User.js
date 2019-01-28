function posts(parent, args, ctx, info) {
  return ctx.prisma.user({ id: parent.id }).posts();
}

module.exports = {
  posts
};
