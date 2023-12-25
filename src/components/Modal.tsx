import { Dialog, Transition } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/16/solid';
import { Fragment } from 'react';

type ModalProps = {
  title?: string;
  className?: string;
  open: boolean;
  disableBackdropClick?: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({
  title = '',
  className = '',
  open,
  onClose,
  disableBackdropClick = false,
  children,
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className={`${className} relative z-30`}
        onClose={disableBackdropClick ? () => { } : onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-20 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 z-30 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="duration-300 ease-out"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="duration-200 ease-out"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-sm bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex items-center justify-between"
                >
                  <span className="text-xl font-medium uppercase leading-6 text-neutral-900">
                    {title}
                  </span>
                  <button onClick={onClose} className="h-5 w-5">
                    <XCircleIcon className="outlined text-rose-500 hover:text-rose-400" />
                  </button>
                </Dialog.Title>
                <div className="mt-2 text-neutral-900">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
