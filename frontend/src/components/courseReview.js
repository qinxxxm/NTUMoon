const CourseReview = ({ comment }) => {
    return (
        <div className="indiv-review row">
            <h5 className="comment-user">{comment.user_id}</h5>
            <div className="col-9 row">
                <div className="col-9">
                    <p>{comment.comments}</p>
                </div>
                <div className="col-3">
                    <p className="user-rating">4.5</p>
                </div>
            </div>
        </div>
    )
  }
  
  export default CourseReview