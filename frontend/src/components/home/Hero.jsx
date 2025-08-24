import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../api/apiService';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-creative';

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const Hero = () => {
  const [randomShoes, setRandomShoes] = useState([]);

  useEffect(() => {
    const fetchRandomShoes = async () => {
      try {
        const response = await apiService.get('/shoes?per_page=12');
        setRandomShoes(shuffleArray(response.data.shoes).slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch shoes for hero:", error);
      }
    };
    fetchRandomShoes();
  }, []);

  return (
    // Main container: Full-width, relative for positioning, dark background, and rounded
    <div className="w-full relative overflow-hidden bg-black rounded-2xl p-8 py-20 md:p-12 md:py-24">
      {/* Decorative Background Spotlight */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient from-pink-900/20 via-slate-900/10 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      ></div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Text Content & CTAs */}
        <div className="md:w-1/2 text-center md:text-left text-white animate-fade-in">
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            Define Your Stride.
          </h1>
          <p className="max-w-md mx-auto md:mx-0 text-lg lg:text-xl text-gray-300 mb-8">
            From the streets to the court, find the perfect pair that speaks your style. Unbeatable quality, undeniable comfort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/store"
              className="bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Collection
            </Link>
            <Link
              to="/about"
              className="bg-transparent border-2 border-gray-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Side: Floating Shoe Showcase */}
        <div className="md:w-1/2 w-full h-72 md:h-96">
          {randomShoes.length > 0 && (
            <Swiper
              grabCursor={true}
              effect={'creative'}
              creativeEffect={{
                prev: { shadow: true, translate: ['-125%', 0, -500], rotate: [0, 0, -20] },
                next: { shadow: true, translate: ['125%', 0, -500], rotate: [0, 0, 20] },
              }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              loop={true}
              modules={[EffectCreative, Autoplay]}
              className="w-full h-full"
            >
              {randomShoes.map(shoe => (
                <SwiperSlide key={shoe.id} className="flex items-center justify-center bg-transparent">
                  <img 
                    src={shoe.image} 
                    alt={shoe.name} 
                    className="w-full h-full object-contain p-4 md:p-8 drop-shadow-2xl"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;