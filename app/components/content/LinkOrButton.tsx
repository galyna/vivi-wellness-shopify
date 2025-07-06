import Link from "next/link";
import React from "react";

type Props = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
};

const LinkOrButton: React.FC<Props> = ({
  href,
  onClick,
  children,
  className = "",
  type = "button",
  ...rest
}) => {
  if (href) {
    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={className} {...rest}>
      {children}
    </button>
  );
};

export default LinkOrButton; 