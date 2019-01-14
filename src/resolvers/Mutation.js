function createPost(parent, { title, content }, ctx, info) {
  return ctx.db.mutation.createPost(
    {
      data: {
        title,
        content
      }
    },
    info
  );
}

function deletePost(parent, { id }, ctx, info) {
  return ctx.db.mutation.deletePost({ where: { id } }, info);
}

function publish(parent, args, ctx, info) {
  return ctx.db.mutation.updatePost(
    {
      where: { id },
      data: { published: true }
    },
    info
  );
}

function createUser(parent, { name, email, password }, ctx, info) {
  return ctx.db.mutation.createUser({ data: { name, email, password } }, info);
}

module.exports = {
  createPost,
  deletePost,
  publish,
  createUser
};
