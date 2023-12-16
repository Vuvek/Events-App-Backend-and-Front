import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFound:React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col justify-center items-center'> 
      <h2 className='mt-8 text-5xl font-bold'>404 Page Not Found</h2>
      <button
                  data-modal-target="crud-modal"
                  data-modal-toggle="crud-modal"
                  className="block my-10 font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none rounded-lg text-xl px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                  onClick={() => navigate('/')}
                >
                  <h3 className="cursor-pointer hover:border-white pr-4">
                    Go To Home Page
                  </h3>
                </button>
      <iframe title='unique' src="https://giphy.com/embed/3h2AeAOj83j7slRkyW" width="480" height="570" frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
    </div>
  )
}

export default PageNotFound;
