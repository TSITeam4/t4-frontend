import React from "react";
import LazyImage from "../lazy-image/LazyImage";
import { getPublicUrl } from "../../lib/storageUtils";

function Profile({ executive }) {
  // Build public URL from Supabase storage using the headshot_path object name
  const headshotUrl = getPublicUrl('headshots', executive?.headshot_path);

  return (
    <div className="flex flex-col items-center justify-center mx-auto">
      <LazyImage
        src={headshotUrl || ''}
        alt={executive?.name ?? 'Executive'}
        className="w-56 h-56 object-cover border-2 border-gray-300 hover:shadow-lg hover:shadow-[var(--wsc-light)] hover:scale-105 duration-300"
      />
      <h2 className="text-xl font-bold pt-4 text-[var(--wsc-gold)]">{executive?.name ?? 'Unknown'}</h2>
      <p className="text-gray-400 text-sm">{executive?.title ?? ''}</p>
    </div>
  );
}

export default Profile;
