import React from "react";

const Donate = () => {

  const donateRef = useRef(null);
  
  return (
    <section ref={donateRef} className="p-12 text-center bg-gray-500">
    <h2 className="text-4xl font-bold">Donate</h2>
    <p className="mt-4 text-gray-700">Support our mission.</p>
  </section>
  );
};

export default Donate;
