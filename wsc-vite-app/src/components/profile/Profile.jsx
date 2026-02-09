import React from "react";
import LazyImage from "../lazy-image/LazyImage";

function Profile({ headshotFileName, name, title }) {

  const headshotImage = new URL(`../../../data/headshots/${headshotFileName}`, import.meta.url).href;

  return (
    <div className="flex flex-col items-center justify-center mx-auto">
      <LazyImage
        src={headshotImage}
        alt={name}
        className="w-56 h-56 object-cover border-2 border-gray-300 hover:shadow-lg hover:shadow-[var(--wsc-light)] hover:scale-105 duration-300"
      />
      <h2 className="text-xl font-bold pt-4 text-[var(--wsc-gold)]">{name}</h2>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );
}

export default Profile;