import React from 'react';
import Link from 'next/link';

const MenuLiLink = ({ href, active, label }) => {
  const classNames = ['w-full li-border-b-menu p-2'];

  active
    ? classNames.push('font-bold li-border-l-menu')
    : classNames.push(
        'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 hover:font-bold'
      );

  return (
    <li className={classNames.join(' ')}>
      <Link href={href}>
        <a className={active ? 'cursor-default' : 'w-full p-3'}>{label}</a>
      </Link>
    </li>
  );
};

export default MenuLiLink;
