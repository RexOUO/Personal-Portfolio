import { profile } from './content';
import { AvatarWithStatus } from './components/AvatarWithStatus';
import { IconLinks } from './components/IconLinks';
import { ParticleBackground } from './components/ParticleBackground';
import { ThemeToggle } from './components/ThemeToggle';
import { TiltCard } from './components/TiltCard';
import { Typewriter } from './components/Typewriter';
import { DESKTOP_QUERY, REDUCED_MOTION_QUERY, useMediaQuery } from './hooks/useMediaQuery';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggle } = useTheme();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const effects = isDesktop && !reducedMotion;

  return (
    <>
      {effects && <ParticleBackground theme={theme} />}
      <ThemeToggle theme={theme} onToggle={toggle} />

      <TiltCard enabled={effects}>
        <AvatarWithStatus />

        <h1 className="name depth-1">{profile.name}</h1>
        <div className="depth-1">
          <Typewriter words={profile.roles} reducedMotion={reducedMotion} />
        </div>

        <IconLinks />

        <section className="bio depth-1" aria-label="About">
          <ul>
            {profile.bio.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <ul className="skills depth-2" aria-label="Skills">
          {profile.skills.map((skill) => (
            <li key={skill} className="skill" tabIndex={0}>
              {skill}
            </li>
          ))}
        </ul>
      </TiltCard>
    </>
  );
}
