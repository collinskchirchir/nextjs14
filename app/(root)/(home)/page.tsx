import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className='flex p-1'>
      <UserButton afterSignOutUrl='/' />
      <h2>Home</h2>
    </div>
  );
}
