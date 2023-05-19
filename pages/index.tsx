import { Layout } from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from './_app';
import React, {useState} from 'react';

const Page: NextPageWithLayout = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  
  
  return (
    <div style={{marginLeft: "200px"}}>
      <div style={{ marginBottom: "20px" }}>
        <button style={{ marginRight: "10px" }}>Button 1</button>
        <button>Button 2</button>
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="Option 1">Option 1</option>
          <option value="Option 2">Option 2</option>
          {/* Add more options as needed */}
        </select>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: '1', marginRight: '10px', height: '200px', border: '1px solid black' }}>
          {/* Graph will go here */}
        </div>
        <div style={{ flex: '1', marginLeft: '10px', height: '200px', border: '1px solid black' }}>
          {/* Task info will go here */}
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
