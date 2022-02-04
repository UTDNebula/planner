type LandingBarItem = {
  title: string;
  href: string;
};

/**
 * Component properties for a LandingAppBar.
 */
interface LandingAppBarProps {
  items: LandingBarItem;
}

/**
 * TODO: Implement this component
 */
function AppBarSection({ item }: { item: LandingBarItem }): JSX.Element {
  return <div className="inline-block p-4 font-bold">{item}</div>;
}

const BAR_SECTIONS: LandingBarItem[] = [
  // { }
];

/**
 *
 */
export default function LandingAppBar(props: LandingAppBarProps): JSX.Element {
  const {} = props;
  return <nav className="p-4"></nav>;
}
