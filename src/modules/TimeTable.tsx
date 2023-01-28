import React from "react";
import { Course, CourseSection } from "../services/datamod";

function TimeTable(props: { courses: CourseSection[], chosenCourses: Course[] }) {
    return (
        <div>
            <table>
                <tbody>
                    {
                        eventListJSX(convertSectionsToEventList(props.courses), props.chosenCourses)
                    }
                </tbody>

            </table>
        </div>
    )
}
function eventListJSX(EventList: CourseSection[][][], chosenCourses: Course[]) {
    return (EventList.map(
        (EventsForTheDay, DayNumber) => {
            return (
                <tr key={DayNumber}>
                    <th>{DayNumber + 1}</th>
                    {
                        EventsForTheDay.map((EventsForThePeriod, PeriodNumber) => {
                            return (<td
                                key={PeriodNumber}
                                style={{ background: (EventsForThePeriod.length > 1) ? "yellow" : "white" }}
                            >{EventsForThePeriod.map((Event) => {
                                let index = chosenCourses.findIndex((a) => a.courseNumber === Event.course.courseNumber)
                                return (<div
                                    key={Event.course.name + PeriodNumber + " " + DayNumber}
                                    color={"Red"}
                                    className={index + ""}
                                >{Event.course.name}</div>)
                            })}</td>)
                        })
                    }
                </tr>)
        })
    );
}
function convertSectionsToEventList(courses: CourseSection[]) {
    let EventList: CourseSection[][][] = [];
    for (let i = 0; i < 5; i++) {
        EventList[i] = [];
        for (let j = 0; j < 9; j++) {
            EventList[i][j] = [];
        }
    }
    courses.forEach(courseSection => {
        if (!courseSection.course.lectureSections)
            return;
        let lectureTimings = courseSection.course.lectureSections[courseSection.lectureIndex].timings;
        for (let i = 0; i < lectureTimings.length; i++) {
            for (let j = 0; j < lectureTimings[i].length; j++) {
                EventList[i][lectureTimings[i][j] - 1].push(courseSection);
            }
        }
        if (courseSection.course.practicalSections) {
            let practicalTimings = courseSection.course.practicalSections[courseSection.practicalIndex].timings;
            for (let i = 0; i < practicalTimings.length; i++) {
                for (let j = 0; j < practicalTimings[i].length; j++) {
                    let { course: { name: Cname, ...restCourse }, ...restSection } = courseSection;
                    EventList[i][practicalTimings[i][j] - 1].push({ course: { name: Cname + "(P)", ...restCourse }, ...restSection });
                }
            }
        }
    });
    return EventList;
}



export default TimeTable;