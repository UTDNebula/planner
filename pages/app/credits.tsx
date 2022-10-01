import Head from 'next/head';

import CreditsForm from '../../components/credits/CreditsForm';
import CreditsList from '../../components/credits/CreditsList';

/**
 * A page containing student attributes and other account settings.
 */
export default function CreditsPage(): JSX.Element {
  return (
    <main className="mx-auto">
      <Head>
        <title>Nebula - Your credits</title>
      </Head>
      <div
        className="max-w-6xl text-white flex flex-col px-20 py-10 gap-10"
        style={{ overflowY: 'scroll' }}
      >
        <CreditsForm />
        <CreditsList />
      </div>
    </main>
  );
}
