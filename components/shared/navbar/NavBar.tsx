import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';
import Theme from '@/components/shared/navbar/Theme';
import MobileNav from '@/components/shared/navbar/MobileNav';
import GlobalSearch from '@/components/shared/search/GlobalSearch';

export default function NavBar() {
  return (
    <nav className='flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 sm:px-12 dark:shadow-none'>
      <Link href='/' className='flex items-center gap-1'>
        <Image
          src='/assets/images/site-logo.svg'
          alt='DevFlow'
          width={23}
          height={23}
        />
        <p className='h2-bold text-dark100_light900 font-spaceGrotesk max-sm:hidden dark:text-light-900'>
          Dev<span className='text-primary-500'>Exchange</span>
        </p>
      </Link>
      <GlobalSearch />
      <div className='flex-between gap-5'>
        <Theme />
        <SignedIn>
          <UserButton
            afterSignOutUrl='/'
            appearance={{
              elements: {
                avatarBox: 'h-10 w-10',
              },
              variables: {
                colorPrimary: '#ff7000',
              },
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
}
