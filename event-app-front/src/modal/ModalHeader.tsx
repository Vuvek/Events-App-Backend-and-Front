import React from "react";

interface IModalHeader {
  setShowModal: (x: boolean) => void;
}

const ModalHeader: React.FC<IModalHeader> = (props) => {
  // props
  const { setShowModal } = props;

  return (
    <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
      <h3 className="text-xl text-gray-900 dark:text-white font-bold">
        Create Event
      </h3>
      <button
        type="button"
        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
        data-modal-toggle="crud-modal"
        onClick={() => setShowModal(false)}
      >
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
        <span className="sr-only">Close modal</span>
      </button>
    </div>
  );
};

export default ModalHeader;
