import { Link } from 'react-router-dom';

import './MenuItem.css';

function MenuItem(props) {
  const { label, path } = props;
  return (
    <Link
      className='menu-item d-flex justify-content-center align-items-center bg-white text-black fw-bold rounded-1 text-decoration-none'
      to={path}
    >
      {label}
    </Link>
  );
}

export default MenuItem;
