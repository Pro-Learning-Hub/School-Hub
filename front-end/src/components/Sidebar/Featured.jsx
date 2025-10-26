import React from 'react';
import { Brain, Sparkles } from 'lucide-react';
import StudyWithMe from './StudyWithMe';

// Icon styles configuration
const ICON_STYLES = {
  width: '1.5rem',
  height: '1.5rem',
};

// Featured links configuration
const FEATURED_LINKS = [
  {
    name: 'Notion',
    url: 'https://www.notion.so/',
    icon: 'https://www.notion.com/front-static/favicon.ico',
    type: 'image',
  },
  {
    name: 'Tic Tic',
    url: 'https://ticktick.com/webapp/#q/all/habit',
    icon: 'https://img.icons8.com/fluency/48/tick-tick.png',
    type: 'image',
    alt: 'tick-tick',
  },
  {
    name: 'Learn How To Learn for Youth',
    url: 'https://www.coursera.org/learn/learning-how-to-learn-youth/',
    icon: 'https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-v2-32x32.png',
    type: 'image',
    alt: 'Coursera',
  },
  {
    name: 'Learn How To Learn',
    url: 'https://www.coursera.org/learn/learning-how-to-learn',
    icon: Brain,
    type: 'component',
  },
  {
    name: 'Flocus',
    url: 'https://flocus.com/',
    icon: 'https://flocus.com/resources/assets/favicon.jpg',
    type: 'image',
  },
  {
    name: 'Study Together',
    url: 'https://studytogether.com/',
    icon: 'https://cdn.prod.website-files.com/60890f6ac44206aef9237eb4/60bf58e7f22ec73793160127_Favicon-small.png',
    type: 'image',
    alt: 'StudyTogether',
  },
  {
    name: 'Forest',
    url: 'https://forestapp.cc',
    icon: 'https://www.forestapp.cc/favicon.ico',
    type: 'image',
    alt: 'Forest App.. Stay focused.. Be present',
  },
  {
    name: 'SleepTown',
    url: 'https://sleeptown.seekrtech.com/',
    icon: 'https://sleeptown.seekrtech.com/img/icon_128_round.png',
    type: 'image',
    alt: 'SleepTown...Build Healthy Sleep Habits',
  },
  {
    name: 'RemindMe',
    url: 'https://remindme-l.vercel.app',
    icon: 'https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/17746265/ai_logo_1726750030_AyBzw8.png',
    type: 'image',
    alt: 'RemindMe',
  },
];

const FeaturedLink = ({ name, url, icon, type, alt }) => {
  const renderIcon = () => {
    if (type === 'component') {
      const IconComponent = icon;
      return <IconComponent style={ICON_STYLES} />;
    }
    return (
      <img
        src={icon}
        alt={alt || name}
        style={ICON_STYLES}
      />
    );
  };

  return (
    <li>
      <a href={url} target="_blank" rel="noreferrer">
        {renderIcon()}
        {name}
      </a>
    </li>
  );
};

export default function Featured() {
  return (
    <details open>
      <summary className="text-sm font-semibold leading-6 text-gray-900">
        <Sparkles /> Featured
      </summary>
      <ul>
        {FEATURED_LINKS.map((link) => (
          <FeaturedLink
            key={link.name}
            name={link.name}
            url={link.url}
            icon={link.icon}
            type={link.type}
            alt={link.alt}
          />
        ))}
        <li>
          <StudyWithMe iconStyles={ICON_STYLES} />
        </li>
      </ul>
    </details>
  );
}
