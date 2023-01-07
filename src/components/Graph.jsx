import { useEffect } from "react";
import { Calendar } from "react-calendar"
import 'react-calendar/dist/Calendar.css';

const Graph = ({classes}) => {

    useEffect(()=>{
        console.log(classes)
    },[])
  return (
    <div className="graph">
    <Calendar tileClassName={({ date, view }) => {
      if(classes.includes(date.toLocaleDateString())){
       return  'highlight'
      }
    }}/>
  </div>
  )
}

export default Graph
