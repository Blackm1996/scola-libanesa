import React, { useState } from "react";

const Page2 = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return <div>
    <table>
      <thead>
        <tr>
          <td></td>
          <td>cours1</td>
          <td>cours2</td>
          <td>cours3</td>
          <td>cours4</td>
          <td>cours5</td>
          <td>cours6</td>
          <td>cours7</td>
        </tr>
      </thead>
      <thead>
        <tr>
          <td>course0</td>
          <td>cours1</td>
          <td>cours2</td>
          <td>cours3</td>
          <td>cours4</td>
          <td>cours5</td>
          <td>cours6</td>
          <td>cours7</td>
        </tr>
      </thead>
    </table>
  </div>;
};

export default Page2;
