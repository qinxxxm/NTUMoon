import SideNavBar from "../components/sideNavBar"
import React, { useState, useEffect } from "react"
import "../styles/timetable.css"
import Calendar from "../components/Calendar"
import { useAuthContext } from "../hooks/useAuthContext"
const Timetable = () => {
  const { user } = useAuthContext()
  const [courses, setCourses] = useState(null)
  const [events, setEvents] = useState("")
  const [idEvent , setId] = useState("")
  var totalAu = 0
  const backColor = [
    "#f37021",
    "#f37021",
    "#6aa84f",
    "#f1c232",
    "#cc4125",
    "#cc4125",
  ]
  useEffect(() => {
    const fetchMods = async () => {
      const response = await fetch(
        "http://localhost:3001/api/courses/getUserCourses",
        {
          method: "GET",
          Accept: "application/json",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      const json = await response.json()

      if (response.ok) {
        setCourses(json)
        setEvents(createEvent(json)) // I JUST MOVED line 67 and 68 here and it works
        // console.log(json)
        // console.log(events)
      } else {
        console.log("error")
      }
    }
    fetchMods()
    var i = 0
    const createEvent = (courses) => {
      var module = []
      {
        courses &&
          courses.map((course) => {
            // const id = i
            const text = course.courseCode
            const courseIndex = course.index
            i = i + 1
            course.details.map((obj) => {
              var event = {}
              event.id = parseInt(obj._id)
              event.text =
                text +
                "\n" +
                obj.timeStart +
                "-" +
                obj.timeEnd +
                "\n" +
                obj.venue
              event.start = convertText(obj.timeStart)
              event.end = convertText(obj.timeEnd)
              event.resource = obj.day
              event.backColor = backColor[i]
              event.index = text + "  |  " + courseIndex
              module.push(event)
            })
          })
      }
      return module
    }
    // console.log(createEvent(courses))
    // setEvents(createEvent(courses))
  }, [])

  {
    courses &&
      courses.map((course) => {
        console.log(course.details[0].day)
        totalAu += course.au
      })
  }

  const convertText = (x) => {
    var intX = parseInt(x)
    intX = intX - 800
    var minutes = intX % 100
    var hours = Math.floor(intX / 100)
    var strMin = minutes.toString()
    var strHours = hours.toString()
    if (strMin === "0") {
      strMin = strMin.concat("0")
    }
    if (strHours.length === 1) {
      strHours = "0" + strHours
    }
    var actualTime = "2000-01-01T" + strHours + ":" + strMin + ":00"
    return actualTime
  }
  // var i = 0
  // const createEvent = (courses) => {
  //   var module = []
  //   {
  //     courses &&
  //       courses.map((course) => {
  //         // const id = i
  //         const text = course.courseCode
  //         course.details.map((obj) => {
  //           var event = {}
  //           event.id = parseInt(obj._id)
  //           event.text = text
  //           event.start = convertText(obj.timeStart)
  //           event.end = convertText(obj.timeEnd)
  //           event.resource = obj.day
  //           event.backColor = "#f37021"
  //           i = i + 1
  //           module.push(event)
  //         })
  //       })
  //   }
  //   return module
  // }
  // console.log(createEvent(courses))
  // const events = createEvent(courses)

  //console.log(courses)
  //console.log(courses[0].courseCode)
  // const fetchMods = async () => {
  //   const response = await fetch(
  //     "http://localhost:3001/api/courses/getUserCourses",
  //     {
  //       method: "GET",
  //       Accept: "application/json",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     }
  //   )
  //   const json = await response.json()

  //   if (response.ok) {
  //     setCourses(json)
  //   } else {
  //     console.log("error")
  //   }
  // }
  // fetchMods()
  // console.log(courses)
  // raw_json = fetchMods()
  // const printAddress = () => {
  //   fetchMods().then((a) => {
  //     raw_events.push(a)
  //   })
  // }
  // printAddress()
  // console.log(raw_json)

  // const events = [
  //   {
  //     id: 1,
  //     text: "CZ4031\n yolo",
  //     start: "2000-01-01T00:00:00",
  //     end: "2000-01-01T05:30:00",
  //     backColor: "#fcb711",
  //     resource: "mon",
  //   },
  //   {
  //     id: 2,
  //     text: "CZ3002",
  //     start: "2000-01-01T02:00:00",
  //     end: "2000-01-01T04:00:00",
  //     backColor: "#f37021",
  //     resource: "tue",
  //   },
  //   {
  //     id: 3,
  //     text: "MDP",
  //     start: "2000-01-01T00:30:00",
  //     end: "2000-01-01T02:30:00",
  //     backColor: "#f37021",
  //     resource: "fri",
  //   },
  // ]

  const addedMods = []
  {
    events &&
      events.map((obj) => {
        var temp = obj.index
        if (!addedMods.includes(temp)) {
          addedMods.push(temp)
        }
      })
  }
  const callbackHandler = (data) =>{
    setId(data)
    console.log(idEvent)
  }


  return (
    <div className="timetable">
      <SideNavBar></SideNavBar>
      <div className="timetable-cont">
        <div className="col-10">
          {events && (
            <Calendar
              events={events}
              timetableCallBack = {callbackHandler}
            ></Calendar>
          )}
        </div>
        <div className="col-2 timetable-courses">
          <ul>
            <label className="pb-3">Courses Registered: </label>
            {addedMods.map((mod) => (
              <li key={mod}>{mod}</li>
            ))}
            <div className="timetable-line"></div>
            <div className="mt-3">Total AU: {totalAu}</div>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Timetable
