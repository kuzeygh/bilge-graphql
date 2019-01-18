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
  return ctx.db.mutation.createPost(
    {
      data: {
        title,
        content,
        author: {
          connect: { id: userId }
        }
      }
    },
    info
  );
}

async function createPostImage(parent, { picture }, ctx, info) {
  return ctx.db.mutation.createPostImage(
    {
      data: {
        pictureURL: await processUpload(picture)
      }
    },
    info
  );
}

function deletePost(parent, { postId }, ctx, info) {
  return ctx.db.mutation.deletePost({ where: { id: postId } }, info);
}

function publishPost(parent, args, ctx, info) {
  return ctx.db.mutation.updatePost(
    {
      where: { id: args.postId },
      data: { published: true }
    },
    info
  );
}

function updatePost(parent, args, ctx, info) {
  return ctx.db.mutation.updatePost(
    {
      where: { id: args.postId },
      data: { title: args.title, content: args.content }
    },
    info
  );
}

async function createUser(parent, args, ctx, info) {
  const password = await bcrypt.hash(args.password, 10);

  const user = await ctx.db.mutation.createUser({
    data: { ...args, password }
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}

async function loginUser(parent, args, ctx, info) {
  const user = await ctx.db.query.user({ where: { email: args.email } });
  if (!user) {
    throw new Error("Böyle bir kullanıcı yok");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Şifre yanlış");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

module.exports = {
  createPost,
  createPostImage,
  deletePost,
  publishPost,
  updatePost,
  createUser,
  loginUser
};
