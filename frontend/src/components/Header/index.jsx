import useResolution from '../../lib/hooks/useResolution';
import HeaderDesktop from './Desktop';
import HeaderMobile from './Mobile';
import { ResolutionBreakPoints } from '../../enums/config/resolution-breakpoints';

const Header = () => {
  const width = useResolution();

  return (
    <>
      {width > ResolutionBreakPoints.SM ? <HeaderDesktop /> : <HeaderMobile />}
    </>
  );
};

export default Header;
