import { CURRENT_YEAR } from "../../shared/constants.js";

const CAREER_START_YEAR = 2011;
const YEARS_OF_EXPERIENCE = CURRENT_YEAR - CAREER_START_YEAR;

const EMAIL = "uyphamvuong@gmail.com";
const [EMAIL_USER, EMAIL_DOMAIN] = EMAIL.split("@");
const PHONE = "+84934770926";
const LINKEDIN_URL = "https://www.linkedin.com/in/uypham/";

const SERVICES = [
  {
    id: "websites",
    title: "Websites",
    icon: "/images/home/website-building.png",
    eyebrow: "Build",
    heading: "Websites that feel fast and look sharp.",
    description:
      "Small and medium sites built on modern stacks, standards-first and ready for every screen.",
  },
  {
    id: "ads",
    title: "Ads",
    icon: "/images/home/advertisement-supporting.png",
    eyebrow: "Grow",
    heading: "Ads that reach the right people.",
    description:
      "Setup and tuning for Facebook and Google campaigns, from tracking pixels to landing pages.",
  },
  {
    id: "freelance",
    title: "Freelance",
    icon: "/images/home/coding-freelancer.png",
    eyebrow: "Ship",
    heading: "Projects delivered on your timeline.",
    description:
      "Pick a scope, agree on a date, and get working software with clear updates along the way.",
  },
  {
    id: "teams",
    title: "Teams",
    icon: "/images/home/finding-resources.png",
    eyebrow: "Scale",
    heading: "The right people for the job.",
    description:
      "Help finding developers, shaping teams and kicking off new projects with a solid plan.",
  },
];

const SKILLS = [
  {
    eyebrow: "Experience",
    heading: `${YEARS_OF_EXPERIENCE}+ years on the web.`,
    description: `Crafting web apps with HTML5, CSS3 and JavaScript since ${CAREER_START_YEAR}.`,
    tone: "dark",
  },
  {
    eyebrow: "Frontend",
    heading: "React, Next.js and Gatsby.",
    description: "Modern interfaces that load quickly and stay easy to maintain.",
  },
  {
    eyebrow: "AI",
    heading: "AI built into real products.",
    description: "Hands-on with ChatGPT, Gemini, Claude and friends, from prompt to production.",
    tone: "gradient",
  },
  {
    eyebrow: "Backend",
    heading: "APIs and headless, done right.",
    description: "JSON REST APIs and headless setups that keep content and code apart.",
  },
  {
    eyebrow: "Full stack",
    heading: "Node.js, PHP, Laravel, C#.",
    description: "Comfortable across the stack, including CodeIgniter and other frameworks.",
  },
  {
    eyebrow: "Craft",
    heading: "Design thinking, solid OOP.",
    description: "Service design thinking and object-oriented design behind every decision.",
  },
];

const CONTACTS = [
  {
    label: "Email",
    // Break only before "@" on narrow tiles, never mid-word.
    value: (
      <>
        {EMAIL_USER}
        <wbr />@{EMAIL_DOMAIN}
      </>
    ),
    href: `mailto:${EMAIL}`,
  },
  { label: "Phone", value: PHONE, href: `tel:${PHONE}` },
  { label: "LinkedIn", value: "in/uypham", href: LINKEDIN_URL, external: true },
  { label: "Contact card", value: "Add to contacts", href: "/uy-vcard.vcf", download: true },
];

const PERKS = [
  { tone: "blue", highlight: "Fast replies,", rest: " usually within the same day." },
  { tone: "red", lead: "Pay per project, or ", highlight: "hire me monthly for ongoing work." },
  { tone: "purple", highlight: "Clean, documented code", rest: " any team can pick up." },
  { tone: "green", highlight: "Works on old phones too,", rest: " not just the latest ones." },
];

const ShelfHeading = ({ title, subtitle }) => (
  <h2 className="shelf-heading">
    {title} <span>{subtitle}</span>
  </h2>
);

export const Home = () => (
  <div id="page" className="store">
    <main>
      <header className="hero container">
        <div className="hero-text">
          <h1 className="hero-title">
            Uy Pham. <span>The developer behind web products people love.</span>
          </h1>
          <p className="hero-meta">
            {YEARS_OF_EXPERIENCE} years of craft, based in Ho Chi Minh City.
          </p>
        </div>
        <aside className="hero-aside">
          <img
            className="hero-avatar"
            src="/images/avatar.jpeg"
            width="500"
            height="500"
            alt="Portrait of Uy Pham, web developer in Ho Chi Minh City"
            fetchPriority="high"
          />
          <div className="hero-links">
            <span>Need a hand with your next project?</span>
            <a href={`mailto:${EMAIL}`}>Talk to me ›</a>
            <a href="/uy-vcard.vcf" download>
              Add to contacts ›
            </a>
          </div>
        </aside>
      </header>

      <nav className="chips container" aria-label="Services">
        {SERVICES.map((service) => (
          <a key={service.id} className="chip" href={`#${service.id}`}>
            <img width="52" height="52" alt="" src={service.icon} />
            <span>{service.title}</span>
          </a>
        ))}
        <a className="chip" href="#contact">
          <span className="chip-glyph" aria-hidden="true">
            @
          </span>
          <span>Contact</span>
        </a>
      </nav>

      <section className="shelf">
        <div className="container">
          <ShelfHeading title="The latest." subtitle="What I bring to every project." />
        </div>
        <div className="shelf-scroller">
          {SKILLS.map((skill) => (
            <article key={skill.eyebrow} className={`tile ${skill.tone || ""}`}>
              <p className="eyebrow">{skill.eyebrow}</p>
              <h3>{skill.heading}</h3>
              <p>{skill.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shelf">
        <div className="container">
          <ShelfHeading title="Services." subtitle="Pick what you need, skip what you don't." />
        </div>
        <div className="shelf-scroller">
          {SERVICES.map((service) => (
            <article key={service.id} id={service.id} className="tile service">
              <p className="eyebrow">{service.eyebrow}</p>
              <h3>{service.heading}</h3>
              <p>{service.description}</p>
              <img width="64" height="64" alt="" src={service.icon} />
            </article>
          ))}
        </div>
      </section>

      <section className="shelf">
        <div className="container">
          <ShelfHeading title="The Uy difference." subtitle="Even more reasons to work with me." />
          <div className="perks">
            {PERKS.map((perk) => (
              <p key={perk.highlight} className="perk">
                {perk.lead}
                <span className={perk.tone}>{perk.highlight}</span>
                {perk.rest}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="shelf" id="contact">
        <div className="container">
          <ShelfHeading title="Help is here." subtitle="Whenever and however you need it." />
        </div>
        <div className="shelf-scroller">
          {CONTACTS.map((contact) => (
            <a
              key={contact.label}
              className="tile contact"
              href={contact.href}
              target={contact.external ? "_blank" : undefined}
              rel={contact.external ? "noreferrer" : undefined}
              download={contact.download}
            >
              <p className="eyebrow">{contact.label}</p>
              <h3>{contact.value}</h3>
              <span className="tile-link">Open ›</span>
            </a>
          ))}
        </div>
      </section>
    </main>

    <footer className="footer container">
      © {CURRENT_YEAR} Uy Pham. Made in Ho Chi Minh City.
    </footer>
  </div>
);
