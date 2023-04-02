import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

export const AlertWarning: React.FC<{
  title: React.ReactNode;
  message: React.ReactNode;
}> = ({ title, message }) => {
  return (
    <div className='rounded-md bg-yellow-50 p-4 text-left'>
      <div className='flex'>
        <div className='flex-shrink-0'>
          <ExclamationTriangleIcon
            className='h-5 w-5 text-yellow-400'
            aria-hidden='true'
          />
        </div>
        <div className='ml-3'>
          <h3 className='text-sm font-medium text-yellow-800'>{title}</h3>
          <div className='mt-2 text-sm text-yellow-700'>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
