const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../util");
const shortid = require("shortid");
const { createWriteStream } = require("fs");

//Resim yükleme işlemi yapılıyor
const storeUpload = async ({ stream }) => {
  const path = `images/${shortid.generate()}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve({ path }))
      .on("error", reject)
  );
};

//Stream başlatıldı
const processUpload = async upload => {
  const { stream } = await upload;
  const { path } = await storeUpload({ stream });
  return path;
};

async function createPost(parent, { title, content }, ctx, info) {
  const userId = getUserId(ctx);
  return ctx.prisma.createPost(
    {
      title,
      content,
      author: {
        connect: { id: userId }
      }
    },
    info
  );
}

async function createVote(parent, args, ctx, info) {
  const userId = getUserId(ctx);

  return ctx.prisma.createVote(
    {
      user: { connect: { id: userId } },
      post: { connect: { id: args.postId } }
    },
    info
  );
}

async function createPostImage(parent, { picture }, ctx, info) {
  const pictureURL = await processUpload(picture);
  return ctx.prisma.createPostImage(
    {
      data: {
        pictureURL: `http://localhost:4000/${pictureURL}`
      }
    },
    info
  );
}

//Burada userId kullanılmamış bundan dolayı publish bu rotanın sadece kullanıcıya açık olmasına dikkat etmek lazım.
function publishPost(parent, args, ctx, info) {
  return ctx.prisma.updatePost(
    {
      where: { id: args.postId },
      data: { published: true }
    },
    info
  );
}

function updatePost(parent, args, ctx, info) {
  return ctx.prisma.updatePost(
    {
      where: { id: args.postId },
      data: { title: args.title, content: args.content }
    },
    info
  );
}

async function createUser(parent, args, ctx, info) {
  const password = await bcrypt.hash(args.password, 10);

  const user = await ctx.prisma.createUser({ ...args, password });

  const token = jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    APP_SECRET
  );

  return { token, user };
}

async function loginUser(parent, args, ctx, info) {
  const user = await ctx.prisma.user({ email: args.email });

  if (!user) {
    throw new Error("Böyle bir kullanıcı yok");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Şifre yanlış");
  }

  const token = jwt.sign(
    { userId: user.id, name: user.name, email: user.email },
    APP_SECRET
  );

  return {
    token,
    user
  };
}

function deletePost(parent, { postId }, ctx, info) {
  return ctx.prisma.deletePost({ id: postId }, info);
}

module.exports = {
  createUser,
  createPost,
  createPostImage,
  createVote,
  deletePost,
  publishPost,
  updatePost,
  loginUser
};
