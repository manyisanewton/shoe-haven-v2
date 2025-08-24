const About = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">About Shoe Haven</h1>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Founded in 2025, Shoe Haven was born from a passion for quality footwear and a desire to bring the latest styles to Nairobi, Kenya. We believe that a great pair of shoes is more than just an accessory; it's a foundation for your day and a statement of your personal style.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Our mission is to provide an unparalleled shopping experience, offering a curated selection of top brands and exceptional customer service. Whether you're an athlete, a fashion enthusiast, or just looking for everyday comfort, we have the perfect pair for you.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Find Us</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Visit our flagship store at 123 Shoe Lane, Nairobi, Kenya.
          </p>
          <div className="rounded-lg shadow-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.15764092496!2d36.73204278477798!3d-1.3031976695273766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi!5e0!3m2!1sen!2ske!4v1663529342125!5m2!1sen!2ske"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location in Nairobi"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;