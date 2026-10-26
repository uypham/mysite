import websiteBuildingIcon from "./icons/website-building.png";
import advertisementSupportingIcon from "./icons/advertisement-supporting.png";
import codingFreelancerIcon from "./icons/coding-freelancer.png";
import findingResourcesIcon from "./icons/finding-resources.png";

const SKILLS = [
  "14+ years of expertise developing web applications using HTML5, CSS3, and JavaScript.",
  "Good expertise with JavaScript frameworks/libraries such as ReactJS, NextJS, Gatsby, etc.",
  "Experience with AI models such as ChatGPT 4.0o and Gemini, among others.",
  "Experience with JSON-based RESTful APIs and headless ideas.",
  "Experience with PHP, NodeJs, C#, Laravel, CodeIgniter, and other programming languages.",
  "Understanding object-oriented programming and design.",
  "Service Design Thinking",
];

const WORKS = [
  {
    title: "Website Building",
    icon: websiteBuildingIcon,
    description:
      "Build small and medium websites with the latest technologies according to W3C standards",
  },
  {
    title: "Advertisement Supporting",
    icon: advertisementSupportingIcon,
    description: "Support for advertising on Facebook, Google platforms",
  },
  {
    title: "Coding Freelancer",
    icon: codingFreelancerIcon,
    description: "Execute projects on demand based on timeline",
  },
  {
    title: "Finding Resources",
    icon: findingResourcesIcon,
    description: "Support to find members, build teams, projects",
  },
];

export const Home = () => (
  <div id="page">
    <section className="section">
      <div className="container">
        <div className="avatar shadow">
          <img
            src="/images/avatar.jpeg"
            width="500"
            height="500"
            alt="Uy's face"
            title="Uy's avatar"
          />
        </div>
        <h1 className="title lg">
          <span>Hi, I'm Uy</span> - <br />a developer from Ho Chi Minh City.
        </h1>
        <ul className="list">
          {SKILLS.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    </section>
    <section className="section my-work">
      <div className="container">
        <h2 className="title">
          <span>My works</span> will be here.
        </h2>
        <div className="flex">
          {WORKS.map((work) => (
            <article key={work.title} className="card white split-4">
              <img
                width="42"
                height="42"
                alt={work.title}
                title={work.title}
                src={work.icon}
              />
              <h3>{work.title}</h3>
              <p>{work.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
    <section className="section white gap bottom">
      <div className="container">
        <h2 className="title mb">
          <span>Get in touch</span> at{" "}
          <a href="mailto:uyphamvuong@gmail.com">uyphamvuong@gmail.com</a>
          <br />
          or <a href="tel:+84934770926">+84934770926</a> or{" "}
          <a
            href="https://www.linkedin.com/in/uypham/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>{" "}
          or{" "}
          <a href="/uy-vcard.vcf" download className="vcard">
            +Add To Contact
          </a>
        </h2>
      </div>
    </section>
  </div>
);
