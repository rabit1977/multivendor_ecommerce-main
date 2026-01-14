// React, Next.js
import { FC } from 'react';

// Clerk
import { currentUser } from '@clerk/nextjs/server';

// Custom Ui Components
import Logo from '@/components/shared/logo';
import SidebarNavAdmin from './nav-admin';
import SidebarNavSeller from './nav-seller';
import UserInfo from './user-info';

// Menu links
import {
  SellerDashboardSidebarOptions,
  adminDashboardSidebarOptions,
} from '@/constants/data';

// Prisma models
import { Store } from '@prisma/client';
import StoreSwitcher from './store-switcher';

interface SidebarProps {
  isAdmin?: boolean;
  stores?: Store[];
}

const Sidebar: FC<SidebarProps> = async ({ isAdmin, stores }) => {
  const user = await currentUser();

  // Serialize user object to plain object for client component
  const serializedUser = user ? JSON.parse(JSON.stringify(user)) : null;

  return (
    <div className='w-[300px] border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0'>
      <Logo width='100%' height='180px' />
      <span className='mt-3' />
      {serializedUser && <UserInfo user={serializedUser} />}
      {!isAdmin && stores && <StoreSwitcher stores={stores} />}
      {isAdmin ? (
        <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />
      ) : (
        <SidebarNavSeller menuLinks={SellerDashboardSidebarOptions} />
      )}
    </div>
  );
};

export default Sidebar;
