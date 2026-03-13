import Image from 'next/image'

interface VyreHeaderProps {
  width?: number
  height?: number
  className?: string
}

export default function VyreHeader({ width = 140.86, height = 55, className }: VyreHeaderProps) {
  return (
    <Image
      src="/assets/VYRE.svg"
      alt="VYRE"
      width={width}
      height={height}
      className={className}
      priority
    />
  )
}
