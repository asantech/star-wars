import { useState, useEffect, useContext } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import ReactPaginate from 'react-paginate';
import { Eye, ArrowLeft, ArrowRight } from 'react-bootstrap-icons';
import { isObject, pick, has } from 'lodash';

import { tableHeaders } from './CharactersList.table';
import { http } from './../service/http';
import { CharactersContext } from '../components/context/CharactersContext';
import { urlGenerator } from '../service/urlGenerator';
import { pickedCharacterDetails } from '../constants/charactersList';

const characterPerPage = 10;

const PaginatedItems = ({
  characterPerPage,
  setCharacters,
  totalCharactersCount,
  setTotalCharactersCount,
  pageCount, // check later what is it for
  setPageCount,
  charactersCache,
  setCharactersCache,
  setCurrentPage,
  setIsLoading,
  setError,
}) => {
  const handlePageClick = event => {
    const selectedPage = ++event.selected;
    setCurrentPage(selectedPage);

    const url = urlGenerator({
      urlPath: '/api/people',
      queryParams: {
        page: selectedPage,
      },
    });

    if (has(charactersCache, selectedPage)) {
      setCharacters(charactersCache[selectedPage]);
    } else {
      setIsLoading(true);
      const callbacks = {
        onSuccess: response => {
          const count = response?.data?.count;
          const charactersList = response?.data?.results;
          const newCharactersCache = {
            ...charactersCache,
            [selectedPage]: charactersList,
          };
          setCharactersCache(newCharactersCache);
          setCharacters(charactersList);
          setTotalCharactersCount(count);
          setPageCount(Math.ceil(count / characterPerPage));
          setIsLoading(false);
          toast.success(
            `Characters of page ${selectedPage} has loaded successfully.`,
            {
              position: toast.POSITION.BOTTOM_RIGHT,
            }
          );
        },
        onError: error => {
          setError(true);
          setIsLoading(false);
          toast.error(`error ${error.message ?? ''} has occurred`, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        },
      };

      http.get(url, callbacks);
    }
  };

  return (
    <div className='text-center'>
      <ReactPaginate
        breakLabel='...'
        nextLabel={<ArrowRight />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={Math.ceil(totalCharactersCount / characterPerPage)}
        previousLabel={<ArrowLeft />}
        renderOnZeroPageCount={null}
        containerClassName='d-inline-flex p-0 mb-0 list-unstyled'
        pageClassName='w-25px h-25px d-flex justify-content-center p-1 align-items-center bg-black rounded-circle mx-2'
        pageLinkClassName='text-white fw-bold text-decoration-none'
        previousClassName='w-25px h-25px d-flex justify-content-center p-1 align-items-center bg-black rounded-circle mx-2'
        previousLinkClassName='text-white fw-bold text-decoration-none'
        nextClassName='w-25px h-25px d-flex justify-content-center p-1 align-items-center bg-black rounded-circle mx-2'
        nextLinkClassName='text-white fw-bold text-decoration-none'
      />
    </div>
  );
};

function TableCell({ data }) {
  return <td className='table-cell'>{data}</td>;
}

function TableRow({ character }) {
  const navigate = useNavigate();
  const characterId = character.url
    .replace('https://swapi.dev/api/people/', '')
    .replace('/', '');
  const handleRowOnClick = () => {
    navigate(
      '/' + characterId,
      {
        state: {
          id: characterId,
        },
      }
      // {
      //   pathname: '/' + characterId,
      //   search: createSearchParams(character).toString(),
      // }
    );
  };
  return (
    <tr className='table-row' onClick={handleRowOnClick}>
      {Object.entries(pick(character, pickedCharacterDetails)).map(
        ([_, value], i) => {
          const key = i;
          return <TableCell key={key} data={value} />;
        }
      )}
    </tr>
  );
}

export default function CharactersList() {
  const [characters, setCharacters] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState();

  const {
    charactersCache,
    setCharactersCache,
    totalCharactersCount,
    setTotalCharactersCount,
  } = useContext(CharactersContext);

  const url = urlGenerator({
    urlPath: '/api/people',
  });

  const handleRefresh = () => {
    setError(false);
    if (has(charactersCache, currentPage)) {
      setCharacters(charactersCache[currentPage]);
    } else {
      setIsLoading(true);
      const callbacks = {
        onSuccess: response => {
          const count = response?.data?.count;
          const charactersList = response?.data?.results;
          setCharacters(charactersList);
          const newCharactersCache = {
            ...charactersCache,
            [currentPage]: charactersList,
          };
          setCharactersCache(newCharactersCache);
          setTotalCharactersCount(count);
          setIsLoading(false);
          toast.success(
            `Characters of page ${currentPage} has loaded successfully after refreshing.`,
            {
              position: toast.POSITION.BOTTOM_RIGHT,
            }
          );
        },
        onError: error => {
          setError(error);
          setIsLoading(false);
          toast.error(`error ${error.message ?? ''} has occurred`, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        },
      };
      http.get(url, callbacks);
    }
  };

  useEffect(() => {
    if (has(charactersCache, currentPage)) {
      setCharacters(charactersCache[currentPage]);
    } else {
      setIsLoading(true);

      const callbacks = {
        onSuccess: response => {
          const count = response?.data?.count;
          const charactersList = response?.data?.results;
          setCharacters(charactersList);
          const newCharactersCache = {
            ...charactersCache,
            [currentPage]: charactersList,
          };
          setCharactersCache(newCharactersCache);
          setTotalCharactersCount(count);
          setIsLoading(false);
          toast.success(
            `Characters of page ${currentPage} has loaded successfully.`,
            {
              position: toast.POSITION.BOTTOM_RIGHT,
            }
          );
        },
        onError: error => {
          setError(error);
          setIsLoading(false);
          toast.error(`error ${error.message ?? ''} has occurred`, {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        },
      };
      http.get(url, callbacks);
    }
  }, [charactersCache, setCharactersCache, url]);

  const hasError = !isLoading && error;
  const isCharactersLoaded = !isLoading && isObject(characters);

  return (
    <div className='characters-list px-5 py-4'>
      <h1 className='mb-4 fw-bold'>Characters List</h1>
      <div className='table-container mb-4'>
        <table className='table table-striped rounded-2 overflow-hidden'>
          <thead className='table-dark'>
            <tr>
              {tableHeaders.map((tableHeader, i) => {
                const key = i;
                return (
                  <th className='table-head-cell' key={key}>
                    {tableHeader.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {(isLoading || hasError) && (
              <tr>
                <td colSpan={8}>
                  {isLoading && (
                    <Skeleton
                      height={20}
                      count={10}
                      className='rounded-2 mb-3'
                    />
                  )}
                  {hasError && (
                    <div className='d-flex flex-column bg-light rounded-4 justify-content-center align-items-center p-5 h-100'>
                      <div className='mb-5 fs-3 fw-bold text-danger'>
                        No Characters received
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
                </td>
              </tr>
            )}
            {isCharactersLoaded &&
              characters.map((character, i) => {
                const key = i;
                return <TableRow key={key} character={character} />;
              })}
          </tbody>
        </table>
      </div>
      <PaginatedItems
        characterPerPage={characterPerPage}
        setCharacters={setCharacters}
        totalCharactersCount={totalCharactersCount}
        setTotalCharactersCount={setTotalCharactersCount}
        pageCount={pageCount}
        setPageCount={setPageCount}
        charactersCache={charactersCache}
        setCharactersCache={setCharactersCache}
        setCurrentPage={setCurrentPage}
        setIsLoading={setIsLoading}
        setError={setError}
      />
    </div>
  );
}
