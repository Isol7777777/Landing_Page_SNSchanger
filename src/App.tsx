import LandingPageDesignRequest from "./imports/LandingPageDesignRequest-1-1096";

export default function App() {
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full">
        <div className="hidden lg:block">
          <div className="w-[1185px] mx-auto">
            <LandingPageDesignRequest />
          </div>
        </div>

        <div className="hidden md:block lg:hidden">
          <div className="w-full px-4">
            <div style={{ transform: 'scale(0.65)', transformOrigin: 'top center', width: '1185px', margin: '0 auto' }}>
              <LandingPageDesignRequest />
            </div>
          </div>
        </div>

        <div className="block md:hidden">
          <div className="w-full overflow-x-hidden">
            <div style={{ transform: 'scale(0.32)', transformOrigin: 'top left', width: '1185px' }}>
              <LandingPageDesignRequest />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
