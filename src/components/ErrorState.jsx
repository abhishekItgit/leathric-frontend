import { Button } from './Button';

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="panel mx-auto max-w-lg p-8 text-center">
      <h3 className="text-xl font-semibold">Unable to load data</h3>
      <p className="mt-2 text-sm text-stone-300">{message}</p>
      {onRetry && (
        <Button className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
