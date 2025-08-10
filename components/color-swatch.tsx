import clsx from 'clsx'

interface ColorSwatchProps {
  color: string
  className?: string
}

/**
 * A small coloured circle used to represent a material colour. It renders
 * a span with a circular shape and the background colour set via
 * inline style.
 */
export default function ColorSwatch({ color, className }: ColorSwatchProps) {
  return <span className={clsx('inline-block rounded-full w-4 h-4', className)} style={{ backgroundColor: color }} />
}