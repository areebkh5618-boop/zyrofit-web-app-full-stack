import ContactForm from "@/components/ui/ContactForm";
import { MailIcon, PhoneIcon, PinIcon, InstagramIcon, XIcon, FacebookIcon, YoutubeIcon } from "@/components/ui/Icons";

export default function ContactPage() {
  return (
    <>
      <div className="bg-zyro-black py-12 text-white md:py-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="mb-3.5 flex items-center gap-2 font-mono-ui text-xs uppercase tracking-wider text-[#9aa3af]">
            Home <span className="text-zyro-green">/</span> Contact
          </div>
          <h1 className="font-display text-[clamp(40px,6vw,64px)]">Get In Touch</h1>
        </div>
      </div>

      <section className="mx-auto max-w-[1280px] px-6 py-16 md:py-[88px] lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="eyebrow mb-3.5">
              <span className="stripe" /> Send A Message
            </div>
            <h2 className="font-display mb-5.5 text-[34px]">We Read Every Message</h2>
            <ContactForm />
          </div>

          <div>
            <div className="rounded-2xl bg-zyro-black p-9 text-white">
              <ContactRow Icon={MailIcon} title="Email Support" value="support@zyrofit.com" />
              <ContactRow Icon={PhoneIcon} title="Phone" value="+1 (800) 555-0199" />
              <ContactRow Icon={PinIcon} title="Studio" value="410 Trailhead Ave, Austin, TX" last />
            </div>

            <div className="mt-6">
              <div className="eyebrow mb-3.5">
                <span className="stripe" /> Follow The Movement
              </div>
              <div className="flex gap-2.5">
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
  last,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className={`flex gap-4 py-4.5 ${last ? "" : "border-b border-[#262626]"}`}>
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#1b1b1b]">
        <Icon className="h-[18px] w-[18px] text-zyro-green" />
      </div>
      <div>
        <b className="mb-0.5 block text-[13px]">{title}</b>
        <span className="text-[13px] text-[#aeb4bd]">{value}</span>
      </div>
    </div>
  );
}
