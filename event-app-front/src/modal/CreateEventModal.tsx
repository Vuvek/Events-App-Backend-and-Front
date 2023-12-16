import { Form, Formik } from "formik";
import ModalHeader from "./ModalHeader";
import { createPortal } from "react-dom";
import axios, { AxiosResponse } from "axios";
import { useMutation } from "@apollo/client";
import { BounceLoader } from "react-spinners";
import { IEventData } from "../types/commonTypes";
import { GET_ALL_Events } from "../gqloperations/queries";
import { CREATE_EVENT } from "../gqloperations/mutations";
import { eventInitialValues } from "../utils/fileConstant";
import React, { useEffect, useRef, useState } from "react";
import { getDataFromStorage } from "../utils/commonFunctions";
import { IAddGuests, IDurations } from "../types/commonTypes";

interface IEventProps {
  setShowModal: any;
}

const EventModal: React.FC<IEventProps> = (props) => {
  // props
  const { setShowModal } = props;

  // refs
  const userRef = useRef<string>("");

  // useStates hook
  const [addGuest, setAddGuest] = useState<IAddGuests[] | []>([]);
  const [addDescription, setAddDescription] = useState<boolean>(false);
  const [addGuestInput, setAddGuestInput] = useState<string>("");
  const [addMeetingRoom, setAddMeetingRoom] = useState<boolean>(false);
  const [notification, setNotification] = useState("email");
  const [hoursDuration, setHoursDuration] = useState<number>(1);
  const [minutesDuration, setMinutesDuration] = useState<number>(0);
  const [hoursReminder, setHoursReminder] = useState(1);
  const [files, setFiles] = useState<FileList[] | []>([]);
  const [cloudinaryImageUrl, setCloudinaryImageUrl] = useState<string[]>([]);
  const [hoursActive, setHoursActive] = useState<
    "Hours" | "Minutes" | ({} & string)
  >("");

  useEffect(() => {
    if (userRef) {
      userRef.current = getDataFromStorage("userId") ?? "";
      userRef.current = JSON.parse(userRef.current)
    }
  }, []);

  // graphQl hooks
  const [createEvent, { loading }] = useMutation(CREATE_EVENT, {
    refetchQueries:[GET_ALL_Events],
    variables: { eventBy:  userRef.current}
  });

  if (loading)
    return (
      <div className="w-full h-screen flex items-start justify-center absolute top-[45%]">
        <BounceLoader color="black" size={60} />
      </div>
    );

  const handleAddGuest = () => {
    if (addGuestInput) {
      setAddGuest((prev) => {
        return [
          ...prev,
          {
            email: addGuestInput,
            id: `item-${prev.length === 0 ? 1 : prev.length + 1}`,
          },
        ];
      });
      setAddGuestInput("");
    }
  };

  const handleAddGuestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddGuestInput(event.target.value);
  };
  const handleAddDescription = (
    setFieldValue?: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => void
  ) => {
    setAddDescription((prev) => !prev);
    if (setFieldValue) {
      setFieldValue("description", "", true);
    }
  };
  const handleAddMeetingRoom = (
    setFieldValue?: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => void
  ) => {
    if (setFieldValue) {
      setFieldValue("meetingRoom", "", true);
    }
    setAddMeetingRoom((prev) => !prev);
  };

  const handleRemoveGuest = (id: string) => {
    const guests = addGuest.filter((guest) => guest.id !== id);
    setAddGuest(guests);
  };
  const handleDuration = (duration: string) => {
    setHoursActive(duration);
  };

  const handleDurationIncrement = (fieldName: IDurations) => {
    if (fieldName === "duration") {
      if (hoursActive === "Hours" && hoursDuration < 12) {
        setHoursDuration((prev) => prev + 1);
      } else if (hoursActive === "Minutes" && minutesDuration < 60) {
        setMinutesDuration((prev) => prev + 1);
      } else {
        setHoursActive("Hours");
        setHoursDuration((prev) => prev + 1);
      }
    } else {
      setHoursReminder((prev) => prev + 1);
    }
  };
  const handleDurationDecrement = (fieldName: IDurations) => {
    if (fieldName === "duration") {
      if (hoursActive === "Hours" && hoursDuration > 0) {
        setHoursDuration((prev) => prev - 1);
      } else if (hoursActive === "Minutes" && minutesDuration > 0) {
        setMinutesDuration((prev) => prev - 1);
      } else {
        setHoursActive("Hours");
      }
    } else {
      setHoursReminder((prev) => prev - 1);
    }
  };
  const handleRemoveImage = (id: number, index: number) => {
    const filteredFiles = files.filter((file) => file[0].lastModified !== id);
    const filtedImages = cloudinaryImageUrl.filter((_, ind) => ind !== index);
    setFiles(filteredFiles);
    setCloudinaryImageUrl(filtedImages);
  };

  const handleSubmit = (formData: IEventData) => {
    const formValues = {
      ...formData,
      duration: { hours: hoursDuration, minutes: minutesDuration },
      reminder: hoursReminder,
      addGuest,
      notification,
      imageUrls: cloudinaryImageUrl,
    };
    createEvent({
      variables: {
        event: formValues,
      },
    });
    setShowModal(false);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target?.files && event.target.files[0];

    if (!file) return;
    setFiles((prev: any) => [...prev, event.target?.files]);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET ?? "");

    try {
      const response: AxiosResponse<any> = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
        formData
      );

      setCloudinaryImageUrl((prev) => [...prev, response.data.url]);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    }
  };

  return (
    <>
      {createPortal(
        <div
          id="crud-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="bg-[#0000002e] flex justify-center fixed top-0 right-0 left-0 z-50 w-full md:inset-0"
        >
          <div className="relative flex justify-center p-4 max-w-md max-h-full m-6 ">
            {/* Modal content  */}
            <div className="absolute top-0 bg-white rounded-lg shadow dark:bg-gray-700 w-[95vw] md:w-[95vw] lg:w-[55vw]">
              {/* Modal header  */}
              <ModalHeader setShowModal={setShowModal} />
              {/* Modal body  */}

              <Formik
                initialValues={eventInitialValues}
                onSubmit={handleSubmit}
              >
                {(formikProps) => {
                  const { values, handleBlur, handleChange, setFieldValue } =
                    formikProps;
                  return (
                    <>
                      <Form className="p-4 overflow-y-auto overflow-x-hidden h-[80vh]">
                        <div className="grid gap-4 mb-4 grid-cols-3">
                          <div className="col-span-3">
                            <label
                              htmlFor="eventName"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Event Name
                            </label>
                            <div className="relative">
                              <input
                                value={values.eventName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                name="eventName"
                                id="eventName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Enter event name"
                                required
                              />
                              {!addDescription && (
                                <button
                                  onClick={() => handleAddDescription()}
                                  type="button"
                                  className="bg-white absolute right-1.5 top-1.5 hover:bg-gray-100 text-gray-800 border font-semibold rounded-lg text-xs px-6 py-1.5 text-center border-gray-400 shadow"
                                >
                                  Add description
                                </button>
                              )}
                            </div>
                          </div>
                          {addDescription && (
                            <div className="col-span-3">
                              <label
                                htmlFor="description"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Description
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={values.description}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  name="description"
                                  id="description"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                  placeholder="Enter event description"
                                  required
                                />
                                <button
                                  onClick={() =>
                                    handleAddDescription(setFieldValue)
                                  }
                                  type="button"
                                  className="bg-white absolute right-1.5 top-1.5 hover:bg-gray-100 text-gray-800 border font-semibold rounded-lg text-xs px-6 py-1.5 text-center border-gray-400 shadow"
                                >
                                  Delete description
                                </button>
                              </div>
                            </div>
                          )}
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="date"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Date
                            </label>
                            <input
                              type="date"
                              value={values.date}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="date"
                              id="date"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              required
                            />
                          </div>
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="time"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Time
                            </label>
                            <input
                              type="time"
                              value={values.time}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="time"
                              id="time"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              required
                            />
                          </div>

                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="price"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Duration
                            </label>
                            <div className="col-span-3 sm:col-span-1 relative bg-gray-50 border flex flex-wrap items-center border-gray-300 text-black rounded-lg w-full p-1">
                              <div
                                className={
                                  hoursActive === "Hours"
                                    ? "border bg-blue-700 rounded-lg px-0.5 py-1 text-white"
                                    : "px-0.5 py-1 border border-transparent"
                                }
                                onClick={() => handleDuration("Hours")}
                              >
                                {hoursDuration}h
                              </div>
                              <div
                                className={
                                  hoursActive === "Minutes"
                                    ? "border bg-blue-700 rounded-lg px-0.5 py-1 text-white"
                                    : "px-0.5 py-1 border border-transparent"
                                }
                                onClick={() => handleDuration("Minutes")}
                              >
                                {minutesDuration}m
                              </div>
                              <div className="absolute right-2 top-0.5 w-5">
                                <svg
                                  onClick={() =>
                                    handleDurationIncrement("duration")
                                  }
                                  className="rotate-180 cursor-pointer"
                                  focusable="false"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
                                </svg>
                                <svg
                                  onClick={() =>
                                    handleDurationDecrement("duration")
                                  }
                                  className="cursor-pointer"
                                  focusable="false"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
                                </svg>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-3">
                            <label
                              htmlFor="location"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white pointer-events-none"
                            >
                              Location
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={values.location}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                name="location"
                                id="location"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Choose Location"
                                required
                              />
                              {!addMeetingRoom && (
                                <button
                                  onClick={() => handleAddMeetingRoom()}
                                  className="bg-white absolute right-1.5 top-1.5 hover:bg-gray-100 text-gray-800 border font-semibold rounded-lg text-xs px-6 py-1.5 text-center border-gray-400 shadow"
                                >
                                  Set meeting room
                                </button>
                              )}
                            </div>
                          </div>
                          {addMeetingRoom && (
                            <div className="col-span-3">
                              <label
                                htmlFor="meetingRoom"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Meeting Room
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={values.meetingRoom}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  name="meetingRoom"
                                  id="meetingRoom"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                  placeholder="Enter meeting room"
                                  required
                                />
                                <button
                                  onClick={() =>
                                    handleAddMeetingRoom(setFieldValue)
                                  }
                                  type="button"
                                  className="bg-white absolute right-1.5 top-1.5 hover:bg-gray-100 text-gray-800 border font-semibold rounded-lg text-xs px-6 py-1.5 text-center border-gray-400 shadow"
                                >
                                  Delete description
                                </button>
                              </div>
                            </div>
                          )}
                          <div className="col-span-3">
                            <label
                              htmlFor="category"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Add guests
                            </label>
                            <div className="relative">
                              <input
                                type="email"
                                name="email"
                                id="email"
                                value={addGuestInput}
                                onChange={handleAddGuestChange}
                                className="bg-gray-50 border border-gray-300 focus-visible:outline-none text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="contact@example.com"
                              />
                              <button
                                type="button"
                                onClick={handleAddGuest}
                                className="bg-white absolute right-1.5 top-1.5 hover:bg-gray-100 text-gray-800 border font-semibold rounded-lg text-xs px-6 py-1.5 text-center border-gray-400 shadow"
                              >
                                Add
                              </button>
                            </div>
                            <div className="flex pt-2">
                              {addGuest.map((guest) => {
                                return (
                                  <div key={guest.id} className="relative pr-2">
                                    <img
                                      width={50}
                                      className="rounded-full bg-lime-300"
                                      src={`https://robohash.org/adssfsss.png`}
                                      alt="Pic"
                                    />
                                    <p
                                      onClick={() =>
                                        handleRemoveGuest(guest.id)
                                      }
                                      className="absolute right-3 top-0 text-xs font-bold cursor-pointer"
                                    >
                                      X
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="col-span-3 md:col-span-2 grid gap-4 grid-cols-8">
                            <div className="col-span-8 sm:col-span-3 md:col-span-4">
                              <label
                                htmlFor="category"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Notification
                              </label>
                              <div className="bg-gray-50 border flex gap-1 flex-wrap items-center border-gray-300 text-black rounded-lg w-full p-1 cursor-pointer">
                                <div
                                  className={
                                    notification === "email"
                                      ? "border bg-white rounded-lg px-3 py-1"
                                      : "px-3 py-1 border border-transparent"
                                  }
                                  onClick={() => setNotification("email")}
                                >
                                  Email
                                </div>
                                <div
                                  className={
                                    notification === "slack"
                                      ? "border bg-white rounded-lg px-3 py-1"
                                      : "px-3 py-1 border border-transparent"
                                  }
                                  onClick={() => setNotification("slack")}
                                >
                                  Slack
                                </div>
                              </div>
                            </div>

                            <div className="col-span-8 sm:col-span-3 md:col-span-4">
                              <label
                                htmlFor="category"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                              >
                                Set reminder
                              </label>
                              <div className="col-span-3 sm:col-span-1 relative bg-gray-50 border flex flex-wrap items-center border-gray-300 text-black rounded-lg w-full p-1">
                                <div
                                  className={
                                    "px-0.5 py-1 border border-transparent"
                                  }
                                >
                                  {hoursReminder} hour before event
                                </div>

                                <div className="absolute right-2 top-0.5 w-5">
                                  <svg
                                    onClick={() =>
                                      handleDurationIncrement("reminder")
                                    }
                                    className="rotate-180 cursor-pointer"
                                    focusable="false"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
                                  </svg>
                                  <svg
                                    onClick={() =>
                                      handleDurationDecrement("reminder")
                                    }
                                    className="cursor-pointer"
                                    focusable="false"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-3">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Upload Attachments
                            </label>
                            <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full py-4 px-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                              <label
                                htmlFor="multiple_files"
                                className="border inline-block border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 py-2 px-5 bg-white dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              >
                                Select files
                              </label>
                              <input
                                onChange={handleFileChange}
                                className="hidden bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                id="multiple_files"
                                type="file"
                                multiple
                              />
                              {files.length > 0 && <hr className="my-3" />}
                              <ul>
                                {files.map((file, index) => {
                                  return (
                                    <li
                                      key={file[0].lastModified}
                                      className="flex justify-between mt-2"
                                    >
                                      <div className="flex gap-3 items-center">
                                        <img
                                          width={16}
                                          src="/imgs/check.png"
                                          alt="NoImage"
                                        />
                                        <p>{file[0].name!}</p>
                                        <p className="px-2 font-semibold rounded-xl bg-gray-200">
                                          {(
                                            file[0].size /
                                            (1024 * 1024)
                                          ).toFixed(1)}
                                          MB
                                        </p>
                                      </div>
                                      <img
                                        onClick={() =>
                                          handleRemoveImage(
                                            file[0].lastModified,
                                            index
                                          )
                                        }
                                        src="/imgs/delete.png"
                                        alt="NoImage"
                                        className="mr-2 cursor-pointer"
                                      />
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end mt-8">
                          <button
                            onClick={() => setShowModal(false)}
                            className="bg-white hover:bg-gray-100 text-gray-800 border font-bold rounded-lg text-sm px-5 py-2.5 text-center border-gray-400 shadow"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Create Event
                          </button>
                        </div>
                      </Form>
                    </>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default EventModal;
