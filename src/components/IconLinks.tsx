import { useState } from 'react';
import { FaEnvelope, FaFileLines, FaGithub, FaLinkedin } from 'react-icons/fa6';
import { profile, ui } from '../content';

/** GitHub / LinkedIn / Email / Resume buttons with hover labels. */
export function IconLinks() {
  const [copied, setCopied] = useState(false);
  const { github, linkedin, email, resume } = profile.links;

  // Many people have no mail app set up, so the address is also copied.
  const onEmailClick = () => {
    navigator.clipboard
      ?.writeText(email)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {});
  };

  return (
    <nav className="icon-links depth-1" aria-label="Links">
      <a className="icon-btn" href={github} target="_blank" rel="noopener noreferrer" aria-label={ui.github}>
        <FaGithub aria-hidden="true" />
        <span className="tip">{ui.github}</span>
      </a>
      <a className="icon-btn" href={linkedin} target="_blank" rel="noopener noreferrer" aria-label={ui.linkedin}>
        <FaLinkedin aria-hidden="true" />
        <span className="tip">{ui.linkedin}</span>
      </a>
      <a
        className="icon-btn"
        href={`mailto:${email}`}
        onClick={onEmailClick}
        aria-label={`${ui.email}: ${email}`}
      >
        <FaEnvelope aria-hidden="true" />
        <span className={`tip ${copied ? 'tip-show' : ''}`}>{copied ? ui.copied : email}</span>
      </a>
      <a className="icon-btn" href={resume} target="_blank" rel="noopener noreferrer" aria-label={ui.resume}>
        <FaFileLines aria-hidden="true" />
        <span className="tip">{ui.resume}</span>
      </a>
    </nav>
  );
}
