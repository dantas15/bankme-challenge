import Link from 'next/link';

export default function Home() {
  return (
    <main className="">
      <h1 className="text-xl mb-4">Bankme challenge</h1>
      <div className="">
        <p>
          In order to start creating and managing assignors and payables you
          must access{' '}
          <Link
            href="/dashboard"
            className="underline decoration-primary decoration-2"
          >
            /dashboard
          </Link>
          .
        </p>
        <p>
          You&apos;ll be redirected to{' '}
          <Link
            href="/login"
            className="underline decoration-primary decoration-2"
          >
            /login
          </Link>{' '}
          if you&apos;re not logged in yet!
        </p>
      </div>
    </main>
  );
}
