import { useEffect } from "react";

export const Bio = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "https://uypham.com";
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h1 className="title lg">Bio</h1>
        <h2 className="title">
          <span>Page</span> redirecting...
        </h2>
        <h2>
          or{" "}
          <a href="/uy-vcard.vcf" download className="vcard">
            +Add To Contact
          </a>
        </h2>
      </div>
    </section>
  );
};
