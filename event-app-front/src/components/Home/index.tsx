import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { useQuery } from "@apollo/client";
import { BounceLoader } from "react-spinners";
import { IEventData } from "../../types/commonTypes";
import { GET_ALL_Events } from "../../gqloperations/queries";
import { getDataFromStorage } from "../../utils/commonFunctions";

const Home = () => {
  // useState hooks
  const [eventby] = useState<string>(
    JSON.parse(getDataFromStorage("userId") ?? "{}") ?? ""
  );
  const [eventsData, setEventsData] = useState<IEventData[] | null>(null);

  // GraphQL hooks
  const { loading,data } = useQuery(GET_ALL_Events, {
    variables: { eventby },
  });

  // useEffect Hook
  useEffect(() => {
    if(data) {
      setEventsData(data.ievent);
    }
  },[data])

  return (
    <div
      className={`w-full ${
        !loading ? "h-full" : "h-screen"
      } py-2 px-3 bg-blue-300 text-black relative`}
    >
      {!loading ? (
        <div className="bg-blue-300">
          {eventsData && eventsData.length ? (
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Your Created Events Detail
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {eventsData.map((event,index) => (
                  <EventCard key={index} event={event} />
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[75vh] flex justify-center items-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center">
                Please Add Your Events
              </h2>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-screen flex items-start justify-center absolute top-[45%]">
          <BounceLoader color="black" size={60} />
        </div>
      )}
    </div>
  );
};

export default Home;
