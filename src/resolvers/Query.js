function postList(parent, args, ctx, info) {
  return ctx.prisma.posts({}, info);
}

function postById(parent, args, ctx, info) {
  return ctx.prisma.post({ id: args.postId }, info);
}

function userPostsById(parent, args, ctx, info) {
  return ctx.prisma.user({ id: args.userId }, info);
}

function imageById(parent, args, ctx, info) {
  return ctx.prisma.postImage({ id: args.imageId }, info);
}

module.exports = {
  postList,
  postById,
  userPostsById,
  imageById
};
