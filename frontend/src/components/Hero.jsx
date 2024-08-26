import { Container, Card, Button } from 'react-bootstrap';
import BarChart from './BarChart';

const Hero = () => {
   // Sample data for banner count and graph
   const bannerStats = [
    { platform: 'TJ', count: 5, brandLogoImg : '/tractor-icon.svg' },
    { platform: 'TR', count: 10, brandLogoImg : '/truck-icon.svg' },
    { platform: 'TG', count: 8, brandLogoImg : '/tg-icon.png' },
    { platform: 'IJ', count: 6, brandLogoImg : '/IJ-icon.png' },
    { platform: 'BJ', count: 12, brandLogoImg : '/bike-icon.svg' },
  ];
  // Sample graph data
  const graphData = [5, 10, 15, 20, 25];
  
  return (
          <div className='dashboard-bannerBox'>
          <div className='banner-box px-0 px-md-4 px-3 py-md-3 py-3'>
          <h2 className='mb-2'>Banner Statistics</h2>
            <div className='row hero-card transparent border-0 mt-md-4 mt-3'>
              
              {/* Display card view for each platform */}
              {bannerStats.map((stat, index) => (
                <div key={index} className="platform-card col-xl-3 col-lg-4 col-md-6 col-12">
                  <div className='box-outline-shadow p-3 gap-2 d-flex'>
                    <div class="brandLogo">
                      <img
                        src={stat.brandLogoImg} width="30" height="27" className="img-fluid" alt="Brand Logo" />
                    </div>
                    <div class="platform-content">
                      <p><strong>Platform :</strong> {stat.platform}</p>
                      <p><strong>Total Banners :</strong> {stat.count}</p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
              {/* Graph display */}
              <div class="boxLayout p-md-4 p-3 box-outline-shadow my-3">
                <BarChart/>
              </div>
            {/* <BusinessTypeDistribution1 /> */}
          </div>
        </div>
      );
};


export default Hero;
