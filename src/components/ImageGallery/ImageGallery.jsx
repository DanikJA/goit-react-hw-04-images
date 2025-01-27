import { ImageGalleryItem } from '../ImageGalleryItem/ImageGalleryItem';
import './ImageGallery.css';

export const ImageGallery = ({ images, onImageClick }) => {
  return (
    <ul className="gallery">
      {images.map(image => (
        <ImageGalleryItem
          key={image.id}
          webformatURL={image.webformatURL}
          largeImageURL={image.largeImageURL}
          onClick={() => onImageClick(image.largeImageURL)}
        />
      ))}
    </ul>
  );
};
