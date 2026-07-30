import Link from "next/link";
import { InstagramIcon, XIcon, FacebookIcon, YoutubeIcon } from "@/components/ui/Icons";

export default function Footer() {
  return (
    <footer className="bg-zyro-black pt-[70px] text-[#aeb4bd]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-9 border-b border-[#232323] pb-12 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="mb-3.5 flex items-center gap-2.5 font-display text-2xl text-white">
              <span className="stripe" />
              ZYROFIT
            </div>
            <p className="max-w-[280px] text-[13.5px] leading-relaxed">
              Premium sports apparel, gym wear, training accessories and fitness gear — engineered for athletes who
              train with intent.
            </p>
            <div className="mt-4.5 flex gap-2.5">
              {[
                { Icon: InstagramIcon, label: "Instagram" },
                { Icon: XIcon, label: "X / Twitter" },
                { Icon: FacebookIcon, label: "Facebook" },
                { Icon: YoutubeIcon, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#333] transition-colors hover:border-zyro-green hover:bg-zyro-green hover:text-black"
                >
                  <Icon className="h-[15px] w-[15px]" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Shop"
            links={[
              { href: "/shop?category=shirts", label: "Sports Shirts" },
              { href: "/shop?category=shorts", label: "Training Shorts" },
              { href: "/shop?category=bags", label: "Sports Bags" },
              { href: "/shop?category=gym", label: "Gym Wear" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
              { href: "/dashboard", label: "My Account" },
              { href: "/contact", label: "Wholesale" },
            ]}
          />
          <FooterCol
            title="Support"
            links={[
              { href: "/contact", label: "Shipping Info" },
              { href: "/contact", label: "Returns & Exchanges" },
              { href: "/shop", label: "Size Guide" },
              { href: "/contact", label: "FAQs" },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 py-5.5 text-xs">
          <span>© {new Date().getFullYear()} ZyroFit. All rights reserved.</span>
          <div className="flex gap-2">
            {["VISA", "MC", "AMEX", "PAYPAL"].map((p) => (
              <span key={p} className="rounded border border-[#333] px-2 py-1 font-mono-ui text-[10px]">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mb-4.5 font-mono-ui text-[13px] uppercase tracking-wider text-white">{title}</h4>
      {links.map((l) => (
        <Link key={l.label} href={l.href} className="block py-1.5 text-[13.5px] transition-colors hover:text-zyro-green">
          {l.label}
        </Link>
      ))}
    </div>
  );
}
