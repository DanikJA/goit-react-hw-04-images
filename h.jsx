import { Component } from 'react';
import axios from 'axios';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';

const API_KEY = '47324612-8ceed49284fd3133cd5b6cb67';

export class App extends Component {
  state = {
    images: [], // для збереження зображень
    query: '', // пошуковий запит
    page: 1, // поточна сторінка для пагінації
    loading: false, // чи завантажуються зображення
    showModal: false, // чи показувати модальне вікно
    largeImageURL: '', // URL великого зображення для модального вікна
  };

  // Метод для обробки форми пошуку
  handleSearchSubmit = async query => {
    this.setState({ query, page: 1, images: [] }); // скидаємо сторінку та зображення при новому пошуку
    this.fetchImages(query, 1);
  };

  // Метод для завантаження зображень
  fetchImages = async (query, page) => {
    this.setState({ loading: true });

    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          q: query,
          page: page,
          key: API_KEY,
          image_type: 'photo',
          orientation: 'horizontal',
          per_page: 12,
        },
      });

      this.setState(prevState => ({
        images: [...prevState.images, ...response.data.hits], // додаємо нові зображення
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching images:', error);
      this.setState({ loading: false });
    }
  };

  // Завантажити більше зображень
  handleLoadMore = () => {
    const { query, page } = this.state;
    const nextPage = page + 1;
    this.setState({ page: nextPage });
    this.fetchImages(query, nextPage);
  };

  // Відкриття модального вікна з великим зображенням
  openModal = largeImageURL => {
    this.setState({ showModal: true, largeImageURL });
  };

  // Закриття модального вікна
  closeModal = () => {
    this.setState({ showModal: false, largeImageURL: '' });
  };

  render() {
    const { images, loading, showModal, largeImageURL } = this.state;

    return (
      <div>
        <Searchbar onSubmit={this.handleSearchSubmit} />

        {loading && <Loader />}

        <ImageGallery images={images} openModal={this.openModal} />

        {images.length > 0 && !loading && (
          <Button onClick={this.handleLoadMore} />
        )}

        {showModal && (
          <Modal largeImageURL={largeImageURL} closeModal={this.closeModal} />
        )}
      </div>
    );
  }
}
//////////////////////////////////////////////////////////////////////////////////////
import React, { Component } from 'react';

export class Searchbar extends Component {
  state = {
    query: '',
  };

  handleChange = event => {
    this.setState({ query: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit(this.state.query); // передаємо введене значення в App
    this.setState({ query: '' });
  };

  render() {
    return (
      <header className="searchbar">
        <form className="form" onSubmit={this.handleSubmit}>
          <button type="submit" className="button">
            <span className="button-label">Search</span>
          </button>

          <input
            className="input"
            type="text"
            autocomplete="off"
            autofocus
            placeholder="Search images and photos"
            value={this.state.query}
            onChange={this.handleChange}
          />
        </form>
      </header>
    );
  }
}
////////////////////////////////////////////////////////////////////////////
import React from 'react';
import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';

export const ImageGallery = ({ images, openModal }) => {
  return (
    <ul className="gallery">
      {images.map(image => (
        <ImageGalleryItem
          key={image.id}
          webformatURL={image.webformatURL}
          largeImageURL={image.largeImageURL}
          openModal={openModal}
        />
      ))}
    </ul>
  );
};

///////////////////////////////////////
import React from 'react';

export const ImageGalleryItem = ({
  webformatURL,
  largeImageURL,
  openModal,
}) => {
  return (
    <li className="gallery-item">
      <img src={webformatURL} alt="" onClick={() => openModal(largeImageURL)} />
    </li>
  );
};
////////////////////////////////////////////

import React from 'react';

export const Button = ({ onClick }) => {
  return <button onClick={onClick}>Load more</button>;
};
//////////////////////////////////////////////////
import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

export const Loader = () => (
  <div className="loader">
    <ThreeDots height="80" width="80" color="blue" />
  </div>
);
