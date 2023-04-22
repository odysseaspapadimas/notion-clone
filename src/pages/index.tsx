import { type NextPage } from "next";
import Head from "next/head";

import { api } from "src/utils/api";
import { ActionIcon, Group, Loader, Table } from "@mantine/core";
import { IconLayoutSidebarRight } from "@tabler/icons-react";
import { useState } from "react";
import DrawerPage from "src/components/DrawerPage";
import { useDisclosure } from "@mantine/hooks";
import Page from "src/components/Page";
import { useSession } from "next-auth/react";
import Link from "next/link";

const elements = [
  { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
  { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
  { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
  { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
  { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
];

const Home: NextPage = () => {

  const [selectedItem, setSelectedItem] = useState<typeof elements[0] | null>(null);

  const [opened, handlers] = useDisclosure(false);

  const { data: pages, isLoading: pagesLoading } = api.page.getAll.useQuery();

  //get session 
  const session = useSession();
  console.log(session.data?.user, 'session')


  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-start space-x-4 space-y-4">
        {pagesLoading ? (
          <Loader />
        ) : (
          pages?.map((page) => (
            <Link href={`/${page.id}`} key={page.id}> {page.title}</Link>
          ))
        )}
      </main>

      <DrawerPage item={selectedItem} setSelectedItem={setSelectedItem} opened={opened} handlers={handlers} />
    </>
  );
};

export default Home;