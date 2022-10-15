import { useEffect,useState }from 'react'
import { useAuthContext } from "../hooks/useAuthContext"
import CourseList from '../components/courseList'
import SideNavBar from '../components/sideNavBar'

const Home = () => {
  const[courses, setCourses] = useState('')
  const[coursesDefault, setCoursesDefault] = useState('')
  const [input, setInput] = useState('');
  const {user} = useAuthContext()

  const updateInput = async (input) => {
    const filtered = coursesDefault.filter(course => {
      console.log(course.courseTitle)
     return course.courseTitle.toLowerCase().includes(input.toLowerCase())
    })
    setInput(input);
    setCourses(filtered);
 }

useEffect(() => {
  const fetchCourses = async () => {
    console.log("enter useeffect")
    const response = await fetch('http://localhost:3001/api/courses/')
    const json = await response.json()

    if (response.ok) {
      setCourses(json)
      setCoursesDefault(json)
      console.log(coursesDefault)
    }
  }
  fetchCourses()
  
},[])

  return (
    <div className="home">
      <SideNavBar></SideNavBar>
      <div className="course-detail">
        <input 
          style={{width:"20rem",background:"#F2F1F9", padding:"0.5rem", borderWidth: "1.5px", borderColor: "black", marginTop: "2rem"}}
          key="random1"
          value={input}
          placeholder={"Search Course"}
          onChange={(e) => updateInput(e.target.value)}
        />
        <div style={{marginTop: "2rem"}}>
          {courses && courses.map(course => (
              <CourseList course={course} key={course._id} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home