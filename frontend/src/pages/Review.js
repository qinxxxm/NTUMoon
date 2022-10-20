import { useEffect,useState }from 'react'
import { useAuthContext } from "../hooks/useAuthContext"
import IndivCourse from '../components/indivCourse'
import SideNavBar from '../components/sideNavBar'
import  '../styles/review.css';
import { useParams } from 'react-router-dom';
import CourseReview from '../components/courseReview'
import CourseRating from '../components/courseRating';
import { useAddReview } from '../hooks/useAddReview';
import { useAddRating } from '../hooks/useAddRating';
import { useCommentsContext } from '../hooks/useCommentsContext'; 
import { useUserCoursesContext } from '../hooks/useUserCoursesContext';

const Review = () => {
  // const[comments, setComments] = useState('')
  const {comments, dispatch} = useCommentsContext()
  const[course, setCourse] = useState('')
  const[averageRating, setAvgRating] = useState('')
  // const[userCourses, setUserCourses] = useState('')
  const {userCourses, dispatchCourses} = useUserCoursesContext()
  const {user} = useAuthContext()
  let { courseCode } = useParams()

  const[userComment, setUserComment] = useState('')
  const[userRating, setUserRating] = useState('')
  const[addReviewError, setErrorMsg] = useState('')
  const {review, reviewError, reviewIsLoading} = useAddReview()
  const {rating, ratingError, ratingIsLoading} = useAddRating()

  const handleSubmit = async(e) => {
    e.preventDefault()
    if(userComment !== '' && userRating !== ''){
      await review(courseCode, user.username, userComment)
      await rating(courseCode, userRating)
      setUserComment('')
      setErrorMsg('')
      setUserRating('')
    }
    else {
      setErrorMsg('Both comment and rating have to be filled!')
    }
  }


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
        dispatch({type: 'SET_COMMENTS', payload: json})
        console.log(json)
      }
    }
    fetchComments()

    const fetchCourse = async () => {
      const response = await fetch('http://localhost:3001/api/courses/') /* will eventually want to fetch specific course id */
      const json = await response.json()

      if (response.ok) {
        setCourse(json)
      }
    }
    fetchCourse()

    const fetchUserCourses = async () => {
      const response = await fetch('http://localhost:3001/api/courses/getUserCourses', {
        method: 'GET',
        Accept: 'application/json',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      })
      const json = await response.json()

      if (response.ok) {
        dispatchCourses({type: 'FETCH_COURSES', payload: json})
        console.log("usercourses", json)
      }else{
        dispatchCourses({type: 'FETCH_COURSES', payload: null})
        console.log("error", json)
      }
    }
    fetchUserCourses()

  },[courseCode, dispatch, dispatchCourses, user])

  useEffect(() => {
    const calculateAvgRating = async () => {
      let ratingSum = 0
      let i = 0
      comments && comments.map(comment => (
        comment.reviews && comment.reviews.map(rating => {
          ratingSum += rating.review
          i++
        })
      ))
      let avgRating = ratingSum / i
      avgRating = avgRating.toFixed(2)
      if(i>0){
        setAvgRating(avgRating)
      }
      console.log("avg rating: ", avgRating)
      console.log("ratingSum: ", ratingSum)
      console.log("average rating: ", averageRating)
    }

    if(comments){
      setAvgRating('')
      calculateAvgRating()
    }
  },[comments, averageRating])

  return (
    <div className="course-page">
      <div className="course-descript">
        <SideNavBar></SideNavBar>
          <div>
            <div className="course-detail">
              {userCourses && course && course.map(course => (
                courseCode === course.courseCode ? <IndivCourse course={course} userCourses={userCourses} key={course._id} /> : null
              ))}
            </div>
            <div className="course-reviews container">
              {/* {comments && comments.map(comment => (
                comment.reviews && comment.reviews.map(rating => (
                  <CourseRating rating={avgRating} key={rating._id} />
                ))
              ))} */}
              {averageRating !=='' && <CourseRating rating={averageRating} />}
              <form className="row review-form" onSubmit={handleSubmit}>
                  <div className="col-9">
                      <div className="row">
                          <input className="add-comment-field col-9" name="comment" type="text" value = {userComment} onChange={(e) => setUserComment(e.target.value)} placeholder='Add your comments here'/>
                          <input className="add-rating-field col-3" name="rating" type="number" min="0" max="5" step="0.1" value = {userRating} onChange={(e) => setUserRating(e.target.value)} placeholder='Rating:'/>
                      </div>
                  </div>  
                  <div className="col-3">
                    <button className="btn btn-primary btn-lg" disabled={reviewIsLoading || ratingIsLoading}>Add Review</button>
                  </div>
                  {reviewError && <div className="error">{reviewError}</div>}      
                  {ratingError && <div className="error">{ratingError}</div>}   
                  {addReviewError !== '' && <div className="error">{addReviewError}</div>}         
              </form>
              <div className="review">
                {comments && comments.map(comment => (
                  comment.commentDetails && comment.commentDetails.map(commentDetail => (
                    <CourseReview comment={commentDetail} courseCode ={courseCode} reviews={comment.reviews} key={commentDetail._id} />
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