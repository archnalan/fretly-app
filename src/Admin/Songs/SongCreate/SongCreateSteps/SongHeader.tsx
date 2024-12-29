import React from "react";

type songHeaderProps = {
  headText: string;
};
const SongHeader: React.FC<songHeaderProps> = ({ headText }) => {
  return (
    <div className="mb-2">
      <h1 className="mb-4 text-neutral">{headText} a Song</h1>
    </div>
  );
};

export default SongHeader;
