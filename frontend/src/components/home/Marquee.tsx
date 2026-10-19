import Image from 'next/image'

export function Marquee({ images }: { images: { src: string; alt: string; pos?: string }[] }) {
  if (!images.length) return null
  const row = [...images, ...images]
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="flex w-max animate-[marquee_60s_linear_infinite] gap-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row.map((img, i) => (
          <div key={i} className="relative h-56 w-80 shrink-0 overflow-hidden rounded-2xl bg-cream md:h-72 md:w-[26rem]" aria-hidden={i >= images.length}>
            <Image src={img.src} alt={i >= images.length ? '' : img.alt} fill sizes="(max-width:768px) 320px, 420px" className="object-cover" style={{ objectPosition: img.pos }} />
          </div>
        ))}
      </div>
      <style>{`@keyframes marquee{to{transform:translateX(-50%)}}`}</style>
    </div>
  )
}
