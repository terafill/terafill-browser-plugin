import { useState } from "react";
import { XCircleIcon } from '@heroicons/react/20/solid';
import { AiOutlineCloseSquare } from "react-icons/ai";
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'



export default function Errors({ errorList, showAlert, setAlertVisibilty }) {

  const closeErrors = () => {
    setAlertVisibilty(false);
  };

  return (
    showAlert &&
    <div className="rounded-md bg-red-50 p-4 relative">
      <button onClick={closeErrors} className="absolute top-0 right-0 p-1">
        {/*<XCircleIcon className="h-5 w-5 text-red-300" aria-hidden="true" />*/}
      {<AiOutlineCloseSquare className="h-5 w-5 text-red-400"/>}
      </button>
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-7 w-7 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">There were {errorList.length} errors with your submission</h3>
          <div className="mt-2 text-sm text-red-700">
            <ul role="list" className="list-disc space-y-1 pl-5">
              {
                errorList.map((error, index)=>(<li key={index}>{error}</li>))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


export function SuccessAlert({ alertList, showAlert, setAlertVisibilty }) {
  const closeAlert = () => {
    setAlertVisibilty(false);
  };

  return (
    showAlert &&
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          {alertList.map((alertMessage, index)=>(<p key={index} className="text-sm font-medium text-green-800">{alertMessage}</p>))}
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={closeAlert}
              type="button"
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
