import ContactForm from "@/components/ui/ContactForm";
import { MailIcon, PhoneIcon, PinIcon, InstagramIcon, XIcon, FacebookIcon, YoutubeIcon } from "@/components/ui/Icons";

export default function ContactPage() {
  return (
    <>
      <div className="border-b border-[var(--line-c)] bg-[var(--bg-alt)]">
        <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
          <div className="mb-2 flex flex-wrap items-center gap-2 font-mono-ui text-xs uppercase tracking-wider text-[#9aa3af]">
            Home <span className="text-zyro-blue">/</span> Contact
          </div>
          <h1 className="font-display text-[clamp(32px,8vw,64px)] leading-none">Get In Touch</h1>
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-16 md:py-[88px] lg:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="min-w-0">
            <div className="eyebrow mb-3.5">
              <span className="stripe" /> Send A Message
            </div>
            <h2 className="font-display mb-5.5 text-[clamp(26px,5vw,34px)]">We Read Every Message</h2>
            <ContactForm />
          </div>

          <div className="min-w-0">
            <div className="rounded-2xl bg-zyro-black p-6 text-white sm:p-9">
              <ContactRow
                Icon={MailIcon}
                title="Email"
                value="areebkh5618@gmail.com"
                href="mailto:areebkh5618@gmail.com"
              />
              <ContactRow
                Icon={PhoneIcon}
                title="Phone / WhatsApp"
                value="0326 5210997"
                href="tel:+923265210997"
              />
              <ContactRow Icon={PinIcon} title="Support" value="Orders, returns & product questions" last />
            </div>

            <div className="mt-6">
              <div className="eyebrow mb-3.5">
                <span className="stripe" /> Follow The Movement
              </div>
              <div className="flex flex-wrap gap-2.5">
                {[InstagramIcon, XIcon, FacebookIcon, YoutubeIcon].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-c)] transition-colors hover:border-zyro-blue hover:text-zyro-blue"
                  >
                    <Icon className="h-[15px] w-[15px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  Icon,
  title,
  value,
  href,
  last,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  href?: string;
  last?: boolean;
}) {
  const inner = (
    <>
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#1b1b1b]">
        <Icon className="h-[18px] w-[18px] text-zyro-blue" />
      </div>
      <div className="min-w-0">
        <b className="mb-0.5 block text-[13px]">{title}</b>
        <span className="break-all text-[13px] text-[#aeb4bd]">{value}</span>
      </div>
    </>
  );

  return (
    <div className={`flex gap-4 py-4.5 ${last ? "" : "border-b border-[#262626]"}`}>
      {href ? (
        <a href={href} className="flex w-full gap-4 transition-opacity hover:opacity-80">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
