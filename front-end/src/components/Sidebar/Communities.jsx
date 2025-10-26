import React from 'react';

// Community links configuration
const COMMUNITY_LINKS = [
  {
    name: 'Bluesky',
    url: 'https://cs50.bsky.social',
    badge: null,
  },
  {
    name: 'Clubhouse',
    url: 'https://www.clubhouse.com/club/cs50',
    badge: null,
  },
  {
    name: 'Discord',
    url: 'https://discord.gg/cs50',
    badge: 'Q&A',
  },
  {
    name: 'Ed',
    url: 'https://cs50.edx.org/ed',
    badge: 'Q&A',
  },
  {
    name: 'Facebook Group',
    url: 'https://www.facebook.com/groups/cs50/',
    badge: 'Q&A',
  },
  {
    name: 'Facebook Page',
    url: 'https://www.facebook.com/cs50/',
    badge: null,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/cs50',
    badge: null,
  },
  {
    name: 'Gitter',
    url: 'https://gitter.im/cs50/x',
    badge: 'Q&A',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/cs50',
    badge: null,
  },
];

const CommunityLink = ({ name, url, badge }) => (
  <li data-marker="*" className="small">
    <span className="fa-li">
      <i className="fas fa-square"></i>
    </span>
    <a href={url} target="_blank" rel="noreferrer">
      {name}
    </a>
    {badge && (
      <span className="badge bg-light ms-1 py-1 rounded-pill text-dark">
        {badge}
      </span>
    )}
  </li>
);

export default function Communities() {
  return (
    <details>
      <summary>
        <i className="fa fa-users"></i> Communities
      </summary>
      <ul className="fa-ul ms-3">
        {COMMUNITY_LINKS.map((link) => (
          <CommunityLink
            key={link.name}
            name={link.name}
            url={link.url}
            badge={link.badge}
          />
        ))}
      </ul>
    </details>
  );
}
