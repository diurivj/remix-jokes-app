import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import { List } from '~/components/List';
import { Navbar } from '~/components/Navbar';
import { getJokes } from '~/models/jokes.server';
import { useOptionalUser } from '~/utils/auth';

export const meta: MetaFunction = () => {
  return {
    title: 'Jokes | Todos los chistes'
  };
};

export async function loader(_args: LoaderArgs) {
  const jokes = await getJokes();
  return typedjson({ jokes });
}

export default function JokesIndexPage() {
  const { jokes } = useTypedLoaderData<typeof loader>();
  const user = useOptionalUser();

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {jokes.length ? (
          <List jokes={jokes} />
        ) : (
          <>
            <p>No hay chistes agregados aún</p>
            {user ? (
              <Link to="/add" className="underline">
                Agregar un chiste ahora!
              </Link>
            ) : null}
          </>
        )}
      </main>
    </>
  );
}
