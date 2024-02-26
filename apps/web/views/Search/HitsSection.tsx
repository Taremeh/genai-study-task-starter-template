import { PlatformProduct } from "@enterprise-commerce/core/platform/types"
import Image from "next/image"
import Link from "next/link"

interface HitsSectionProps {
  hits: PlatformProduct[]
}

export async function HitsSection({ hits }: HitsSectionProps) {
  return (
    <div className="grid w-full grid-cols-[repeat(_auto-fill,minmax(280px,1fr)_)] items-start gap-4 gap-y-8">
      {hits.map((singleResult, idx) => (
        <div className="group relative" key={singleResult.id}>
          <div className="relative flex min-h-[320px] items-center justify-center bg-gray-100">
            <Image
              alt={singleResult.featuredImage?.altText || ""}
              className="z-10 size-[250px] object-contain transition-transform group-hover:scale-105"
              height={250}
              src={singleResult.images[0].url}
              sizes="280px"
              width={250}
              priority={[0, 1].includes(idx)}
            />
          </div>

          <Link className="absolute inset-0 z-10" href={`/products/${singleResult.handle}`}>
            <span className="sr-only">View</span>
          </Link>

          <div className="mt-4 flex flex-col gap-0.5 text-slate-700">
            <div className="line-clamp-2 text-[19px]">{singleResult.title}</div>
            <p className="text-[23px]">${singleResult.minPrice || 1337}</p>
          </div>
        </div>
      ))}
    </div>
  )
}