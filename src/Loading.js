import React from "react";
import './loading.css'
export default function Loading() {
  return (
    <div className="container">
        <div className="pyramid-loader">     
         <div className="wrapper">
        <span className="side side1"></span>
        <span className="side side2"></span>
        <span className="side side3"></span>
        <span className="side side4"></span>
        <span className="shadow"></span>
      </div>
    </div>
    </div>
    
  );
}
