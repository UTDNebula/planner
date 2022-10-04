import Head from 'next/head';

import CreditsForm from '../../components/credits/CreditsForm';
import CreditsTable from '../../components/credits/CreditsTable';

/**
 * A page containing student attributes and other account settings.
 */
export default function CreditsPage(): JSX.Element {
  return (
    <main className="mx-auto">
      <Head>
        <title>Nebula - Your credits</title>
      </Head>
      <div className="text-white flex flex-col lg:grid lg:grid-cols-2 sm:px-10 lg:px-20 py-10 gap-10 w-full lg:w-auto overflow-y-scroll">
        <div className="p-20 bg-white rounded-lg">
          <CreditsForm />
        </div>
        <div className="p-20 bg-white rounded-lg">
          <CreditsTable />
        </div>
      </div>
    </main>
  );
}
