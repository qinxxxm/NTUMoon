import { useEffect,useState }from 'react'
import { useAuthContext } from "../hooks/useAuthContext"
import CourseList from '../components/courseList'
import SideNavBar from '../components/sideNavBar'
import  '../styles/review.css';
import { useParams } from 'react-router-dom';
import CourseReview from '../components/courseReview'
import CourseRating from '../components/courseRating';

const Review = () => {
  const[comments, setComments] = useState('')
  const[course, setCourse] = useState('')
  const {user} = useAuthContext()
  let { courseCode } = useParams()

useEffect(() => {
  const fetchComments = async () => {
    const response = await fetch('http://localhost:3001/api/comments/', {
      method: 'POST',
      Accept: 'application/json',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        courseCode: courseCode
      })
    })
    const json = await response.json()

    if (response.ok) {
      setComments(json)
    }
  }
  fetchComments()

  const fetchCourse = async () => {
    const response = await fetch('http://localhost:3001/api/courses/') /* will eventually want to fetch specific course id */
    const json = await response.json()

    if (response.ok) {
      setCourse(json)
      console.log(course)
    }
  }
  fetchCourse()

},[])

  return (
    <div className="course-page">
      <div className="course-descript">
        <SideNavBar></SideNavBar>
          <div>
            <div className="course-detail">
              {course && course.map(course => (
                courseCode === course.courseCode ? <CourseList course={course} key={course._id} /> : null
              ))}
            </div>
            <div className="course-reviews container">
              {comments && comments.map(comment => (
                comment.reviews && comment.reviews.map(rating => (
                  <CourseRating rating={rating} key={rating._id} />
                ))
              ))}
              <form className="row review-form">
                  <div className="col-9">
                      <div className="row">
                          <input className="add-comment-field col-9" name="comment" type="text" placeholder='Add your comments here'/>
                          <input className="add-rating-field col-3" name="rating" type="number" min="0" max="5" step="0.1" placeholder='Rating:'/>
                      </div>
                  </div>  
                  <div className="col-3">
                    <button className="btn btn-primary btn-lg">Add Review</button>
                  </div>              
              </form>
              <div className="review">
                {comments && comments.map(comment => (
                  comment.commentDetails && comment.commentDetails.map(commentDetail => (
                    <CourseReview comment={commentDetail} key={commentDetail._id} />
                  ))                  
                ))}
              </div>
           </div>
          </div>
          
      </div>       
 
    </div>
  )
}

export default Review