function newPostSubscribe(parent, args, ctx, info) {
  return ctx.prisma.$subscribe
    .vote(
      {
        mutation_in: ["CREATED"]
      },
      info
    )
    .node();
}

const newVote = {
  subscribe: newPostSubscribe,
  resolve: payload => {
    console.log(payload);
    return payload;
  }
};

module.exports = {
  newVote
};
