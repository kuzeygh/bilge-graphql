function author(parent, args, ctx, info) {
  return ctx.prisma.post({ id: parent.id }).author();
}

module.exports = {
  author
};
