import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useActionData, useTransition } from '@remix-run/react';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import invariant from 'tiny-invariant';
import { verifyLogin } from '~/models/user.server';
import { classNames } from '~/utils/tailwind';
import { createUserSession } from '~/session.server';

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const username = formData.get('username');
  const password = formData.get('password');

  invariant(typeof username === 'string', 'username must be a string');
  invariant(typeof password === 'string', 'password must be a string');

  const user = await verifyLogin(username, password);

  if (!user) {
    return json({ error: 'Usuario o contraseña incorrectos' }, { status: 400 });
  }

  return createUserSession({
    request,
    userId: user.id,
    redirectTo: '/'
  });
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const transition = useTransition();

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          o{' '}
          <Link to="/signup" className="font-medium underline">
            crea una cuenta nueva
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form className="space-y-6" method="post">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre de usuario
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={classNames(
                    'appearance-none block w-full px-3 py-2 border focus:outline-none sm:text-sm rounded-md shadow-sm',
                    actionData?.error
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 placeholder-gray-400 focus:ring-black focus:border-black'
                  )}
                />
                {actionData?.error && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
              {actionData?.error && (
                <p className="mt-2 text-sm text-red-600" id="username-error">
                  {actionData?.error}
                </p>
              )}
            </div>

            <div>
              <button
                disabled={!!transition.submission}
                type="submit"
                className="disabled:opacity-70 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                {transition.submission
                  ? 'Iniciando sesión...'
                  : 'Iniciar sesión'}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
