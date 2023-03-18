import './Sidebar.css';

import MenuItem from '../../menu-items/MenuItem';

import { sidebarLinks } from '../../../config/sidebarLinks';

function Sidebar() {
  return (
    <div className='sidebar bg-black w-25'>
      <div className='links mb-5'>
        {sidebarLinks.map((sidebarLink, i) => {
          const key = i;
          return <MenuItem key={key} {...sidebarLink} />;
        })}
      </div>
      <div
        className='posters-segment d-grid'
        style={{ gridTemplateColumns: 'repeat(2,1fr)', gap: '15px' }}
      >
        <div className='image-box mb-2 rounded-2 overflow-hidden border border-light'>
          <img className='w-100' src='pics/poster-1.jpg' alt='Poster 1' />
        </div>
        <div className='image-box mb-2 rounded-2 overflow-hidden border border-light'>
          <img className='w-100' src='pics/poster-2.jpg' alt='Poster 2' />
        </div>
        <div className='image-box mb-2 rounded-2 overflow-hidden border border-light'>
          <img className='w-100' src='pics/poster-3.jpg' alt='Poster 3' />
        </div>
        <div className='image-box mb-2 rounded-2 overflow-hidden border border-light'>
          <img className='w-100' src='pics/poster-4.jpg' alt='Poster 4' />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
