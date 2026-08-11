import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full flex items-center justify-between px-6 py-2 md:px-12 backdrop-blur-md bg-black/30 border-b border-white/10">
      <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
        <Image
          src="/logo.png"
          alt="Frozen Fusion"
          width={300}
          height={110}
          className="h-[72px] md:h-20 w-auto object-contain"
          priority
          fetchPriority="high"
        />
      </Link>
      <Link 
        href="/products"
        className="rounded-full bg-white/10 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-[#e12d6a] hover:shadow-[0_0_20px_rgba(225,45,106,0.6)] cursor-pointer border border-white/20 inline-flex items-center justify-center"
      >
        Discover
      </Link>
    </nav>
  );
}
