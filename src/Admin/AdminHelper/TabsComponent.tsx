import { useState, useEffect, useRef } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { Item } from "../../DataModels/TabsModel";

type TabsProps = {
  initialItems: Item[];
  itemsCountLimit?: number;
};
const TabsComponent = ({ initialItems, itemsCountLimit }: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [items, setItems] = useState<Item[]>(initialItems);
  const firstBtnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    firstBtnRef.current?.focus();
  }, []);

  const handleTabRemove = (index: number) => {
    console.log("🚀 ~ handleTabRemove ~ index:", index);
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    if (selectedTab >= items.length) {
      console.log("🚀 ~ setTimeout ~ selectedTab:", selectedTab);
      setSelectedTab(items.length - 1);
    }
  };

  const handleAddTab = () => {
    if (itemsCountLimit && items.length >= itemsCountLimit) return;
    const lastId = items[items.length - 1].id;
    const newId = lastId + 1;
    console.log("🚀 ~ handleAddTab ~ newId:", newId);

    const newTab: Item = {
      id: newId,
      title: initialItems[0].title,
      content: initialItems[0].content,
    };

    setItems((prevItems) => {
      const newItems = [...prevItems, newTab];
      setSelectedTab(newItems.length - 1);
      return newItems;
    });
  };
  return (
    <div className="bg-base-200 flex justify-center items-center py-4">
      <div className="flex flex-col w-full">
        <div className=" p-1  rounded-xl flex justify-start flex-wrap items-center gap-x-2 font-semibold text-primary">
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={item.id === 0 ? firstBtnRef : null}
              className={`outline-none min-w-fit p-2 flex items-center rounded-xl text-cneter focus:ring-2 focus:bg-base-100 focus:text-primary ${
                selectedTab === item.id
                  ? "ring-2 bg-base-100 text-primary"
                  : "hover:bg-blue-300"
              } `}
              onClick={() => setSelectedTab(item.id)}
            >
              <div className="mr-[1rem]">
                {item.title} &nbsp; {index + 1}
              </div>

              <div className="flex align-center gap-1">
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost right-2 top-2 "
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabRemove(index);
                  }}
                  disabled={items.length === 1}
                >
                  <IoClose className="font-bold text-md" />
                </button>
                <div className="h-[100%] w-[0.01em] bg-base-200 border border-base-100 "></div>
              </div>
            </div>
          ))}
          <div className="flex align-center gap-1 ">
            <button
              className="btn btn-ghost btn-circle btn-sm "
              onClick={handleAddTab}
              disabled={items.length > 11}
            >
              <IoMdAdd />
            </button>
          </div>
        </div>

        <div className="bg-base-200 p-2 rounded-xl">
          {items.map((item, index) => (
            <div
              key={index}
              className={`${selectedTab === item.id ? "" : "hidden"}`}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabsComponent;
