import type { Joke } from '@prisma/client';
import type { User } from '~/models/user.server';

import { prisma } from '~/db.server';

export type { Joke } from '@prisma/client';

export type JokeWithAuthor = {
  id: Joke['id'];
  title: Joke['title'];
  likes: Joke['likes'];
  author: User;
};

type CreateJokePayload = {
  title: Joke['title'];
  content: Joke['content'];
  userId: Joke['userId'];
};

export async function getJokes() {
  return prisma.joke.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      likes: true,
      author: true
    }
  });
}

export async function createJoke({
  content,
  title,
  userId
}: CreateJokePayload) {
  return prisma.joke.create({
    data: {
      title,
      content,
      userId
    }
  });
}

export async function getJokeById(id: Joke['id']) {
  return prisma.joke.findUniqueOrThrow({
    where: { id },
    include: {
      author: true
    }
  });
}

export async function likeJoke(id: Joke['id'], likerId: User['id']) {
  return prisma.joke.update({
    where: { id },
    data: {
      likes: {
        push: likerId
      }
    }
  });
}

// There is a feature request for this https://github.com/prisma/prisma/issues/7401
export async function unlikeJoke(id: Joke['id'], newLikes: Joke['likes']) {
  return prisma.joke.update({
    where: { id },
    data: {
      likes: newLikes
    }
  });
}

export async function deleteJoke(id: Joke['id']) {
  return prisma.joke.delete({ where: { id } });
}
