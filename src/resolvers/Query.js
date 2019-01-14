function postList(parent, args, ctx, info) {
  return ctx.db.query.posts({}, info);
}

function postById(parent, args, ctx, info) {
  return ctx.db.query.post({ where: { id: args.postId } }, info);
}

function userById(parent, args, ctx, info) {
  return ctx.db.query.user({ where: { id: args.userId } }, info);
}

module.exports = {
  postList,
  postById,
  userById
};
