import { toast as sonnerToast } from 'sonner';
import styles from './styles.module.css';
import { cn } from '@/dashboard/lib/utils';
import { IconClose } from './IconClose';

// Custom components for each toast type
export const DefaultToast = ({ message, dismiss }) => (
  <div
    className={cn(
      'flex gap-3 justify-between items-center w-full py-2 px-3 rounded border text-[17px]',
      'bg-neutral-100 border-neutral-300 text-neutral-600 dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-100',
    )}
  >
    <div className={styles.toastMessageWrapper}>
      <div className={styles.toastMessage}>
        <span>{message}</span>
        {dismiss && (
          <div className={styles.toastActionsContainer}>
            <button className={styles.actionButton} onClick={dismiss}>
              <div className={styles.actionButtonContent}>
                <IconClose className={styles.actionButtonIcon} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const SuccessToast = ({ message, dismiss }) => (
  <div
    className={cn(
      'flex gap-3 justify-between items-center w-full py-2 px-3 rounded border text-[17px]',
      ' bg-lime-100 border-lime-300 text-lime-600 dark:bg-emerald-500 dark:border-emerald-500 dark:text-neutral-100',
    )}
  >
    <div className={styles.toastMessageWrapper}>
      <div className={styles.toastMessage}>
        <span>{message}</span>
        {dismiss && (
          <div className={styles.toastActionsContainer}>
            <button className={styles.actionButton} onClick={dismiss}>
              <div className={styles.actionButtonContent}>
                <IconClose className={styles.actionButtonIcon} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const ErrorToast = ({ message, dismiss }) => (
  <div
    className={cn(
      'flex gap-3 justify-between items-center w-full py-2 px-3 rounded border text-[17px]',
      ' bg-rose-100 border-rose-300 text-rose-500 dark:bg-rose-700 dark:border-rose-700 dark:text-neutral-100',
    )}
  >
    <div className={styles.toastMessageWrapper}>
      <div className={styles.toastMessage}>
        <span className={styles.toastText}>{message}</span>
        {dismiss && (
          <div className={styles.toastActionsContainer}>
            <button className={styles.actionButton} onClick={dismiss}>
              <div className={styles.actionButtonContent}>
                <IconClose className={styles.actionButtonIcon} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const WarningToast = ({ message, dismiss }) => (
  <div
    className={cn(
      'flex gap-3 justify-between items-center w-full py-2 px-3 rounded border text-[17px] mb-4',
      'bg-yellow-100 border-yellow-300 text-yellow-600 dark:bg-amber-500 dark:border-amber-500 dark:text-neutral-100',
    )}
  >
    <div className={styles.toastMessageWrapper}>
      <div className={styles.toastMessage}>
        <span>{message}</span>
        {dismiss && (
          <div className={styles.toastActionsContainer}>
            <button className={styles.actionButton} onClick={dismiss}>
              <div className={styles.actionButtonContent}>
                <IconClose className={styles.actionButtonIcon} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export function toast(message) {
  return sonnerToast.custom(
    (t) => <DefaultToast message={message} dismiss={() => sonnerToast.dismiss(t.id)} />,
    { duration: 5000 },
  );
}

// Extending the toast function with specific types
toast.success = (message) =>
  sonnerToast.custom(
    (t) => <SuccessToast message={message} dismiss={() => sonnerToast.dismiss(t.id)} />,
    { duration: 5000 },
  );

toast.error = (message) =>
  sonnerToast.custom(
    (t) => <ErrorToast message={message} dismiss={() => sonnerToast.dismiss(t.id)} />,
    { duration: 5000 },
  );

toast.warning = (message) =>
  sonnerToast.custom(
    (t) => <WarningToast message={message} dismiss={() => sonnerToast.dismiss(t.id)} />,
    { duration: 5000 },
  );

toast.info = (message) =>
  sonnerToast.custom(
    (t) => <DefaultToast message={message} dismiss={() => sonnerToast.dismiss(t.id)} />,
    { duration: 5000 },
  );

toast.promise = (promise, { loading, success, error }) => {
  return sonnerToast.promise(promise, {
    loading: loading && <DefaultToast message={loading} dismiss={() => sonnerToast.dismiss()} />,
    success: success && <SuccessToast message={success} dismiss={() => sonnerToast.dismiss()} />,
    error: error && <ErrorToast message={error} dismiss={() => sonnerToast.dismiss()} />,
  });
};
