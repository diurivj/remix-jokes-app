import type { JokeWithAuthor } from '~/models/jokes.server';
import { HeartIcon } from '@heroicons/react/solid';
import { Link } from '@remix-run/react';

interface ListProps {
  jokes: JokeWithAuthor[];
}

export function List({ jokes }: ListProps) {
  return (
    <ul className="divide-y divide-gray-200">
      {jokes.map(joke => (
        <li key={joke.id}>
          <Link
            to={`/jokes/${joke.id}`}
            className="py-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{joke.title}</p>
              <p className="text-sm text-gray-500">@{joke.author.username}</p>
            </div>
            <div className="flex items-center space-x-1 ">
              <span className="text-sm text-gray-500">{joke.likes.length}</span>
              <HeartIcon className="h-5 w-5 text-red-400" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
