import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useLocation, useNavigate } from '@remix-run/react';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import invariant from 'tiny-invariant';
import {
  deleteJoke,
  getJokeById,
  likeJoke,
  unlikeJoke
} from '~/models/jokes.server';
import { ArrowLeftIcon, HeartIcon, TrashIcon } from '@heroicons/react/outline';
import { useOptionalUser } from '~/utils/auth';
import { getUserId } from '~/session.server';
import { classNames } from '~/utils/tailwind';

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `Jokes | ${data.joke.title}`
  };
};

export async function action({ request, params }: ActionArgs) {
  const [userId, formData] = await Promise.all([
    getUserId(request),
    request.formData()
  ]);
  const action = formData.get('action');

  if (action === 'delete') {
    invariant(params.id, 'params.id is required');
    const joke = await getJokeById(params.id);

    if (joke.author.id !== userId) {
      return json(
        { error: 'You are not authorized to delete this joke' },
        { status: 401 }
      );
    }

    await deleteJoke(params.id);
    return redirect('/jokes');
  }

  if (action === 'like') {
    invariant(params.id, 'params.id is required');
    invariant(userId, 'userId is required');

    const joke = await getJokeById(params.id);

    if (joke.author.id === userId) {
      return json({ error: 'You cannot like your own joke' }, { status: 401 });
    }

    await likeJoke(params.id, userId);
    return null;
  }

  if (action === 'unlike') {
    invariant(params.id, 'params.id is required');
    invariant(userId, 'userId is required');

    const joke = await getJokeById(params.id);

    if (joke.author.id === userId) {
      return json(
        { error: 'You cannot unlike your own joke' },
        { status: 401 }
      );
    }

    const newLikes = joke.likes.filter(like => like !== userId);

    await unlikeJoke(params.id, newLikes);
    return null;
  }

  return null;
}

export async function loader({ params }: LoaderArgs) {
  invariant(params.id, 'params.id is required');
  const joke = await getJokeById(params.id);
  return typedjson({ joke });
}

export default function JokeDetailPage() {
  const user = useOptionalUser();
  const { joke } = useTypedLoaderData<typeof loader>();

  const navigate = useNavigate();
  const location = useLocation();

  const showDeleteButton = user?.id === joke.author.id;
  const showLikeButton = user?.id !== joke.author.id;

  const hasLiked = joke.likes.some(like => like === user?.id);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div className="space-y-4 flex flex-col items-center justify-center h-full">
        <Link to="/jokes">
          <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
        </Link>
        <h1 className="text-2xl">{joke.title}</h1>
        <p>{joke.content}</p>
        <p>Escrito por: @{joke.author.username}</p>
        {showLikeButton && (
          <Form method="post">
            <button
              name="action"
              value={hasLiked ? 'unlike' : 'like'}
              type={
                user && user.username !== joke.author.username
                  ? 'submit'
                  : 'button'
              }
              className={classNames(
                'inline-flex items-center p-3 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black',
                hasLiked
                  ? 'text-white bg-black hover:bg-gray-800 border-transparent'
                  : 'text-black bg-white hover:bg-slate-200'
              )}
              {...(!user
                ? {
                    onClick: () =>
                      navigate(`/login?redirectTo=${location.pathname}`)
                  }
                : {})}
            >
              <HeartIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </Form>
        )}
        {showDeleteButton && (
          <Form method="post">
            <button
              name="action"
              value="delete"
              type="submit"
              className="inline-flex items-center p-3 border border-transparent rounded-full shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <TrashIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </Form>
        )}
      </div>
    </main>
  );
}
