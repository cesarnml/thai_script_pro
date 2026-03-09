import { formatVowelWithPlaceholder, splitVowelForDisplay } from '../data/vowels'

interface VowelDisplayProps {
  char: string
  className?: string
  glyphClassName?: string
  placeholderClassName?: string
  ariaHidden?: boolean
}

export function VowelDisplay({
  char,
  className = '',
  glyphClassName = 'text-current',
  placeholderClassName = 'text-gray-300',
  ariaHidden = false,
}: VowelDisplayProps) {
  const { prefix, upper, lower, suffix } = splitVowelForDisplay(char)
  const label = formatVowelWithPlaceholder(char)
  const hasMarks = upper || lower

  return (
    <span className={`inline-flex items-center whitespace-nowrap ${className}`.trim()}>
      {!ariaHidden && <span className="sr-only">{label}</span>}
      <span aria-hidden="true" className="inline-flex items-baseline leading-none">
        {prefix && <span className={glyphClassName}>{prefix}</span>}
        {hasMarks ? (
          <span className="relative">
            <span className={glyphClassName}>{`อ${upper}${lower}`}</span>
            <span className={`absolute inset-0 ${placeholderClassName}`} aria-hidden="true">{'อ'}</span>
          </span>
        ) : (
          <span className={placeholderClassName}>อ</span>
        )}
        {suffix && <span className={glyphClassName}>{suffix}</span>}
      </span>
    </span>
  )
}
