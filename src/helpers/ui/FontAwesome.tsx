"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faWhatsapp,
  faYoutube,
  faInstagram,
  faLinkedin,
  faXTwitter,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface Props {
  indexName: string;
  label: string;
  url?: string;
  color?: string;
}

const iconMap: Record<string, IconDefinition> = {
  facebook: faFacebook,
  whatsapp: faWhatsapp,
  youtube: faYoutube,
  instagram: faInstagram,
  linkedin: faLinkedin,
  twitter: faXTwitter,
  pinterest: faPinterest,
};

const SocialIconLink: React.FC<Props> = ({ indexName, label, url, color }) => {
  const icon = iconMap[indexName] || null;

  if (!icon) return null;

  const iconColor = color || "#FFFFFF"; // fallback white

  if (!url) {
    return (
      <span aria-label={label} title={label}>
        <FontAwesomeIcon
          icon={icon}
          style={{ color: iconColor, fontSize: "1.25rem" }}
        />
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      suppressHydrationWarning
    >
      <FontAwesomeIcon
        icon={icon}
        style={{ color: iconColor, fontSize: "1.25rem" }}
      />
    </a>
  );
};

export default SocialIconLink;
