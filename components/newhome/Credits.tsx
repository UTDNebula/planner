import AddIcon from '@mui/icons-material/Add';
import Close from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Head from 'next/head';
import { useState } from 'react';

import Button from '../credits/Button';
import CreditsForm from '../credits/CreditsForm';
import CreditsTable from '../credits/CreditsTable';

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

      <div className="w-full min-h-full p-5 lg:p-20 bg-white overflow-y-auto flex flex-col gap-10">
        <h1 className="text-[40px] font-semibold text-[#1C2A6D]">Credits</h1>
        <Button onClick={() => setOpenAddCredit(true)} icon={<AddIcon />} className="w-[140px]">
          Add Credit
        </Button>
        <Modal
          open={openAddCredit}
          onClose={() => setOpenAddCredit(false)}
          className="flex items-center justify-center"
        >
          <div className="p-20 w-full sm:max-w-[500px] bg-white rounded-lg relative">
            <IconButton
              className="absolute right-10 top-10"
              onClick={() => setOpenAddCredit(false)}
            >
              <Close />
            </IconButton>
            <CreditsForm />
          </div>
        </Modal>
        <div className="shadow-md rounded-[25px] border-[#EDEFF7] border-[1px] p-10 lg:p-20 bg-white max-w-[1000px]">
          <CreditsTable />
        </div>
      </div>
    </main>
  );
}
