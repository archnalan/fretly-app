import { useState, useEffect, useRef } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Item } from "../../DataModels/TabsModel";
import { motion } from "framer-motion";

type TabsProps = {
  initialItems: Item[];
  itemsCountLimit: number;
};
const TabsComponent = ({ initialItems, itemsCountLimit }: TabsProps) => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const firstBtnRef = useRef<HTMLDivElement | null>(null);
  const INITIAL_ID = 1;
  const [selectedTab, setSelectedTab] = useState(INITIAL_ID);

  useEffect(() => {
    const updatedItems = initialItems.map((item, index) => ({
      ...item,
      id: INITIAL_ID + index,
    }));
    setItems(updatedItems);
  }, [initialItems]);

  useEffect(() => {
    firstBtnRef.current?.focus();
  }, []);

  const handleTabRemove = (id: number) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);
      const selectedTabIndex = prevItems.findIndex(
        (item) => item.id === selectedTab
      );

      // once selected tab is removed
      if (selectedTab === id) {
        if (selectedTabIndex === 0 && updatedItems.length > 0) {
          setSelectedTab(updatedItems[0].id); // Select the next item if the first tab is removed
        } else if (selectedTabIndex > 0) {
          setSelectedTab(prevItems[selectedTabIndex - 1].id); // Select previous item
        } else {
          setSelectedTab(INITIAL_ID);
        }
      }

      return updatedItems;
    });
  };

  const handleAddTab = () => {
    {
      if (itemsCountLimit && items.length >= itemsCountLimit) return;
      const newId =
        items.length > 0 ? items[items.length - 1].id + 1 : INITIAL_ID;
      const newTab: Item = {
        id: newId,
        title: initialItems[0].title,
        content: initialItems[0].content,
      };

      setItems((prevItems) => [...prevItems, newTab]);
      setSelectedTab(newId);
    }
  };
  return (
    <motion.div layout>
      <div className="bg-base-200 flex justify-center items-center py-4">
        <div className="flex flex-col w-full">
          <div className=" p-2 ring-2 ring-neutral/15 rounded-xl flex justify-start flex-wrap items-center gap-x-2 font-semibold text-primary/75 bg-base-300 ">
            {items.map((item, index) => (
              <div
                key={index}
                ref={item.id === INITIAL_ID ? firstBtnRef : null}
                className={`outline-none min-w-fit py-2 ps-2 pe-1 flex items-center rounded-xl text-cneter focus:ring-2 focus:bg-base-100 focus:text-primary cursor-pointer ${
                  selectedTab === item.id
                    ? "ring-2 bg-base-100 text-primary shadow-lg"
                    : " hover:bg-base-100/50 "
                } `}
                onClick={() => setSelectedTab(item.id)}
              >
                <div className="mr-[1rem]">
                  {item.title} &nbsp; {index + 1}
                </div>

                <div className="flex items-center justify-between p-0">
                  <button
                    type="button"
                    className={`btn btn-sm btn-circle btn-ghost text-primary top-2 ${
                      selectedTab === item.id
                        ? "hover:bg-base-200"
                        : "hover:bg-base-100"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTabRemove(item.id);
                    }}
                  >
                    <IoClose />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex align-center gap-1 ">
              <button
                className="btn btn-ghost btn-circle btn-sm hover:bg-base-100/50 text-primary"
                onClick={() => handleAddTab()}
                disabled={items.length > itemsCountLimit - 1}
              >
                <IoMdAdd size={20} />
              </button>
            </div>
          </div>

          <div className="bg-base-300 p-2 ring-2 ring-neutral/15 rounded-xl mt-4 border">
            {items.map((item) => (
              <div
                key={item.id}
                className={`${selectedTab === item.id ? "" : "hidden"}`}
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TabsComponent;
