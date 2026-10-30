import { cn } from './cn';

export interface DisplayValueProps {
  number: string;
  before?: string;
  after?: string;
  className?: string;
  numberClassName?: string;
  afterClassName?: string;
}

/**
 * Renders "before number after" with only the number isolated as LTR, so
 * Arabic units such as `د.ع` or `م²` keep their natural direction.
 */
export function DisplayValue({
  number,
  before,
  after,
  className,
  numberClassName,
  afterClassName,
}: DisplayValueProps) {
  return (
    <span className={className}>
      {before && <>{before} </>}
      <bdi dir="ltr" className={cn('tabular', numberClassName)}>
        {number}
      </bdi>
      {after && <span className={afterClassName}> {after}</span>}
    </span>
  );
}
