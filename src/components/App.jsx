import { Component } from 'react';
import axios from 'axios';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import './App.css';
import { Modal } from './Modal/Modal';

const API_KEY = '47324612-8ceed49284fd3133cd5b6cb67';

export class App extends Component {
  state = {
    images: [],
    query: '',
    page: 1,
    loading: false,
    showModal: false,
    largeImageURL: '',
  };

  openModal = largeImageURL => {
    this.setState({
      showModal: true,
      largeImageURL,
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  handleSearchSubmit = query => {
    if (query.trim() === '') return;
    this.setState({ query, page: 1, images: [] });
  };

  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;
    if (prevState.query !== query || prevState.page !== page) {
      this.fetchImages(query, page);
    }
  }

  fetchImages = async (query, page) => {
    this.setState({ loading: true });
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
      this.setState(prevState => ({
        images: [...prevState.images, ...response.data.hits],
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching images', error);
      this.setState({ loading: false });
    }
  };

  render() {
    const { images, loading, largeImageURL, showModal } = this.state;
    return (
      <>
        <div className="maneDiv">
          <Searchbar onSubmit={this.handleSearchSubmit}></Searchbar>
          {loading && <Loader />}
          <ImageGallery
            images={images}
            onImageClick={this.openModal}
          ></ImageGallery>
          {images.length > 0 && <Button onClick={this.handleLoadMore} />}
        </div>
        {showModal && (
          <Modal largeImageURL={largeImageURL} onClose={this.closeModal} />
        )}
      </>
    );
  }
}
