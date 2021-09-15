import useResolution from '@Lib/hooks/useResolution';
import HeaderDesktop from '@Components/Header/Desktop';
import HeaderMobile from '@Components/Header/Mobile';
import { ResolutionBreakPoints } from '@Enums/config/resolution-breakpoints';

const Header = () => {
  const width = useResolution();

  return (
    <>
      {width > ResolutionBreakPoints.SM ? <HeaderDesktop /> : <HeaderMobile />}
    </>
  );
};

export default Header;
