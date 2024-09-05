import React, { useEffect, useState } from "react";
import { ImBooks } from "react-icons/im";
import { MdLibraryBooks } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { SiApplemusic } from "react-icons/si";
import { GiMusicalScore } from "react-icons/gi";
import { SiMusicbrainz } from "react-icons/si";
import Sidebar from "./Sidebar";
import SidebarItem from "./SidebarItem";
import { useSidebarContext } from "../../Contexts/SidebarContext";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { BsGrid3X3 } from "react-icons/bs";

const Side: React.FC = () => {
  const sidebarItems = [
    {
      text: "chordify",
      slug: "chordify",
      icon: <GiMusicalScore size={30} />,
      alert: true,
    },
    {
      text: "Pages",
      slug: "pages",
      icon: <MdLibraryBooks size={30} />,
      alert: true,
    },
    { text: "Collections", slug: "songbooks", icon: <ImBooks size={30} /> },
    {
      text: "Categories",
      slug: "categories",
      icon: <BiSolidCategoryAlt size={30} />,
    },
    {
      text: "Songs",
      slug: "songs",
      icon: <SiApplemusic size={30} />,
      alert: true,
    },
    { text: "Chords", slug: "chords", icon: <SiMusicbrainz size={30} /> },
    {
      text: "Chord charts",
      slug: "chordcharts",
      icon: <BsGrid3X3 size={30} />,
    },
  ];

  const [activeItem, setActiveItem] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const slugs = sidebarItems.map((item) => item.slug) as [string, ...string[]];

  const sidebarSchema = z.object({
    slug: z.enum(slugs),
  });

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    const validatedItem = sidebarSchema.safeParse({ slug: path });

    if (validatedItem.success) {
      const active = sidebarItems.find((item) => item.slug === path);
      if (active) {
        setActiveItem(active.text);
      }
    }
  }, [location.pathname]);

  return (
    <div className="h-full">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem}>
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setActiveItem(item.text);
              navigate(`/admin/${item.slug}`);
            }}
          >
            <SidebarItem
              key={index}
              text={item.text}
              icon={item.icon}
              alert={item.alert}
              active={item.text === activeItem}
            />
          </div>
        ))}
      </Sidebar>
    </div>
  );
};

export default Side;
