import { Routes, Route } from 'react-router-dom';

import CharactersList from './../pages/CharactersList';
import CharactersInfo from './../pages/CharacterInfo';

import { ROUTES } from '../config/routes';

export default function MainRouter() {
  return (
    <Routes>
      <Route path={ROUTES.CHARACTERS_LIST} element={<CharactersList />} />
      <Route path={ROUTES.CHARACTER_INFO} element={<CharactersInfo />} />
    </Routes>
  );
}
