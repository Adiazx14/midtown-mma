import { Calendar } from "react-calendar"
import 'react-calendar/dist/Calendar.css';

const Graph = ({bjjClasses, mtClasses}) => {

  console.log(bjjClasses)

  return (
    <div className="graph">
    <Calendar tileClassName={({ date, view }) => {
      if(bjjClasses.includes(date.toLocaleDateString()) && mtClasses.includes(date.toLocaleDateString())){
       return  'bjj-mt'
      }
      if(bjjClasses.includes(date.toLocaleDateString())){
        return  'bjj'
      }
      if(mtClasses.includes(date.toLocaleDateString())){
        return  'mt'
      }
    }}/>
  </div>
  )
}

export default Graph
