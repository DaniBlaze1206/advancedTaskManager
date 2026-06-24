import Spinner from './Spinner'

function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] items-center justify-center"
    >
      <Spinner size="lg" />
    </div>
  )
}

export default PageLoader