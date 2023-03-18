import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  getDataFromLocalStorage,
  setDataToLocalStorage,
} from '../service/localStorage';
import { requestIfNeeded } from '../service/charcterCache';

import { http } from '../service/http';
import { isNull, isObject } from 'lodash';

import { isExpired } from '../service/timeUtils';

import { urlGenerator } from '../service/urlGenerator';

const storageKey = 'characters';

export default function CharactersInfo() {
  const [character, setCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  // const [searchParams] = useSearchParams();
  const characterId = location.state.id;

  const getCharacterInfo = useCallback(() => {
    setIsLoading(true);

    const url = urlGenerator({
      urlPath: '/api/people/' + characterId,
    });

    const callbacks = {
      onSuccess: response => {
        const characterData = response?.data;
        setCharacter(characterData);
        setIsLoading(false);
        const cachedCharacters = getDataFromLocalStorage(storageKey) ?? {};
        cachedCharacters[characterId] = [characterData, new Date().getTime()];
        setDataToLocalStorage(storageKey, cachedCharacters);
        toast.success(`Character Info has loaded successfully.`, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
      onError: error => {
        setIsLoading(false);
        toast.error(`error ${error.message ?? ''} has occurred`, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      },
    };

    http.get(url, callbacks);
  }, [characterId]);

  const handleRefresh = () => {
    const storageKey = 'characters';
    requestIfNeeded(
      storageKey,
      characterId,
      {
        onRequest: getCharacterInfo,
        onUseCache: cachedData => {
          setCharacter(cachedData[characterId][0]);
        },
      },
      cachedData => {
        return isExpired(cachedData[characterId][1], new Date().getTime(), 15);
      }
    );
  };

  useEffect(() => {
    requestIfNeeded(
      storageKey,
      characterId,
      {
        onRequest: getCharacterInfo,
        onUseCache: cachedData => {
          setCharacter(cachedData[characterId][0]);
        },
      },
      cachedData => {
        return isExpired(cachedData[characterId][1], new Date().getTime(), 15);
      }
    );
  }, [characterId, getCharacterInfo]);

  return (
    <div className='characters-info p-5'>
      <h1>Character Info</h1>
      {isLoading && <div> Loading ...</div>}
      {!isLoading && isNull(character) && (
        <div className='d-flex flex-column bg-light rounded-4 justify-content-center align-items-center p-5 h-100'>
          <div className='mb-5 fs-3 fw-bold text-danger'>
            No Character Data Received
          </div>
          <div
            className='button bg-primary p-2 text-center rounded-2 text-white'
            onClick={handleRefresh}
            style={{
              width: '100px',
            }}
          >
            Retry
          </div>
        </div>
      )}
      {isObject(character) && (
        <table>
          <thead>
            <tr>
              <th>Specification</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              {/* <td>{searchParams.get('name')}</td> */}
              <td>{character.name}</td>
            </tr>
            <tr>
              <td>Height</td>
              {/* <td>{searchParams.get('height')}</td> */}
              <td>{character.height}</td>
            </tr>
            <tr>
              <td>Hair Color</td>
              {/* <td>{searchParams.get('hair_color')}</td> */}
              <td>{character.hair_color}</td>
            </tr>
            <tr>
              <td>Skin Color</td>
              {/* <td>{searchParams.get('skin_color')}</td> */}
              <td>{character.skin_color}</td>
            </tr>
            <tr>
              <td>Eye Color</td>
              {/* <td>{searchParams.get('eye_color')}</td> */}
              <td>{character.eye_color}</td>
            </tr>
            <tr>
              <td>Birth Year</td>
              {/* <td>{searchParams.get('birth_year')}</td> */}
              <td>{character.birth_year}</td>
            </tr>
          </tbody>
        </table>
      )}

      <div className='character-info-segment'></div>
    </div>
  );
}
