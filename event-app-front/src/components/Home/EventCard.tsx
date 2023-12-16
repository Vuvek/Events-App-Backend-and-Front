import { IEventData } from "../../types/commonTypes";

interface IEventCard {
  event: IEventData;
}

const EventCard = (props: IEventCard) => {
  const { by, eventName, time, location, date, description, imageUrls } =
    props?.event;
  return (
    <>
      <div
        key={by}
        className="bg-white group relative p-5 border-[1px] border-black hover:scale-105 duration-300"
      >
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
          <img
            src={imageUrls && imageUrls.length ? imageUrls[0] : "/imgs/event.jpg"}
            alt={eventName}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </div>
        
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <div>
                <span aria-hidden="true" className="absolute inset-0" />
                {eventName}
              </div>
            </h3>
          </div>
          <p className="text-sm font-medium text-gray-900">{location}</p>
        </div>
        <div className="mt-2"> 
            <h3 className="text-sm text-gray-700">
              <div>
                <span aria-hidden="true" className="absolute inset-0" />
                {description}
              </div>
            </h3>
          </div>
      </div>
    </>
  );
};

export default EventCard;
