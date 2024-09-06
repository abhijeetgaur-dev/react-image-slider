import { useEffect, useState } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import "./Slider.css";

export default function Slider({ url, limit = 5, page = 1 }) {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchImages(getUrl) {
    try {
      setLoading(true);
      const response = await fetch(`${getUrl}?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setImages(data);
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handlePrevious() {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function handleNext() {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  useEffect(() => {
    if (url) {
      fetchImages(url);
    }
  }, [url, page, limit]);

  if (loading) {
    return <div>Loading data! Please wait...</div>;
  }

  if (errorMsg) {
    return <div>Error occurred: {errorMsg}</div>;
  }

  return (
    <div className="container">
      <BsArrowLeftCircleFill
        onClick={handlePrevious}
        className="arrow arrow-left"
      />
      {images.length > 0 ? (
        images.map((imageItem, index) => (
          <img
            key={imageItem.id}
            alt={imageItem.download_url}
            src={imageItem.download_url}
            className={
              currentSlide === index
                ? "current-image"
                : "current-image hide-current-image"
            }
          />
        ))
      ) : (
        <div>No images available</div>
      )}
      <BsArrowRightCircleFill
        onClick={handleNext}
        className="arrow arrow-right"
      />
      <span className="circle-indicators">
        {images.length > 0 &&
          images.map((_, index) => (
            <button
              key={index}
              className={
                currentSlide === index
                  ? "current-indicator"
                  : "current-indicator inactive-indicator"
              }
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
      </span>
    </div>
  );
}
