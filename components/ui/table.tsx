import type { ReactNode } from 'react'

export function Table({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <table className={`w-full text-left border-collapse ${className}`}>{children}</table>
}

export function TableHead({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <thead className={className}>{children}</thead>
}

export function TableBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <tbody className={className}>{children}</tbody>
}

export function TableRow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <tr className={className}>{children}</tr>
}

export function TableHeadCell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <th className={`px-4 py-2 font-semibold text-sm text-gray-700 dark:text-gray-300 ${className}`}>{children}</th>
}

export function TableCell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-2 text-sm text-gray-700 dark:text-gray-300 ${className}`}>{children}</td>
}