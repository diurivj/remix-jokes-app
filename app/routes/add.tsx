import type { ActionArgs, MetaFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { createJoke } from '~/models/jokes.server';
import { getUserId } from '~/session.server';

export const meta: MetaFunction = () => {
  return {
    title: 'Jokes | Agregar chiste'
  };
};

export async function action({ request }: ActionArgs) {
  const [userId, formData] = await Promise.all([
    getUserId(request),
    request.formData()
  ]);

  invariant(userId, 'No user id');

  const title = formData.get('title');
  const content = formData.get('content');

  invariant(typeof title === 'string', 'title must be a string');
  invariant(typeof content === 'string', 'content must be a string');

  await createJoke({ content, title, userId });
  return redirect('/jokes');
}

export default function AddPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <h1 className="text-2xl mb-4">Agregar chiste</h1>

      <Form method="post" className="relative">
        <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-black focus-within:ring-1 focus-within:ring-black">
          <label htmlFor="title" className="sr-only">
            Título
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="block w-full border-0 pt-2.5 text-lg font-medium placeholder-gray-500 focus:ring-0"
            placeholder="Título"
            required
          />

          <label htmlFor="content" className="sr-only">
            Contenido
          </label>
          <textarea
            rows={2}
            name="content"
            id="content"
            className="block w-full border-0 py-0 resize-none placeholder-gray-500 focus:ring-0 sm:text-sm"
            placeholder="Escribe tu chiste aquí..."
            required
          />

          {/* Spacer element to match the height of the toolbar */}
          <div aria-hidden="true">
            <div className="py-2">
              <div className="h-9" />
            </div>
            <div className="h-px" />
            <div className="py-2">
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-px">
          <div className="border-t border-gray-200 px-2 py-2 flex justify-end items-center space-x-3 sm:px-3">
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      </Form>
    </main>
  );
}
