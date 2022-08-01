import { PlusSmIcon } from '@heroicons/react/solid';
import { Link, Form } from '@remix-run/react';
import { useOptionalUser } from '~/utils/auth';

export function Navbar() {
  const user = useOptionalUser();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-4xl">🤪</span>
            {user && (
              <p>
                Hola <span className="font-semibold">@{user?.username}</span>
              </p>
            )}
          </div>
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  <PlusSmIcon
                    className="-ml-1 mr-1 h-5 w-5"
                    aria-hidden="true"
                  />
                  <span>Agregar chiste</span>
                </button>
                <Form action="/logout" method="post">
                  <button className="underline">Cerrar sesión</button>
                </Form>
              </div>
            ) : (
              <Link to="/login" className="font-semibold">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
