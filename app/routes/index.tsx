import { Link } from '@remix-run/react';

export default function IndexRoute() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center h-full justify-center">
      <span className="text-9xl mb-10">🤪</span>
      <Link to="/jokes" className="text-2xl underline">
        Entrar al app
      </Link>
    </main>
  );
}
