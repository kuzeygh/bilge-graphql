function posts(parent, args, ctx, info) {
  return ctx.db.query.posts({}, info);
}

function post(parent, args, ctx, info) {
  return ctx.db.query.post({ where: { id: args.id } }, info);
}

module.exports = {
  posts,
  post
};
