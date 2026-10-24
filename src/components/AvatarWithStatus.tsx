import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { FaDiscord } from 'react-icons/fa6';
import { FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';
import { profile, ui } from '../content';
import { useLanyard } from '../hooks/useLanyard';

/**
 * Round avatar with a Discord status dot.
 * Mouse: hovering the dot opens the Discord card. Touch: tapping the dot toggles it.
 */
export function AvatarWithStatus() {
  const presence = useLanyard(profile.discordId);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const lastPointer = useRef('');

  const status = presence?.status ?? 'offline';
  const statusLabel = presence ? ui.status[presence.status] : ui.status.unknown;

  // Close when tapping/clicking anywhere else, or pressing Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const show = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = (e: ReactPointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    closeTimer.current = window.setTimeout(() => setOpen(false), 180);
  };

  const copyUsername = async () => {
    if (!presence) return;
    try {
      await navigator.clipboard.writeText(presence.username);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked — the username is still visible on the card.
    }
  };

  return (
    <div className="avatar-wrap depth-2">
      <img className="avatar" src={profile.avatar} alt={profile.avatarAlt} width={128} height={128} />

      <div className="status-anchor" ref={wrapRef} onPointerEnter={show} onPointerLeave={hide}>
        <button
          type="button"
          className={`status-dot status-${status}`}
          aria-label={`Discord: ${statusLabel}`}
          aria-expanded={open}
          onPointerDown={(e) => (lastPointer.current = e.pointerType)}
          // Mouse users already opened it by hovering, so a click keeps it open.
          onClick={() => setOpen((o) => (lastPointer.current === 'mouse' ? true : !o))}
        />

        {open && (
          <div className="discord-card" role="dialog" aria-label="Discord profile">
            <div className="discord-head">
              <div className="discord-avatar">
                {presence?.avatarUrl ? (
                  <img src={presence.avatarUrl} alt="" width={48} height={48} />
                ) : (
                  <FaDiscord aria-hidden="true" />
                )}
                <span className={`mini-dot status-${status}`} />
              </div>
              <div className="discord-names">
                <strong>{presence?.displayName ?? 'Discord'}</strong>
                {presence && <span>@{presence.username}</span>}
              </div>
            </div>

            <p className="discord-status">
              <span className={`mini-dot inline status-${status}`} />
              {statusLabel}
            </p>

            {presence && (
              <div className="discord-actions">
                <button type="button" onClick={copyUsername}>
                  {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
                  {copied ? ui.copied : ui.copyUsername}
                </button>
                <a
                  href={`https://discord.com/users/${presence.userId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiExternalLink aria-hidden="true" />
                  {ui.openProfile}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
