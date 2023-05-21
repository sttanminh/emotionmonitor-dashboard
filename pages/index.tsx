import { Layout } from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from './_app';
import React, {useState} from 'react';

const Page: NextPageWithLayout = () => {
  const [selectedOption, setSelectedOption] = useState("Project 1");
  const [selectedButton, setSelectedButton] = useState("By Task");

  const [buttonLabel1, setButtonLabel1] = useState("Task 1");
  const [buttonLabel2, setButtonLabel2] = useState("Week 1");

  
  const labels1 = ["Task 1", "Task 2", "Task 3"];
  const labels2 = ["Week 1", "Week 2", "Week 3"];

  const navigateOption1 = (direction) => {
    const currentIndex = labels1.indexOf(buttonLabel1);
    if (direction === "next" && currentIndex < labels1.length - 1) {
      setButtonLabel1(labels1[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      setButtonLabel1(labels1[currentIndex - 1]);
    }
  };

  const navigateOption2 = (direction) => {
    const currentIndex = labels2.indexOf(buttonLabel2);
    if (direction === "next" && currentIndex < labels2.length - 1) {
      setButtonLabel2(labels2[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      setButtonLabel2(labels2[currentIndex - 1]);
    }
  };

  const [segmentSelected, setSegmentSelected] = useState(1);

const selectSegment = (segment) => {
  setSegmentSelected(segment);
};
  
  
  return (
    
    <div style={{marginLeft: "90px", marginTop: "10px"}}>


      <div style={{ marginBottom: "20px", width: "100%"}}>
        <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}
        style={{ 
          width: "97%", 
          height: "50px", 
          appearance: "none", 
          borderRadius: "10px",
          borderColor: "black",
          paddingLeft: "0.5rem",
          paddingRight: "1.5rem",
          backgroundColor: "rgb(174, 173, 173)",
          fontSize: '23px',
          backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 8l5 5 5-5H5z"/></svg>')`,
          backgroundPosition: 'right 10px center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '24px',
        }}
        >
          <option value="Option 1">Project 1</option>
          <option value="Option 2">Project 2</option>
          {/* Add more options as needed */}
        </select>
      </div>

      <div style={{ marginBottom: "0px", border: "1px solid black", borderRadius: "8px", display: "flex", width: "18%", height: "27px", overflow: "hidden", background: "rgb(174, 173, 173)" }}>
        <button 
          style={{ flex: "1", padding: "10px", backgroundColor: selectedButton === "By Task" ?  "rgb(153, 204, 255)" : "transparent" , border: "none", color: "white" }}
          onClick={() => setSelectedButton("By Task")}
        >
          By Task
        </button>
        <button 
          style={{ flex: "1", padding: "10px", backgroundColor: selectedButton === "Overall" ? "rgb(153, 204, 255)" : "transparent", border: "none", color: "white" }}
          onClick={() => setSelectedButton("Overall")}
        >
          Overall
        </button>
      </div>


      <div style={{ display: "flex", alignItems: "center", padding: "10px", marginLeft: "250px", marginTop: "-40px" }}>
          <button style={{border: "none", backgroundColor: "transparent"}} onClick={() => navigateOption1("prev")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left" viewBox="0 0 16 16">
          <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z"/>
          </svg>  
          </button>
          <div style={{borderRadius: "5px", border: "1px solid black", padding: "5px", width: "70%", textAlign: "center", background: "rgb(233, 233, 233)"}}>{buttonLabel1}</div>
          <button style={{border: "none", backgroundColor: "transparent"}} onClick={() => navigateOption1("next")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right" viewBox="0 0 16 16">
  <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
</svg>
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "10px", marginLeft: "1130px", marginTop: "-51px"}}>
          <button style={{border: "none", backgroundColor: "transparent"}} onClick={() => navigateOption2("prev")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left" viewBox="0 0 16 16">
          <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z"/>
          </svg>  
          </button>
          <div style={{borderRadius: "5px", border: "1px solid black", padding: "5px", width: "50%", textAlign: "center", background: "rgb(233, 233, 233)"}}>{buttonLabel2}</div>
          <button style={{border: "none", backgroundColor: "transparent"}} onClick={() => navigateOption2("next")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right" viewBox="0 0 16 16">
  <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
</svg>
          </button>
        </div>
      
    <div style={{ display: 'flex', marginTop: '20px'}}>
      <div style={{ flex: '0 0 43%', marginRight: '20px', height: '300px', borderRadius: '10px', background: 'white' }}>
        /* Graph will go here */
        <div style={{ marginBottom: "0px", border: "1px solid black", borderRadius: "8px", display: "flex", width: "40%", height: "27px", overflow: "hidden", background: "rgb(174, 173, 173)", marginLeft: '360px', marginTop: '5px' }}>
            <button onClick={() => selectSegment(1)} style={{ flex: '1', backgroundColor: segmentSelected === 1 ? "rgb(153, 204, 255)" : "transparent" , border: "none", color: "white"  }}>Negative</button>
            <button onClick={() => selectSegment(2)} style={{ flex: '1', backgroundColor: segmentSelected === 2 ? "rgb(153, 204, 255)" : "transparent" , border: "none", color: "white"  }}>Positive</button>
            <button onClick={() => selectSegment(3)} style={{ flex: '1', backgroundColor: segmentSelected === 3 ? "rgb(153, 204, 255)" : "transparent" , border: "none", color: "white"  }}>All</button>
          </div>
      </div>
      <div style={{ flex: '0 0 43%', marginLeft: '10px', marginRight: '10px', height: '300px', borderRadius: '10px', background: 'white' }}>
        /* Task info will go here */
      </div>
    </div>

</div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  );
};

export default Page;
