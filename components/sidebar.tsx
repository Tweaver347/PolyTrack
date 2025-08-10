import Link from 'next/link'

/**
 * A simple sidebar for navigating between pages. This component mimics
 * the structure of the v0 prototype but without any interactivity.
 */
export default function Sidebar() {
  return (
    <nav className="w-64 min-h-screen p-4 border-r border-gray-200 dark:border-gray-800">
      <h2 className="mb-4 text-xl font-semibold">PolyTrack</h2>
      <ul className="space-y-2">
        <li>
          <Link className="hover:text-poly-blue" href="/">
            Dashboard
          </Link>
        </li>
        <li>
          <Link className="hover:text-poly-blue" href="/inventory">
            Inventory
          </Link>
        </li>
        <li>
          <Link className="hover:text-poly-blue" href="/machines">
            Machines
          </Link>
        </li>
        <li>
          <Link className="hover:text-poly-blue" href="/storage">
            Storage
          </Link>
        </li>
        <li>
          <Link className="hover:text-poly-blue" href="/logs">
            Logs
          </Link>
        </li>
      </ul>
    </nav>
  )
}