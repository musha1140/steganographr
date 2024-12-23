import Link from 'next/link'

const NavIcon = ({ d }: { d: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-neutral-900 border-b border-neutral-800 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-white hover:text-neutral-300">
          <NavIcon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <span className="text-lg font-bold">GSL</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link href="/demo" className="flex items-center space-x-2 text-white hover:text-neutral-300">
            <NavIcon d="M5 3l14 9-14 9V3z" />
            <span>Demo</span>
          </Link>
          <Link href="/scanner" className="flex items-center space-x-2 text-white hover:text-neutral-300">
            <NavIcon d="M7 2H17M7 22H17M2 12H4M20 12H22M12 2V4M12 20V22M15.5355 8.46447L17.6569 6.34315M6.34315 17.6569L8.46447 15.5355M15.5355 15.5355L17.6569 17.6569M6.34315 6.34315L8.46447 8.46447" />
            <span>Scanner</span>
          </Link>
          <Link href="/settings" className="flex items-center space-x-2 text-white hover:text-neutral-300">
            <NavIcon d="M12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 0v3m0-18v3m-9 9h3m15 0h-3m-3.636-8.364l-2.121 2.121m11.314 11.314l-2.121-2.121m0-11.314l2.121 2.121M5.636 19.364l2.121-2.121" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

