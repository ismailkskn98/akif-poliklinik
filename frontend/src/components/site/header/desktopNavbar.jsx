import { Link } from "@/i18n/navigation";

export default function DesktopNavbar({ hasAuthorizationDocument, labels }) {
  return (
    <nav aria-label={labels.ariaLabel} className="hidden items-center lg:flex">
      <Link className="nav-link" href="/">
        {labels.home}
      </Link>
      <Link className="nav-link" href="/doctors">
        {labels.doctors}
      </Link>
      <Link className="nav-link" href="/privacy-notice">
        {labels.privacy}
      </Link>
      {hasAuthorizationDocument ? (
        <Link className="nav-link" href="/authorization-document">
          {labels.authorization}
        </Link>
      ) : null}
    </nav>
  );
}
