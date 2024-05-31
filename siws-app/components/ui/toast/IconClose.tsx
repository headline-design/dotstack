export const IconClose = ({className} : {
    className?: string
}) => {
    return (
    <svg viewBox="0 0 24 24" width="20px" height="20px" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )

}