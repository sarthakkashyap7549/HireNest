// Split-screen shell shared by Login and Register: brand panel on large screens, form always.
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-11">
          <div className="card auth-card overflow-hidden">
            <div className="row g-0">
              <aside className="col-lg-5 auth-aside d-none d-lg-flex flex-column justify-content-between p-5">
                <div>
                  <h2 className="display-6 mb-3">One profile. Every application.</h2>
                  <p className="mb-0 opacity-75">
                    Save your details once, search openings by skill or city, and keep track of every job you apply to.
                  </p>
                </div>
                <ul className="list-unstyled mb-0 small">
                  <li className="mb-2"><i className="bi bi-check-circle-fill me-2 accent" aria-hidden="true"></i>Filter by location, type and experience</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill me-2 accent" aria-hidden="true"></i>Apply in one click from your dashboard</li>
                  <li><i className="bi bi-check-circle-fill me-2 accent" aria-hidden="true"></i>Withdraw or review applications any time</li>
                </ul>
              </aside>
              <div className="col-lg-7">
                <div className="p-4 p-md-5">
                  <h1 className="h3 mb-1">{title}</h1>
                  <p className="text-secondary mb-4">{subtitle}</p>
                  {children}
                  <div className="mt-4 text-center text-secondary">{footer}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
