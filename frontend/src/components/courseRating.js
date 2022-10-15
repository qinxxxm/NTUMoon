const CourseRating = ({ rating }) => {
    return (
        <div className="row mod-rating">
            <pre className="mod-reviews"> <strong>Module Reviews           {rating.review}/5 </strong></pre>
            <hr class="solid"></hr>
        </div>
    )
}
  
export default CourseRating