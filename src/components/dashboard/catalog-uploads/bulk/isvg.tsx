import React from 'react'
type IsvgProps = React.SVGProps<SVGSVGElement>;

export default function Isvg(props: IsvgProps) {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="css-1nedbsg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 21a9 9 0 100-18 9 9 0 000 18zm1.5-12.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM12 11.75a.75.75 0 01.75.75V17a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75z"
        fill={props.color || 'currentColor'}
      />
    </svg>
  );
}
