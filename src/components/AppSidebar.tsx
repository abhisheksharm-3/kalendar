import { RiLogoutBoxRLine, RiSettings3Line, RiUserLine } from "@remixicon/react";
import { SettingsDialog } from "./Settings";
import { Calendar } from "./ui/calendar";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";


interface Link {
    label: string;
    icon: React.ElementType;
    href?: string;
}
const LINKS: Link[] = [
    { label: "Profile", icon: RiUserLine },
    { label: "Settings", icon: RiSettings3Line },
    { label: "Logout", icon: RiLogoutBoxRLine },
];

interface AppSidebarProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    date: Date;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
  }

  const Logo: React.FC = () => (
    <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <Image src="/logo.png" alt="Logo" width={170} height={100} />
    </Link>
  );

const AppSidebar: React.FC<AppSidebarProps> = ({ open, setOpen, date, setDate }) => (
    <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto">
                <Logo />
                <div className="mt-8 flex flex-col gap-2">
                    <div className="hidden md:block">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate: Date | undefined) => newDate && setDate(newDate)}
                            className="rounded-md border"
                        />
                    </div>
                    <SettingsDialog />
                    {LINKS.map((link, idx) => (
                        <SidebarLink
                            key={idx}
                            link={{
                                ...link,
                                href: "#",
                                icon: <link.icon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
                            }}
                        />
                    ))}
                </div>
            </div>
            <SidebarLink
                link={{
                    label: "User",
                    href: "#",
                    icon: <RiUserLine className="text-neutral-700 dark:text-neutral-200 h-7 w-7 flex-shrink-0" />,
                }}
            />
        </SidebarBody>
    </Sidebar>
);
export default AppSidebar;