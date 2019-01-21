function postList(parent, args, ctx, info) {
  return ctx.db.query.posts({}, info);
}

function postById(parent, args, ctx, info) {
  return ctx.db.query.post({ where: { id: args.postId } }, info);
}

function userPostsById(parent, args, ctx, info) {
  return ctx.db.query.user({ where: { id: args.userId } }, info);
}

function imageById(parent, args, ctx, info) {
  return ctx.db.query.postImage({ where: { id: args.imageId } });
}

module.exports = {
  postList,
  postById,
  userPostsById,
  imageById
};
