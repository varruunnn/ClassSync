import PerformanceChart from "@/components/dashboard/Students/PerformanceChart"
import {  performanceHistory } from "@/data/mockData";

const Test = () => {
  return (
    <div>
      <PerformanceChart   performanceData={performanceHistory}/>
    </div>
  )
}

export default Test
