import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Head from 'next/head';
import { useState } from 'react';

import Button from '../../components/credits/Button';
import CreditsForm from '../../components/credits/CreditsForm';
import CreditsTable from '../../components/credits/CreditsTable';

/**
 * A page containing student attributes and other account settings.
 */
export default function CreditsPage(): JSX.Element {
  const [openAddCredit, setOpenAddCredit] = useState(false);

  return (
    <main className="mx-auto">
      <Head>
        <title>Nebula - Your credits</title>
      </Head>

      <div className="w-full h-full sm:p-20 bg-white overflow-y-scroll flex flex-col gap-10">
        <h1 className="text-[40px] font-semibold text-[#1C2A6D]">Credits</h1>
        <Button onClick={() => setOpenAddCredit(true)} icon={<AddIcon />} className="w-[150px]">
          Add Credit
        </Button>
        <Modal
          open={openAddCredit}
          onClose={() => setOpenAddCredit(false)}
          className="flex items-center justify-center"
        >
          <div className="p-20 w-full sm:max-w-[500px] bg-white rounded-lg">
            <CreditsForm />
          </div>
        </Modal>
        <div className="shadow-md rounded-[25px] border-[#EDEFF7] border-[1px] p-20 bg-white max-w-[1000px]">
          <CreditsTable />
        </div>
      </div>
    </main>
  );
}
