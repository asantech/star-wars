import { createContext, useState } from 'react';

const CharactersContext = createContext();
CharactersContext.displayName = 'CharactersContext';

let initialState = {};

const CharactersProvider = ({ children }) => {
  const [charactersCache, setCharactersCache] = useState(initialState);
  const [totalCharactersCount, setTotalCharactersCount] = useState(0);

  return (
    <CharactersContext.Provider
      value={{
        charactersCache,
        setCharactersCache,
        totalCharactersCount,
        setTotalCharactersCount,
      }}
    >
      {children}
    </CharactersContext.Provider>
  );
};
export { CharactersContext, CharactersProvider };
