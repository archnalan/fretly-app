import React, { useState } from "react";
import { VerseBoard } from "../AdminHelper/VerseBoard";
import TabsComponent from "../AdminHelper/TabsComponent";
import { Item } from "../../DataModels/TabsModel";

const SongBoard = () => {
  // Maximum number of verses allowed
  const MAX_VERSES = 24;

  // Create initial verse items for the tabs component
  const initialVerseItems: Item[] = [
    {
      id: 1,
      title: <span>Verse</span>,
      content: <VerseBoard key={1} />,
    },
  ];

  return (
    <div className="w-full flex flex-col justify-center bg-base-200 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Song Editor</h1>

      {/* Using the TabsComponent for dynamic verses */}
      <TabsComponent
        initialItems={initialVerseItems}
        itemsCountLimit={MAX_VERSES}
      />
    </div>
  );
};

export default SongBoard;
