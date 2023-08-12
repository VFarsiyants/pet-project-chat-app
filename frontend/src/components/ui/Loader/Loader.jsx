import './Loader.css'
import { useEffect, useRef } from 'react';

function Loader() {
  const pie1 = useRef();
  const pie2 = useRef();
  const pie3 = useRef();
  const pie4 = useRef();
  const circle = useRef();

  useEffect(() => {
    const frameDuration = 1;
    let pie1Scew = 90;
    let pie2Scew = 90;
    let pie3Scew = 90;
    let pie4Scew = 90;
    let pie1ScewRev = 0;
    let pie2ScewRev = 0;
    let pie3ScewRev = 0;
    let pie4ScewRev = 0;
    let circleRotate = 0;
    function rotateCircle() {
      circleRotate += 1;
      circle.current.style.transform = 
        `rotate(${circleRotate}deg)`;
    }
    const interval = setInterval(() => {
      if (pie1Scew != 0 && pie2Scew == 90 && pie3Scew == 90 && pie4Scew == 90) {
        pie1Scew -= 1;
        pie1.current.style.transform = 
          `skew(${pie1Scew}deg, ${pie1ScewRev}deg)`;
        rotateCircle();
      }
      if (pie1Scew == 0 && pie2Scew != 0 && pie3Scew == 90 && pie4Scew == 90) {
        pie2Scew -= 1;
        pie2.current.style.transform = 
          `rotate(90deg) skew(${pie2Scew}deg,  ${pie2ScewRev}deg)`;
        rotateCircle();
      }
      if (pie1Scew == 0 && pie2Scew == 0 && pie3Scew != 0 && pie4Scew == 90) {
        pie3Scew -= 1;
        pie3.current.style.transform = 
          `rotate(180deg) skew(${pie3Scew}deg, ${pie3ScewRev}deg)`;
        rotateCircle();
      }
      if (pie1Scew == 0 && pie2Scew == 0 && pie3Scew == 0 && pie4Scew != 0) {
        pie4Scew -= 1;
        pie4.current.style.transform = 
          `rotate(270deg) skew(${pie4Scew}deg, ${pie4ScewRev}deg)`;
        rotateCircle();
      }

      if (pie1Scew == 0 && pie2Scew == 0 && pie3Scew == 0 && pie4Scew == 0) {
        if (pie1ScewRev != 90 && pie2ScewRev == 0 
            && pie3ScewRev == 0 && pie4ScewRev == 0) {
          pie1ScewRev += 1;
          pie1.current.style.transform = 
            `skew(${pie1Scew}deg, ${pie1ScewRev}deg)`;
          rotateCircle();
        }
        if (pie1ScewRev == 90 && pie2ScewRev != 90
            && pie3ScewRev == 0 && pie4ScewRev == 0) {
          pie2ScewRev += 1;
          pie2.current.style.transform = 
            `rotate(90deg) skew(${pie2Scew}deg, ${pie2ScewRev}deg)`;
          rotateCircle();
        }
        if (pie1ScewRev == 90 && pie2ScewRev == 90
            && pie3ScewRev != 90 && pie4ScewRev == 0) {
          pie3ScewRev += 1;
          pie3.current.style.transform = 
            `rotate(180deg) skew(${pie3Scew}deg, ${pie3ScewRev}deg)`;
          rotateCircle();
        }
        if (pie1ScewRev == 90 && pie2ScewRev == 90
          && pie3ScewRev == 90 && pie4ScewRev != 90) {
          pie4ScewRev += 1;
          pie4.current.style.transform = 
            `rotate(270deg) skew(${pie4Scew}deg, ${pie4ScewRev}deg)`;
          rotateCircle();
        }

        if (pie1ScewRev == 90 && pie2ScewRev == 90
          && pie3ScewRev == 90 && pie4ScewRev == 90) {
            pie1Scew = 90;
            pie2Scew = 90;
            pie3Scew = 90;
            pie4Scew = 90;
            pie1ScewRev = 0;
            pie2ScewRev = 0;
            pie3ScewRev = 0;
            pie4ScewRev = 0;
            circleRotate = 0;
          }
      }
      
      if (circleRotate == 360) {
        circleRotate = 0;
      }
    }, frameDuration);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="circular-progress">
      <div className='inner_circular'></div>
      <div className="circular-progress-circle">
        <div
          ref={pie1}
          className="segment segmentpie1"
        />
        <div 
          ref={pie2}
          className="segment segmentpie2"
        />
        <div 
          ref={pie3}
          className="segment segmentpie3"
        />
        <div
          ref={pie4}
          className="segment segmentpie1"
        />
      </div>
      <div className='circul-edge-container' ref={circle}>
        <div className='circular-edge'>
        </div>
      </div>
      <div className='circul-edge-container'>
        <div className='circular-edge'>
        </div>
      </div>
    </div>
  )
}

export default Loader;