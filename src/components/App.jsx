import { useState, useEffect } from 'react';
import axios from 'axios';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import './App.css';
import { Modal } from './Modal/Modal';

const API_KEY = '47324612-8ceed49284fd3133cd5b6cb67';

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');

  const openModal = largeImageURL => {
    setShowModal(true);
    setLargeImageURL(largeImageURL);
  };

  const closeModal = () => setShowModal(false);

  const handleSearchSubmit = query => {
    if (query.trim() === '') return;
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const handleLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  useEffect(() => {
    if (query === '') return;
    fetchImages(query, page);
  }, [query, page]);

  const fetchImages = async (query, page) => {
    setLoading(true);
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          q: query,
          page: page,
          key: API_KEY,
          orientation: 'horizontal',
          image_type: 'photo',
          per_page: 12,
        },
      });
      setImages(prevState => [...prevState, ...response.data.hits]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images', error);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="maneDiv">
        <Searchbar onSubmit={handleSearchSubmit}></Searchbar>
        {loading && <Loader />}
        <ImageGallery images={images} onImageClick={openModal}></ImageGallery>
        {images.length > 0 && <Button onClick={handleLoadMore} />}
      </div>
      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={closeModal} />
      )}
    </>
  );
};
