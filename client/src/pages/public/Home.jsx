import { useState } from "react";
import "../../app/App.css";
import "../../services/jobs.service.js"
import "../public/Jobs.jsx"


const JOBS = [
  {
    id: 1,
    title: "Product Designer",
    company: "Northwind",
    location: "Remote",
    type: "Full-time",
    salary: "$85k – $110k",
    tags: ["design", "figma", "product"],
    color: "#2f5bff",
  },
  {
    id: 2,
    title: "Frontend Engineer",
    company: "Brightpath",
    location: "London",
    type: "Full-time",
    salary: "£60k – £80k",
    tags: ["engineering", "react", "javascript"],
    color: "#0f8b6d",
  },
  {
    id: 3,
    title: "Marketing Manager",
    company: "Kestrel Foods",
    location: "Berlin",
    type: "Full-time",
    salary: "€55k – €70k",
    tags: ["marketing", "brand", "growth"],
    color: "#d6541f",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Lumen Health",
    location: "Toronto",
    type: "Contract",
    salary: "$45 – $60 / hr",
    tags: ["engineering", "data", "sql"],
    color: "#7a3fd1",
  },
  {
    id: 5,
    title: "Account Executive",
    company: "Cargo & Co",
    location: "Dubai",
    type: "Full-time",
    salary: "$70k – $95k + commission",
    tags: ["sales", "b2b"],
    color: "#b8860b",
  },
  {
    id: 6,
    title: "Finance Associate",
    company: "Harbor Capital",
    location: "Remote",
    type: "Part-time",
    salary: "$30 – $42 / hr",
    tags: ["finance", "accounting"],
    color: "#1c6ea4",
  },
];

const CATEGORIES = ["Design", "Engineering", "Marketing", "Sales", "Finance"];

const MATCHES = [
  { role: "Product Designer", company: "Northwind", score: 94 },
  { role: "UX Researcher", company: "Lumen Health", score: 88 },
  { role: "Design Lead", company: "Brightpath", score: 81 },
];

const STEPS = [
  {
    title: "Build your profile",
    text: "Add your experience, skills and the kind of work you want. It takes about five minutes.",
  },
  {
    title: "Get matched",
    text: "We rank open roles by how well they fit you, so the best ones come first.",
  },
  {
    title: "Apply in one click",
    text: "Send your profile to the employer and track every application in one place.",
  },
];

function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <a className="logo" href="#top" aria-label="Shortlist home">
          <span className="logo__mark" aria-hidden="true" />
          RecruitHub
        </a>
        <nav className="nav" aria-label="Main">
          <a href="#jobs">Find jobs</a>
          <a href="#how">How it works</a>
          <a href="#employers">For employers</a>
        </nav>
        <div className="header__actions">
          <a className="link" href="#signin">
            Sign in
          </a>
          <a className="btn btn--dark" href="#post">
            Post a job
          </a>
        </div>
      </div>
    </header>
  );
}

function SearchForm({ onSearch, keyword, setKeyword, location, setLocation }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <label className="search__field">
        <span className="search__label">Job title or skill</span>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. Designer"
        />
      </label>
      <label className="search__field">
        <span className="search__label">Location</span>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City or Remote"
        />
      </label>
      <button className="btn btn--accent search__submit" type="submit">
        Search jobs
      </button>
    </form>
  );
}

function MatchPanel() {
  return (
    <aside className="matches" aria-label="Example of matched jobs">
      <p className="matches__title">Your top matches</p>
      <ul className="matches__list">
        {MATCHES.map((m) => (
          <li className="match" key={m.role}>
            <div>
              <p className="match__role">{m.role}</p>
              <p className="match__company">{m.company}</p>
            </div>
            <div
              className="ring"
              style={{ "--target": m.score }}
              role="img"
              aria-label={`${m.score} percent match`}
            >
              <span className="ring__value">{m.score}%</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function JobRow({ job }) {
  return (
    <li className="job">
      <div className="job__logo" style={{ background: job.color }} aria-hidden="true">
        {job.company[0]}
      </div>
      <div className="job__main">
        <h3 className="job__title">{job.title}</h3>
        <p className="job__company">{job.company}</p>
      </div>
      <p className="job__meta">
        {job.location}
        <span>{job.type}</span>
      </p>
      <p className="job__salary">{job.salary}</p>
      <a className="btn btn--outline job__apply" href={`#apply-${job.id}`}>
        View job
      </a>
    </li>
  );
}

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [applied, setApplied] = useState({ keyword: "", location: "" });

  const runSearch = () => setApplied({ keyword: keyword.trim(), location: location.trim() });

  const pickCategory = (name) => {
    setKeyword(name);
    setApplied({ keyword: name, location: location.trim() });
  };

  const clearSearch = () => {
    setKeyword("");
    setLocation("");
    setApplied({ keyword: "", location: "" });
  };

  const results = JOBS.filter((job) => {
    const k = applied.keyword.toLowerCase();
    const l = applied.location.toLowerCase();
    const haystack = [job.title, job.company, ...job.tags].join(" ").toLowerCase();
    return (!k || haystack.includes(k)) && (!l || job.location.toLowerCase().includes(l));
  });

  const isFiltered = applied.keyword || applied.location;

  return (
    <div className="page" id="top">
      <Header />

      <main>
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__copy">
              <h1 className="hero__title">Good jobs, matched to the people who fit them.</h1>
              <p className="hero__lead">
                Search thousands of open roles, or post a job and get a shortlist of qualified
                candidates within days.
              </p>

              <SearchForm
                onSearch={runSearch}
                keyword={keyword}
                setKeyword={setKeyword}
                location={location}
                setLocation={setLocation}
              />

              <div className="chips">
                <span className="chips__label">Popular:</span>
                {CATEGORIES.map((c) => (
                  <button className="chip" type="button" key={c} onClick={() => pickCategory(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <MatchPanel />
          </div>
        </section>

        <section className="section" id="jobs">
          <div className="container">
            <div className="section__head">
              <h2 className="section__title">
                {isFiltered ? `${results.length} matching jobs` : "Latest jobs"}
              </h2>
              {isFiltered && (
                <button className="link link--button" type="button" onClick={clearSearch}>
                  Clear search
                </button>
              )}
            </div>

            {results.length > 0 ? (
              <ul className="jobs">
                {results.map((job) => (
                  <JobRow key={job.id} job={job} />
                ))}
              </ul>
            ) : (
              <div className="empty">
                <p className="empty__title">No jobs match your search.</p>
                <p className="empty__text">
                  Try a broader keyword or remove the location to see more roles.
                </p>
                <button className="btn btn--outline" type="button" onClick={clearSearch}>
                  Show all jobs
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="section section--tint" id="how">
          <div className="container">
            <h2 className="section__title">How it works</h2>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li className="step" key={s.title}>
                  <span className="step__number">{i + 1}</span>
                  <h3 className="step__title">{s.title}</h3>
                  <p className="step__text">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" id="employers">
          <div className="container">
            <div className="cta">
              <div>
                <h2 className="cta__title">Hiring? Get a shortlist in days, not weeks.</h2>
                <p className="cta__text">
                  Post your role once. We show it to candidates who already match your
                  requirements.
                </p>
              </div>
              <a className="btn btn--amber" href="#post">
                Post a job
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <p>© {new Date().getFullYear()} REcruithub</p>
          <nav aria-label="Footer">
            <a href="#about">About</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}