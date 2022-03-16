import type { FC } from 'react';
import Link from 'next/link';

export type MenuLiLinkProps = {
  href: string;
  active: boolean;
  label: string;
};

const MenuLiLink: FC<MenuLiLinkProps> = ({ href, active, label }) => {
  let classNames = ['li-border-b-menu'];

  active
    ? classNames.push('font-bold li-border-l-menu')
    : classNames.push(
        'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 hover:font-bold'
      );

  return (
    <li className={classNames.join(' ')}>
      <Link href={href}>
        <a
          className={`p-2 block ${
            active && 'cursor-default pointer-events-none'
          }`}
        >
          {label}
        </a>
      </Link>
    </li>
  );
};

export default MenuLiLink;
