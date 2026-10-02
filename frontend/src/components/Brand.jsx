import { Link } from 'react-router-dom';
import logo from '../assets/Group.svg';

export default function Brand({ compact = false }) {
  return (
    <Link
      to="/"
      className={`brand-logo ${compact ? 'brand-logo-compact' : ''}`}
      aria-label="Roxiler Store Rating"
    >
      <img src={logo} alt="Roxiler" className="brand-logo-image" />
    </Link>
  );
}
