import { Calendar } from "react-calendar"
import 'react-calendar/dist/Calendar.css';

const Graph = ({bjjClasses, mtClasses}) => {

  console.log(bjjClasses)

  return (
    <div className="graph">
    <Calendar tileClassName={({ date, view }) => {
      if(bjjClasses.includes(date.toJSON().slice(0, 10)) && mtClasses.includes(date.toJSON().slice(0, 10))){
       return  'bjj-mt'
      }
      if(bjjClasses.includes(date.toJSON().slice(0, 10))){
        return  'bjj'
      }
      if(mtClasses.includes(date.toJSON().slice(0, 10))){
        return  'mt'
      }
    }}/>
  </div>
  )
}

export default Graph
