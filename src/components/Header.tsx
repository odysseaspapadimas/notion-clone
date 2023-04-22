import { Avatar, Container, Divider, Group, Header as MantineHeader, Menu } from "@mantine/core";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const Header = () => {

  const { data: session } = useSession();

  const [opened, setOpened] = useState(false);
  return (
    <MantineHeader height={70}>
      <Container size="lg" className="h-full">
        <Group position="apart" className="h-full">
          <Link href="/">
            <h2 className="font-semibold text-lg">
              Language
            </h2>
          </Link>

          <Menu
            position="bottom-end"
            withArrow
            classNames={{ item: "text-base" }}
          >
            <Menu.Target>
              <div className="cursor-pointer rounded-sm border border-transparent hover:border-primary">
                <Avatar src={session?.user?.image} className="rounded-sm" />
              </div>
            </Menu.Target>
            <Menu.Dropdown className="-translate-x-[8px]">
              {session ? (
                <>
                  <Menu.Item component={Link} href={"/u/"}>
                    <p className="font-semibold text-lg ">
                      {session.user?.name}
                    </p>
                  </Menu.Item>
                  <Divider my="xs" className="" />

                  <Menu.Item disabled={true}>Settings</Menu.Item>

                  <Divider my="xs" labelPosition="center" />
                  <Menu.Item onClick={() => void signOut()}>Sign-out</Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Item
                    onClick={() => {
                      setOpened(true);
                      void signIn();
                    }}
                  >
                    Sign-in
                  </Menu.Item>
                  <Divider />
                  <Menu.Item
                    onClick={() => {
                      setOpened(true);
                    }}
                  >
                    Sign-up
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
    </MantineHeader>
  )
}
export default Header