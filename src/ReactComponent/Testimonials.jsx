import React from "react";

const testimonials = [
  {
    name: "Sushil Regmi",
    position: "FullStack Developer",
    feedback:
      "This platform helped me land my dream job in just a few weeks! Highly recommend it.",
    image: "/image/sushil.JPG",
  },
  {
    name: "Sudip Dhakal",
    position: "FrontEnd Developer",
    feedback:
      "The job search process was so smooth and efficient. Best career move I made!",
    image: "/image/sudip.jpg",
  },
  {
    name: "Raghu Sharma",
    position: "Backend Developer",
    feedback:
      "Fantastic experience! I found multiple job offers within days of signing up.",
    image: "/image/raghu.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="p-12 bg-gradient-to-r from-blue-50 to-blue-100 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-10">
        What Our Users Say
      </h2>
      <div className="flex flex-row justify-center space-x-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="p-6 bg-white shadow-lg rounded-2xl text-center w-80 transition transform hover:-translate-y-2 duration-300"
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-24 h-24 rounded-full border-4 border-blue-200 items-center justify-center flex"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {testimonial.name}
            </h3>
            <p className="text-sm text-gray-500 mb-3">{testimonial.position}</p>
            <p className="text-gray-700 italic">"{testimonial.feedback}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
