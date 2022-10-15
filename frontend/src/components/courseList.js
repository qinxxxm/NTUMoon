import { Link } from "react-router-dom"

const CourseList = ({ course }) => {
  return (
    <div className="container-md">
      <div className="row">
        <Link style={{ textDecoration: 'none'}} to={`/review/${course.courseCode}`} >
          <h1 className="course-code">{course.courseCode}</h1>
        </Link>
        <h2>{course.courseTitle}</h2>        
        <p>{course.au} AUs</p>    
        <hr class="solid"></hr>
      </div>
      <div className="row">
        <div className="col-9">
          <p>{course.description}</p>
          <p><strong>Prerequisites: </strong>{course.prerequisites}</p>
          {/* need a button here to see the indexes, maybe go new page? */}
        </div>
        <div className="col-3 test">
          <p><strong>Exam Date</strong></p>
          {/* <p>{course.examDate}</p> need backend to include examDate */}
          <p>26 November 2022</p>
          <button type="button" className="add-to-tt">Add to Timetable</button>
        </div>
      </div>
      <hr class="solid"></hr>
    </div>
  )
}

export default CourseList